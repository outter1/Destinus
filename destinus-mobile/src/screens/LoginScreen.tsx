import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image, KeyboardAvoidingView, Platform } from "react-native";
import { COLORS } from "../constants/theme";
import { API_URL } from "../services/api";

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onGoToRegister: () => void;
}

export function LoginScreen({ onLoginSuccess, onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) return alert("Preencha todos os campos.");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.user);
      } else {
        alert(data.message || "Erro ao realizar login.");
      }
    } catch {
      alert("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.card}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tagline}>Sua viagem começa aqui ✨</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={COLORS.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.btnPrimary} onPress={handleLogin}>
          <Text style={styles.btnText}>Entrar</Text>
        </Pressable>

        <Pressable style={styles.btnSecondary} onPress={onGoToRegister}>
          <Text style={styles.btnSecondaryText}>Criar nova conta</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, justifyContent: "center", padding: 20 },
  card: { backgroundColor: COLORS.cardBg, borderRadius: 24, padding: 24, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  logo: { width: 180, height: 120 },
  tagline: { fontSize: 14, color: COLORS.textMuted, marginBottom: 24, fontWeight: "500" },
  input: { width: "100%", height: 50, backgroundColor: COLORS.bgLight, borderRadius: 12, paddingHorizontal: 16, marginBottom: 12, fontSize: 15, color: COLORS.textDark, borderWidth: 1, borderColor: COLORS.border },
  btnPrimary: { width: "100%", height: 50, backgroundColor: COLORS.accentOrange, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 8 },
  btnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  btnSecondary: { marginTop: 16 },
  btnSecondaryText: { color: COLORS.primary, fontWeight: "600", fontSize: 14 }
});