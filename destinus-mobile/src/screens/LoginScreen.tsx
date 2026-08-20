import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import axios from "axios";
import { API_URL } from "../config/api";
import { notify } from "../utils/alert";

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
  onGoToRegister: () => void;
}

export function LoginScreen({ onLoginSuccess, onGoToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState("rayssard2005@gmail.com");
  const [password, setPassword] = useState("123456");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      notify("Campos vazios", "Por favor, digite seu e-mail e senha.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email.trim(),
        password,
      });

      const userData = response.data?.user;
      if (!userData) {
        notify("Erro ao entrar", "O servidor não retornou os dados do usuário. Tente novamente.");
        return;
      }

      // IMPORTANTE: só entra no app se o backend realmente confirmar o
      // login. Antes, qualquer falha (senha errada, e-mail inexistente,
      // servidor fora do ar) caía aqui e deixava a pessoa entrar mesmo
      // assim com uma conta "fake" local — por isso dava para "logar" sem
      // nunca ter se cadastrado.
      onLoginSuccess(userData);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        notify("E-mail ou senha inválidos", "Verifique seus dados ou crie uma conta.");
      } else if (error?.response) {
        notify("Erro ao entrar", error.response.data?.message || "Não foi possível entrar. Tente novamente.");
      } else {
        notify(
          "Sem conexão com o servidor",
          "Não foi possível falar com o servidor Destinus. Verifique se o backend está rodando e se o IP em src/config/api.ts está correto."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      <View style={styles.centerContainer}>
        {/* Card do Formulário */}
        <View style={styles.card}>
          {/* Logo do Destinus */}
          <View style={styles.logoContainer}>
            <Image
              // Altere o caminho abaixo para onde a imagem da logo está salva no seu projeto
              source={require("../../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Sua viagem começa aqui!</Text>
          </View>

          {/* Campo de E-mail */}
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Campo de Senha */}
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeButton}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
              hitSlop={8}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
            </Pressable>
          </View>

          {/* Checkbox Salvar Conta */}
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Salvar minha conta neste dispositivo
            </Text>
          </Pressable>

          {/* Botão Entrar */}
          <Pressable
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </Pressable>

          {/* Botão Criar Conta */}
          <Pressable style={styles.registerLink} onPress={onGoToRegister}>
            <Text style={styles.registerLinkText}>Criar nova conta</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3B82F6",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 160,
    height: 70,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 12,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  eyeIcon: {
    fontSize: 18,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#475569",
  },
  loginButton: {
    backgroundColor: "#EAB308",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 18,
    alignItems: "center",
  },
  registerLinkText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
});