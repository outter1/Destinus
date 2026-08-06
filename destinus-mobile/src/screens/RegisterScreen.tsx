import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import axios from "axios";
import { API_URL as CONFIG_API_URL } from "../config/api";

const API_URL = CONFIG_API_URL || `http://${Platform.OS === "android" ? "10.0.2.2" : "localhost"}:3000`;

interface RegisterScreenProps {
  onGoToLogin: () => void;
  onRegisterSuccess: (user: any) => void;
}

export function RegisterScreen({ onGoToLogin, onRegisterSuccess }: RegisterScreenProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Dados Básicos
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Perguntas de Acessibilidade
  const [needs, setNeeds] = useState({
    wheelchair: false,
    visual: false,
    hearing: false,
    neurodivergent: false,
  });

  // Perguntas de Preferências de Turismo
  const [preferences, setPreferences] = useState({
    trails: false,
    walks: false,
    culture: false,
    beaches: false,
    gastronomy: false,
  });

  const toggleNeed = (key: keyof typeof needs) => {
    setNeeds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNextStep = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha nome, e-mail e senha.");
      return;
    }
    setStep(2);
  };

  const handleRegister = async (skipPreferences = false) => {
    setLoading(true);

    const finalNeeds = skipPreferences
      ? { wheelchair: false, visual: false, hearing: false, neurodivergent: false }
      : needs;

    const finalPreferences = skipPreferences
      ? { trails: false, walks: false, culture: false, beaches: false, gastronomy: false }
      : preferences;

    const userData = {
      name,
      email,
      password,
      needs: finalNeeds,
      preferences: finalPreferences,
    };

    try {
      const response = await axios.post(`${API_URL}/cadastro`, userData);
      onRegisterSuccess(response.data.user || userData);
    } catch (error) {
      console.log("Erro no cadastro (prosseguindo localmente):", error);
      // Garante a continuidade do fluxo mesmo se o servidor backend não responder
      onRegisterSuccess(userData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>
          {step === 1 ? "Preencha seus dados para começar" : "Personalize sua experiência"}
        </Text>

        {step === 1 ? (
          /* ETAPA 1: DADOS BÁSICOS (Cor Laranja) */
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seuemail@email.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Pressable style={styles.primaryButtonOrange} onPress={handleNextStep}>
              <Text style={styles.primaryButtonText}>Continuar ➡️</Text>
            </Pressable>

            <Pressable onPress={onGoToLogin} style={styles.linkButton}>
              <Text style={styles.linkText}>
                Já tem uma conta? <Text style={styles.boldTextOrange}>Faça Login</Text>
              </Text>
            </Pressable>
          </View>
        ) : (
          /* ETAPA 2: PERSONALIZAÇÃO (Cor Amarela) */
          <View style={styles.formGroup}>
            {/* Bloco 1: Acessibilidade */}
            <Text style={styles.sectionTitle}>♿ Necessidades de Acessibilidade</Text>
            <Text style={styles.sectionDesc}>Selecione se possui alguma necessidade específica:</Text>

            <View style={styles.optionsContainer}>
              <Pressable
                style={[styles.checkboxCard, needs.wheelchair && styles.checkboxActiveYellow]}
                onPress={() => toggleNeed("wheelchair")}
              >
                <Text style={styles.checkboxText}>👨‍🛈 Cadeirante / Mobilidade</Text>
              </Pressable>

              <Pressable
                style={[styles.checkboxCard, needs.visual && styles.checkboxActiveYellow]}
                onPress={() => toggleNeed("visual")}
              >
                <Text style={styles.checkboxText}>👁️ Deficiência Visual / Baixa Visão</Text>
              </Pressable>

              <Pressable
                style={[styles.checkboxCard, needs.hearing && styles.checkboxActiveYellow]}
                onPress={() => toggleNeed("hearing")}
              >
                <Text style={styles.checkboxText}>🧏 Deficiência Auditiva / LIBRAS</Text>
              </Pressable>

              <Pressable
                style={[styles.checkboxCard, needs.neurodivergent && styles.checkboxActiveYellow]}
                onPress={() => toggleNeed("neurodivergent")}
              >
                <Text style={styles.checkboxText}>🧠 Neurodivergente / Autismo</Text>
              </Pressable>
            </View>

            {/* Bloco 2: Preferências de Turismo */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>🗺️ Preferências de Turismo</Text>
            <Text style={styles.sectionDesc}>O que você mais gosta de fazer?</Text>

            <View style={styles.optionsContainer}>
              <Pressable
                style={[styles.checkboxCard, preferences.trails && styles.checkboxActiveYellow]}
                onPress={() => togglePreference("trails")}
              >
                <Text style={styles.checkboxText}>🌲 Trilhas & Ecoturismo</Text>
              </Pressable>

              <Pressable
                style={[styles.checkboxCard, preferences.walks && styles.checkboxActiveYellow]}
                onPress={() => togglePreference("walks")}
              >
                <Text style={styles.checkboxText}>🚶 Passeios ao Ar Livre</Text>
              </Pressable>

              <Pressable
                style={[styles.checkboxCard, preferences.culture && styles.checkboxActiveYellow]}
                onPress={() => togglePreference("culture")}
              >
                <Text style={styles.checkboxText}>🏛️ Cultura & História</Text>
              </Pressable>

              <Pressable
                style={[styles.checkboxCard, preferences.beaches && styles.checkboxActiveYellow]}
                onPress={() => togglePreference("beaches")}
              >
                <Text style={styles.checkboxText}>🏖️ Praias & Lazer</Text>
              </Pressable>

              <Pressable
                style={[styles.checkboxCard, preferences.gastronomy && styles.checkboxActiveYellow]}
                onPress={() => togglePreference("gastronomy")}
              >
                <Text style={styles.checkboxText}>🍽️ Gastronomia</Text>
              </Pressable>
            </View>

            {/* Botões da Etapa 2 */}
            <View style={styles.footerRow}>
              <Pressable
                style={styles.skipButton}
                onPress={() => handleRegister(true)}
                disabled={loading}
              >
                <Text style={styles.skipButtonText}>Pular essa parte</Text>
              </Pressable>

              <Pressable
                style={styles.submitButtonYellow}
                onPress={() => handleRegister(false)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Finalizar Cadastro</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "bold", color: "#0F172A", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#64748B", textAlign: "center", marginBottom: 24, marginTop: 4 },
  formGroup: { gap: 12 },
  label: { fontSize: 14, fontWeight: "600", color: "#334155" },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
  },
  
  /* Botão Principal Etapa 1 (Laranja) */
  primaryButtonOrange: {
    backgroundColor: "#F2861F",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  linkButton: { marginTop: 16, alignItems: "center" },
  linkText: { fontSize: 14, color: "#64748B" },
  boldTextOrange: { color: "#F2861F", fontWeight: "bold" },

  /* Estilos das Seleções (Etapa 2 - Amarela) */
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#0F172A" },
  sectionDesc: { fontSize: 13, color: "#64748B", marginBottom: 6 },
  optionsContainer: { gap: 8 },
  checkboxCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 14,
  },
  checkboxActiveYellow: {
    backgroundColor: "#FEF9C3",
    borderColor: "#EAB308",
  },
  checkboxText: { fontSize: 14, fontWeight: "500", color: "#1E293B" },

  /* Rodapé com "Pular essa parte" e Botão Finalizar (Amarelo) */
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    gap: 12,
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  submitButtonYellow: {
    flex: 1,
    backgroundColor: "#EAB308",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
});