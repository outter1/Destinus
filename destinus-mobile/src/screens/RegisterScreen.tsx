import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform } from "react-native";
import { COLORS } from "../constants/theme";
import { API_URL } from "../services/api";

interface RegisterProps {
  onGoToLogin: () => void;
  onRegisterSuccess: (user: any) => void;
}

export function RegisterScreen({ onGoToLogin, onRegisterSuccess }: RegisterProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [needs, setNeeds] = useState({
    wheelchair: false,
    visual: false,
    hearing: false,
    neurodivergent: false,
  });

  function toggleNeed(key: keyof typeof needs) {
    setNeeds((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleFinishRegister() {
    if (!name || !email || !password) return alert("Preencha todos os campos obrigatórios.");

    try {
      const res = await fetch(`${API_URL}/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, needs }),
      });
      const data = await res.json();
      if (res.ok) {
        onRegisterSuccess(data.user);
      } else {
        alert(data.message || "Erro ao realizar cadastro.");
      }
    } catch {
      alert("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          
          {/* Indicador de Etapas */}
          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, step >= 1 && styles.stepActive]} />
            <View style={[styles.stepDot, step >= 2 && styles.stepActive]} />
          </View>

          {step === 1 ? (
            <>
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>Monte seu perfil para experiências personalizadas</Text>

              <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor={COLORS.textMuted} value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={COLORS.textMuted} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
              <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={COLORS.textMuted} secureTextEntry value={password} onChangeText={setPassword} />

              <Pressable style={styles.btnPrimary} onPress={() => name && email && password ? setStep(2) : alert("Preencha todos os campos")}>
                <Text style={styles.btnText}>Avançar para Acessibilidade ➔</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.title}>Recursos de Acessibilidade</Text>
              <Text style={styles.subtitle}>Selecione os recursos prioritários para suas viagens:</Text>

              <Pressable style={[styles.optionCard, needs.wheelchair && styles.optionSelected]} onPress={() => toggleNeed("wheelchair")}>
                <Text style={styles.optionIcon}>🧑‍🦽</Text>
                <Text style={styles.optionText}>Acessibilidade para Cadeira de Rodas / Mobilidade</Text>
              </Pressable>

              <Pressable style={[styles.optionCard, needs.visual && styles.optionSelected]} onPress={() => toggleNeed("visual")}>
                <Text style={styles.optionIcon}>🦯</Text>
                <Text style={styles.optionText}>Deficiência Visual / Baixa Visão</Text>
              </Pressable>

              <Pressable style={[styles.optionCard, needs.hearing && styles.optionSelected]} onPress={() => toggleNeed("hearing")}>
                <Text style={styles.optionIcon}>🧏</Text>
                <Text style={styles.optionText}>Deficiência Auditiva / Libras</Text>
              </Pressable>

              <Pressable style={[styles.optionCard, needs.neurodivergent && styles.optionSelected]} onPress={() => toggleNeed("neurodivergent")}>
                <Text style={styles.optionIcon}>🧠</Text>
                <Text style={styles.optionText}>Neurodivergente / Sala Aterapeútica</Text>
              </Pressable>

              <View style={styles.rowBtns}>
                <Pressable style={styles.btnBack} onPress={() => setStep(1)}>
                  <Text style={styles.btnBackText}>Voltar</Text>
                </Pressable>
                <Pressable style={[styles.btnPrimary, { flex: 1, marginLeft: 10 }]} onPress={handleFinishRegister}>
                  <Text style={styles.btnText}>Concluir Cadastro</Text>
                </Pressable>
              </View>
            </>
          )}

          <Pressable style={styles.btnSecondary} onPress={onGoToLogin}>
            <Text style={styles.btnSecondaryText}>Já tem uma conta? Faça login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: { backgroundColor: COLORS.cardBg, borderRadius: 24, padding: 24, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  logo: { width: 150, height: 80, marginBottom: 10 },
  stepIndicator: { flexDirection: "row", gap: 8, marginBottom: 16 },
  stepDot: { width: 32, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  stepActive: { backgroundColor: COLORS.accentOrange },
  title: { fontSize: 20, fontWeight: "bold", color: COLORS.textDark, textAlign: "center" },
  subtitle: { fontSize: 13, color: COLORS.textMuted, textAlign: "center", marginBottom: 20, marginTop: 4 },
  input: { width: "100%", height: 50, backgroundColor: COLORS.bgLight, borderRadius: 12, paddingHorizontal: 16, marginBottom: 12, fontSize: 15, color: COLORS.textDark, borderWidth: 1, borderColor: COLORS.border },
  optionCard: { flexDirection: "row", alignItems: "center", width: "100%", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10, backgroundColor: COLORS.bgLight },
  optionSelected: { borderColor: COLORS.primary, backgroundColor: "#E0F2FE" },
  optionIcon: { fontSize: 20, marginRight: 12 },
  optionText: { flex: 1, fontSize: 13, fontWeight: "600", color: COLORS.textDark },
  btnPrimary: { width: "100%", height: 50, backgroundColor: COLORS.accentOrange, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 10 },
  btnText: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
  rowBtns: { flexDirection: "row", width: "100%", alignItems: "center" },
  btnBack: { paddingHorizontal: 16, height: 50, justifyContent: "center", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginTop: 10 },
  btnBackText: { color: COLORS.textMuted, fontWeight: "600" },
  btnSecondary: { marginTop: 20 },
  btnSecondaryText: { color: COLORS.primary, fontWeight: "600", fontSize: 14 }
});