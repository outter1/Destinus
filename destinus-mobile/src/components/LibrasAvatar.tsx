import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform, Pressable, Text, PanResponder, Dimensions } from "react-native";
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

  // Troca o "key" da WebView/iframe força ela a ser recriada do zero pelo
  // React, sempre num estado limpo e fechado. Isso resolve o botão "X" de
  // vez: antes ele tentava convencer o player do VLibras (código de
  // terceiro, fora do nosso controle) a se fechar sozinho — e às vezes o
  // próprio VLibras "reabria" a classe/estado internamente logo em seguida,
  // fazendo o "X" parecer que não funcionou. Recriando o componente do
  // zero, não existe mais nenhum estado interno do VLibras para "voltar" —
  // é garantido que ele nasce fechado.
  const [instanceKey, setInstanceKey] = useState(0);

  // Posição do widget na tela. Começa no canto inferior direito (mesmo
  // lugar de antes), mas agora pode ser arrastado livremente pelo usuário
  // segurando a alcinha (⠿) no canto do botão.
  const [position, setPosition] = useState(() => {
    const { width, height } = Dimensions.get("window");
    return { x: width - WIDGET_SIZE - 12, y: height - WIDGET_SIZE - 90 };
  });
  const dragStartPosition = useRef(position);
  const wasDragged = useRef(false);
  const prevIsOpen = useRef(isOpen);

  // Quando o player abre/fecha, o tamanho da caixa muda (botão pequeno
  // 70x70 <-> painel grande 320x480). Sem isso, a caixa crescia mantendo
  // fixo o canto SUPERIOR-ESQUERDO, então ela "nascia" longe de onde o
  // botão (e a alcinha de arrastar) realmente estavam na tela. Aqui,
  // sempre que abre/fecha, recalculamos a posição para manter o mesmo
  // canto inferior-direito fixo — ou seja, o painel cresce/encolhe a
  // partir exatamente de onde o botão estava, então tudo (WebView, alça de
  // arrastar e botão de fechar) fica sempre visualmente junto.
  useEffect(() => {
    if (prevIsOpen.current === isOpen) return;
    prevIsOpen.current = isOpen;
    setPosition((prev) => {
      const { width, height } = Dimensions.get("window");
      const fromSize = isOpen ? WIDGET_SIZE : OPEN_WIDTH;
      const fromHeight = isOpen ? WIDGET_SIZE : OPEN_HEIGHT;
      const toSize = isOpen ? OPEN_WIDTH : WIDGET_SIZE;
      const toHeight = isOpen ? OPEN_HEIGHT : WIDGET_SIZE;
      const anchorRight = prev.x + fromSize;
      const anchorBottom = prev.y + fromHeight;
      return {
        x: Math.max(0, Math.min(anchorRight - toSize, width - toSize)),
        y: Math.max(0, Math.min(anchorBottom - toHeight, height - toHeight)),
      };
    });
  }, [isOpen]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
      },
      onPanResponderGrant: () => {
        dragStartPosition.current = position;
        wasDragged.current = false;
      },
      onPanResponderMove: (_evt, gestureState) => {
        wasDragged.current = true;
        const { width, height } = Dimensions.get("window");
        const size = isOpen ? OPEN_WIDTH : WIDGET_SIZE;
        const openHeight = isOpen ? OPEN_HEIGHT : WIDGET_SIZE;
        const nextX = dragStartPosition.current.x + gestureState.dx;
        const nextY = dragStartPosition.current.y + gestureState.dy;
        setPosition({
          // Mantém o widget sempre visível, sem deixar arrastar para fora
          // da tela.
          x: Math.max(0, Math.min(nextX, width - size)),
          y: Math.max(0, Math.min(nextY, height - openHeight)),
        });
      },
    })
  ).current;

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
    // Recria a WebView/iframe do zero — garante o fechamento mesmo que o
    // player do VLibras não responda à mensagem abaixo.
    setInstanceKey((k) => k + 1);
  };

  if (!librasEnabled) return null;

  const widgetSize = isOpen ? OPEN_WIDTH : WIDGET_SIZE;
  const widgetHeight = isOpen ? OPEN_HEIGHT : WIDGET_SIZE;

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
    // toque de verdade. A mesma lógica vale para a alcinha de arrastar.
    <>
      <View
        style={[
          styles.widgetContainer,
          { left: position.x, top: position.y, width: widgetSize, height: widgetHeight },
        ]}
        pointerEvents="box-none"
      >
        {Platform.OS === "web" ? (
          <iframe
            key={instanceKey}
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
            key={instanceKey}
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

      {/* Alcinha para arrastar o widget pela tela. Fica só no canto
          superior-esquerdo do botão, fora da área da WebView, para o toque
          não ser "roubado" por ela (mesmo motivo do botão de fechar acima). */}
      <View
        {...panResponder.panHandlers}
        accessibilityRole="button"
        accessibilityLabel="Arrastar intérprete de Libras para outra posição"
        style={[styles.dragHandle, { left: position.x - 4, top: position.y - 4 }]}
      >
        <Text style={styles.dragHandleText}>⠿</Text>
      </View>

      {isOpen && (
        <Pressable
          onPress={handleForceClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar intérprete de Libras"
          style={[
            styles.closeButton,
            { left: position.x + widgetSize - 32 - 6, top: position.y + 6 },
          ]}
          hitSlop={12}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
      )}
    </>
  );
}

const WIDGET_SIZE = 70;
const OPEN_WIDTH = 320;
const OPEN_HEIGHT = 480;

const styles = StyleSheet.create({
  // Posição agora é controlada dinamicamente (left/top) via estado
  // "position", para permitir arrastar o widget pela tela.
  widgetContainer: {
    position: "absolute",
    zIndex: 999999,
    backgroundColor: "transparent",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  // Alcinha de arrastar: um pequeno círculo no canto superior-esquerdo do
  // botão, sempre visível (aberto ou fechado), como sua própria camada
  // nativa (irmã da WebView) para garantir que o toque seja capturado.
  dragHandle: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000001,
    elevation: 1000001,
  },
  dragHandleText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    transform: [{ rotate: "90deg" }],
  },
  // Botão nativo de emergência para fechar o player. Agora é IRMÃO da
  // caixa da WebView (não filho dela), posicionado relativo à posição
  // atual (arrastável) do widget, sempre no canto superior-direito dele.
  closeButton: {
    position: "absolute",
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