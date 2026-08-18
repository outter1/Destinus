import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform, Pressable, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useAccessibility } from "../screens/AccessibilityContext";

const VLIBRAS_HTML = `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          width: 100%;
          height: 100%;
          background: transparent !important;
          overflow: hidden;
        }
        /* Posiciona o widget oficial no canto inferior direito */
        [vw] {
          position: absolute !important;
          right: 0 !important;
          bottom: 0 !important;
          left: auto !important;
          top: auto !important;
        }
      </style>
    </head>
    <body>
      <div id="text-target" style="display:none;"></div>
      <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
          <div class="vw-plugin-top-wrapper"></div>
        </div>
      </div>

      <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
      <script>
        var widget = new window.VLibras.Widget('https://vlibras.gov.br/app');

        function processTranslation(text) {
          if (!text) return;
          if (window.plugin && window.plugin.translate) {
            window.plugin.translate(text);
          } else if (widget) {
            try {
              widget.translate(text);
            } catch(e) {}
          }
        }

        window.addEventListener("message", function(event) {
          // Comando especial vindo do app nativo forçando o fechamento
          // (usado pelo botão de emergência "X" caso o player fique preso).
          if (event.data === "__force_close__") {
            forceClose();
            return;
          }
          processTranslation(event.data);
        });
        document.addEventListener("message", function(event) {
          if (event.data === "__force_close__") {
            forceClose();
            return;
          }
          processTranslation(event.data);
        });

        // Avisa o app React Native (ou a página pai, no caso web) quando o
        // player de Libras é aberto/fechado, para o app poder expandir a
        // área tocável só quando necessário e não tampar a barra de abas
        // o resto do tempo.
        function notifyParent(msg) {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(msg);
          } else if (window.parent) {
            window.parent.postMessage(msg, "*");
          }
        }

        var lastOpenState = false;
        function computeOpenState(wrapper) {
          if (!wrapper) return false;
          var style = window.getComputedStyle(wrapper);
          var hasActiveClass = wrapper.classList.contains("active");
          var isVisible = style.display !== "none" && style.visibility !== "hidden";
          // O player só ocupa espaço de verdade quando tem tamanho real na tela.
          var rect = wrapper.getBoundingClientRect();
          var hasSize = rect.width > 40 && rect.height > 40;
          return hasActiveClass && isVisible && hasSize;
        }

        function reportState(wrapper) {
          var opened = computeOpenState(wrapper);
          if (opened !== lastOpenState) {
            lastOpenState = opened;
            notifyParent(opened ? "vlibras-opened" : "vlibras-closed");
          }
        }

        function forceClose() {
          var wrapper = document.querySelector("[vw-plugin-wrapper]");
          var btn = document.querySelector("[vw-access-button]");
          try {
            // Tenta usar os próprios controles do VLibras para fechar
            // corretamente (evita estado inconsistente dentro do player).
            var closeBtn = document.querySelector("[vw-plugin-wrapper] .vpw-close, [vw-plugin-wrapper] .close-icon, [vw-plugin-wrapper] [aria-label='Fechar']");
            if (closeBtn) closeBtn.click();
            else if (wrapper && wrapper.classList.contains("active")) wrapper.classList.remove("active");
          } catch (e) {}
          lastOpenState = false;
          notifyParent("vlibras-closed");
        }

        function watchAccessButton() {
          var btn = document.querySelector("[vw-access-button]");
          var wrapper = document.querySelector("[vw-plugin-wrapper]");
          if (!btn || !wrapper) {
            setTimeout(watchAccessButton, 500);
            return;
          }

          // Em vez de depender só do clique no botão de abrir (o que não
          // captura quando o usuário fecha pelo X interno do próprio
          // player), observamos diretamente mudanças reais no DOM do
          // player. Isso cobre qualquer forma de abrir/fechar.
          var observer = new MutationObserver(function () {
            reportState(wrapper);
          });
          observer.observe(wrapper, {
            attributes: true,
            attributeFilter: ["class", "style"],
            subtree: true,
          });

          // Rede de segurança: verifica periodicamente o estado real,
          // caso o VLibras altere o DOM de um jeito que o MutationObserver
          // não pegue diretamente.
          setInterval(function () {
            reportState(wrapper);
          }, 500);

          reportState(wrapper);
        }
        watchAccessButton();
      </script>
    </body>
  </html>
`;

