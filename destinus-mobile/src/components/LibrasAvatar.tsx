import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";
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
          processTranslation(event.data);
        });
        document.addEventListener("message", function(event) {
          processTranslation(event.data);
        });
      </script>
    </body>
  </html>
`;

export function LibrasAvatar() {
  const { librasEnabled, textToTranslate } = useAccessibility();
  const webViewRef = useRef<WebView>(null);
  const iframeRef = useRef<any>(null);

  useEffect(() => {
    if (textToTranslate && librasEnabled) {
      if (Platform.OS === "web") {
        iframeRef.current?.contentWindow?.postMessage(textToTranslate, "*");
      } else {
        webViewRef.current?.postMessage(textToTranslate);
      }
    }
  }, [textToTranslate, librasEnabled]);

  if (!librasEnabled) return null;

  return (
    <View style={styles.widgetContainer} pointerEvents="box-none">
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  widgetContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 320,
    height: 500,
    zIndex: 999999,
    backgroundColor: "transparent",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});