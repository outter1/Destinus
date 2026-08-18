import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, SafeAreaView } from "react-native";
import { useAccessibility, type AccessibilityProfile } from "./AccessibilityContext";

interface Props {
  visible: boolean;
  onFinish: () => void;
}

export function AccessibilityOnboardingModal({ visible, onFinish }: Props) {
  const { setAccessibilityProfile, theme } = useAccessibility();

  const handleSelect = (profile: AccessibilityProfile) => {
    setAccessibilityProfile(profile);
    onFinish();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: theme.textColor }]}>Preferências de Acessibilidade</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryTextColor }]}>
            Selecione como deseja navegar pelo aplicativo para adaptarmos a interface para você:
          </Text>

          {/* Opção 1: Padrão (Borda Rosa) */}
          <TouchableOpacity
            style={[
              styles.optionButton,
              styles.pinkBorder,
              { backgroundColor: theme.cardBackgroundColor }
            ]}
            onPress={() => handleSelect("none")}
          >
            <Text style={styles.icon}>👁️</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.optionTitle, { color: theme.textColor }]}>Navegação Padrão</Text>
              <Text style={[styles.optionSub, { color: theme.secondaryTextColor }]}>Sem ajustes de fonte ou áudio.</Text>
            </View>
          </TouchableOpacity>

          {/* Opção 2: Baixa Visão */}
          <TouchableOpacity
            style={[
              styles.optionButton,
              styles.orangeBorder,
              { backgroundColor: theme.cardBackgroundColor }
            ]}
            onPress={() => handleSelect("low_vision")}
          >
            <Text style={styles.icon}>🔍</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.optionTitle, { color: theme.textColor }]}>Baixa Visão</Text>
              <Text style={[styles.optionSub, { color: theme.secondaryTextColor }]}>
                Fontes ampliadas, alto contraste e áudio.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Opção 3: Cego / Deficiência Visual */}
          <TouchableOpacity
            style={[
              styles.optionButton,
              styles.blueBorder,
              { backgroundColor: theme.cardBackgroundColor }
            ]}
            onPress={() => handleSelect("blind")}
          >
            <Text style={styles.icon}>🔊</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.optionTitle, { color: theme.textColor }]}>Deficiência Visual / Cego</Text>
              <Text style={[styles.optionSub, { color: theme.secondaryTextColor }]}>
                Guia por áudio e navegação falada.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Opção 4: Surdo / Libras */}
          <TouchableOpacity
            style={[
              styles.optionButton,
              styles.greenBorder,
              { backgroundColor: theme.cardBackgroundColor }
            ]}
            onPress={() => handleSelect("libras")}
          >
            <Text style={styles.icon}>🖐️</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.optionTitle, { color: theme.textColor }]}>Surdo / Libras</Text>
              <Text style={[styles.optionSub, { color: theme.secondaryTextColor }]}>
                Foco em suporte visual e suporte à tradução em Libras.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Opção 5: Neurodivergente / Autismo */}
          <TouchableOpacity
            style={[
              styles.optionButton,
              styles.purpleBorder,
              { backgroundColor: theme.cardBackgroundColor }
            ]}
            onPress={() => handleSelect("neurodivergent")}
          >
            <Text style={styles.icon}>🧩</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.optionTitle, { color: theme.textColor }]}>Neurodivergente / Autismo</Text>
              <Text style={[styles.optionSub, { color: theme.secondaryTextColor }]}>
                Interface previsível e menor estímulo visual/animações.
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingVertical: 32 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 15, marginBottom: 28, textAlign: "center", lineHeight: 22 },
  optionButton: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    alignItems: "center",
  },
  pinkBorder: { borderWidth: 2, borderColor: "#EC4899" },
  orangeBorder: { borderWidth: 2, borderColor: "#EA580C" },
  blueBorder: { borderWidth: 2, borderColor: "#2563EB" },
  greenBorder: { borderWidth: 2, borderColor: "#10B981" },
  purpleBorder: { borderWidth: 2, borderColor: "#8B5CF6" },
  icon: { fontSize: 28, marginRight: 16 },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 17, fontWeight: "bold" },
  optionSub: { fontSize: 13, marginTop: 4, lineHeight: 18 },
});