export function LibrasAvatar() {
  const { librasEnabled, textToTranslate } = useAccessibility();
  const webViewRef = useRef<WebView>(null);
  const iframeRef = useRef<any>(null);
  // Começa "fechado" (só o botão pequeno). Só vira tela cheia quando o
  // próprio widget do VLibras avisa que foi aberto — assim ele nunca fica
  // cobrindo a barra de abas (Perfil, Reservas etc.) sem necessidade.
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (textToTranslate && librasEnabled) {
      if (Platform.OS === "web") {
        iframeRef.current?.contentWindow?.postMessage(textToTranslate, "*");
      } else {
        webViewRef.current?.postMessage(textToTranslate);
      }
    }
  }, [textToTranslate, librasEnabled]);

  const handleWebMessage = (data: string) => {
    if (data === "vlibras-opened") setIsOpen(true);
    if (data === "vlibras-closed") setIsOpen(false);
  };

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const listener = (event: MessageEvent) => {
      if (typeof event.data === "string") handleWebMessage(event.data);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  // Botão de emergência: fica FORA da WebView (é uma View nativa comum),
  // então continua funcionando mesmo se o player do VLibras travar e não
  // avisar corretamente que foi fechado. Garante que o usuário sempre
  // consiga liberar a tela (e voltar a tocar em "Perfil", "Reservas" etc.)
  // mesmo em caso de bug no widget de terceiros.
  const handleForceClose = () => {
    setIsOpen(false);
    if (Platform.OS === "web") {
      iframeRef.current?.contentWindow?.postMessage("__force_close__", "*");
    } else {
      webViewRef.current?.postMessage("__force_close__");
    }
  };

  if (!librasEnabled) return null;

  return (
    // Fragment (não uma View única): o botão de fechar fica como um IRMÃO
    // da caixa da WebView, não um FILHO dela. Isso importa porque WebView
    // é renderizada pelo sistema como uma camada nativa separada — em
    // muitos aparelhos (principalmente Android) essa camada "flutua" por
    // cima de qualquer View comum que esteja dentro do MESMO container,
    // mesmo que essa View venha depois no código. Ou seja: o "✕" era
    // desenhado por cima visualmente, mas o toque continuava sendo
    // capturado pela WebView por baixo. Sendo irmão (fora do container da
    // WebView), o botão passa a ser sua própria camada nativa e recebe o
    // toque de verdade.
    <>
      <View
        style={[styles.widgetContainer, isOpen && styles.widgetContainerOpen]}
        pointerEvents="box-none"
      >
        {Platform.OS === "web" ? (
          <iframe
            ref={iframeRef}
            srcDoc={VLIBRAS_HTML}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              backgroundColor: "transparent",
            }}
          />
        ) : (
          <WebView
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: VLIBRAS_HTML }}
            style={styles.webview}
            containerStyle={{ backgroundColor: "transparent" }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={(event) => handleWebMessage(event.nativeEvent.data)}
          />
        )}
      </View>

      {isOpen && (
        <Pressable
          onPress={handleForceClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar intérprete de Libras"
          style={styles.closeButton}
          hitSlop={12}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // Estado padrão: só o botão flutuante do VLibras, pequeno e posicionado
  // ACIMA da barra de abas (bottom: 90) para nunca tampar "Perfil"/"Reservas".
  widgetContainer: {
    position: "absolute",
    bottom: 90,
    right: 12,
    width: 70,
    height: 70,
    zIndex: 999999,
    backgroundColor: "transparent",
  },
  // Estado aberto (usuário tocou no botão e o player de Libras está em uso):
  // expande para dar espaço de verdade ao vídeo/intérprete, mas o "bottom"
  // continua o MESMO do estado fechado (acima da barra de abas), só que
  // com altura suficiente para o personagem inteiro (cabeça incluída)
  // aparecer sem cortar. Antes isso ficava em bottom:12 (quase colado no
  // rodapé) e a WebView acabava tampando a barra de abas mesmo com espaço
  // "vazio" visualmente; mantendo o mesmo bottom do estado fechado, a área
  // tocável nunca alcança a barra de abas, aberto ou fechado.
  widgetContainerOpen: {
    bottom: 90,
    width: 320,
    height: 480,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  // Botão nativo de emergência para fechar o player. Agora é IRMÃO da
  // caixa da WebView (não filho dela) — por isso as coordenadas são
  // calculadas para cair exatamente no canto superior direito da caixa
  // aberta (widgetContainerOpen: bottom 90, right 12, largura 320, altura
  // 480), em vez de usar "top/right" relativos a um container pai que ele
  // não tem mais.
  closeButton: {
    position: "absolute",
    bottom: 90 + 480 - 32 - 6, // = 532: perto do topo da caixa aberta
    right: 12 + 6, // = 18: perto da borda direita da caixa aberta
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000000,
    elevation: 1000000,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});