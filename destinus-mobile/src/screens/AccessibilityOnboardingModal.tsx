import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, SafeAreaView } from "react-native";
import { useAccessibility, type AccessibilityProfile } from "./AccessibilityContext";

interface Props {
  visible: boolean;
  onFinish: () => void;
}

export function AccessibilityOnboardingModal({ visible, onFinish }: Props) {
  const { setAccessibilityProfile } = useAccessibility();

  const handleSelect = (profile: AccessibilityProfile) => {
    setAccessibilityProfile(profile);
    onFinish();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Preferências de Acessibilidade</Text>
          <Text style={styles.subtitle}>
            Selecione como deseja navegar pelo aplicativo para adaptarmos a interface para você:
          </Text>

          {/* Opção 1: Padrão */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleSelect("none")}
          >
            <Text style={styles.icon}>👁️</Text>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Navegação Padrão</Text>
              <Text style={styles.optionSub}>Sem ajustes de fonte ou áudio.</Text>
            </View>
          </TouchableOpacity>

          {/* Opção 2: Baixa Visão */}
          <TouchableOpacity
            style={[styles.optionButton, styles.orangeBorder]}
            onPress={() => handleSelect("low_vision")}
          >
            <Text style={styles.icon}>🔍</Text>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Baixa Visão</Text>
              <Text style={styles.optionSub}>Fontes ampliadas, alto contraste e áudio.</Text>
            </View>
          </TouchableOpacity>

          {/* Opção 3: Cego / Deficiência Visual */}
          <TouchableOpacity
            style={[styles.optionButton, styles.blueBorder]}
            onPress={() => handleSelect("blind")}
          >
            <Text style={styles.icon}>🔊</Text>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Deficiência Visual / Cego</Text>
              <Text style={styles.optionSub}>Guia por áudio e navegação falada.</Text>
            </View>
          </TouchableOpacity>

          {/* Opção 4: Surdo / Libras */}
          <TouchableOpacity
            style={[styles.optionButton, styles.greenBorder]}
            onPress={() => handleSelect("libras")}
          >
            <Text style={styles.icon}>🖐️</Text>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Surdo / Libras</Text>
              <Text style={styles.optionSub}>Foco em suporte visual e suporte à tradução em Libras.</Text>
            </View>
          </TouchableOpacity>

          {/* Opção 5: Neurodivergente / Autismo */}
          <TouchableOpacity
            style={[styles.optionButton, styles.purpleBorder]}
            onPress={() => handleSelect("neurodivergent")}
          >
            <Text style={styles.icon}>🧩</Text>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Neurodivergente / Autismo</Text>
              <Text style={styles.optionSub}>Interface previsível e menor estímulo visual/animações.</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  scrollContent: { padding: 24, paddingVertical: 32 },
  title: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subtitle: { color: "#94A3B8", fontSize: 15, marginBottom: 28, textAlign: "center", lineHeight: 22 },
  optionButton: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    alignItems: "center",
  },
  orangeBorder: { borderWidth: 2, borderColor: "#EA580C" },
  blueBorder: { borderWidth: 2, borderColor: "#2563EB" },
  greenBorder: { borderWidth: 2, borderColor: "#10B981" },
  purpleBorder: { borderWidth: 2, borderColor: "#8B5CF6" },
  icon: { fontSize: 28, marginRight: 16 },
  textContainer: { flex: 1 },
  optionTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "bold" },
  optionSub: { color: "#CBD5E1", fontSize: 13, marginTop: 4, lineHeight: 18 },
});