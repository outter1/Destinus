import React from "react";
import { Text, TextProps, TouchableOpacity, StyleSheet } from "react-native";
import { useAccessibility } from "../screens/AccessibilityContext";

interface AppTextProps extends TextProps {
  children: React.ReactNode;
}

// Extrai texto limpo de children numéricos, arrays ou componentes aninhados
const extractTextFromChildren = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromChildren).join(" ");
  }
  if (React.isValidElement(node) && node.props && node.props.children) {
    return extractTextFromChildren(node.props.children);
  }
  return "";
};

export function AppText({ children, style, ...props }: AppTextProps) {
  const { librasEnabled, speak, fontScale, theme } = useAccessibility();

  // Achata o estilo para ler o fontSize original caso tenha sido informado no componente
  const flatStyle = StyleSheet.flatten(style) || {};
  const baseFontSize = flatStyle.fontSize || 16;

  // Aplica tema, espaçamento de dislexia e redimensiona dinamicamente a fonte
  const adaptedStyle = [
    {
      color: theme?.textColor || "#FFFFFF",
      letterSpacing: theme?.letterSpacing || 0,
    },
    style,
    {
      fontSize: baseFontSize * fontScale,
    },
  ];

  const textContent = extractTextFromChildren(children);

  if (librasEnabled && textContent.trim().length > 0) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => speak(textContent)}
        accessibilityRole="text"
        accessibilityHint="Toque para ouvir a leitura"
      >
        <Text style={adaptedStyle} {...props}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <Text style={adaptedStyle} {...props}>
      {children}
    </Text>
  );
}