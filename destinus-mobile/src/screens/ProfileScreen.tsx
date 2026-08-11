import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Image,
} from "react-native";
import { useAccessibility } from "./AccessibilityContext";

export interface ProfileScreenProps {
  user?: {
    name?: string;
    username?: string;
    email?: string;
    nome?: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
  recentlyViewed?: any[];
  onSelectPlace?: (place: any) => void;
  onUpdateUser?: (updatedUser: any) => void;
}

export function ProfileScreen({
  user,
  onLogout,
  recentlyViewed,
  onSelectPlace,
  onUpdateUser,
}: ProfileScreenProps) {
  const {
    theme,
    fontScale,
    isNeurodivergent,
    librasEnabled,
    speak,
    setFontScale,
    setIsNeurodivergent,
    setLibrasEnabled,
  } = useAccessibility();

  const userName = user?.name || user?.username || user?.nome || "Usuário Destinus";
  const userEmail = user?.email || "usuario@destinus.com.br";
  const activeAccentColor = isNeurodivergent ? theme.accentColor : "#2563EB";

  const handleIncreaseFont = () => {
    const newScale = Math.min(fontScale + 0.1, 1.5);
    if (setFontScale) setFontScale(newScale);
    if (speak) speak("Tamanho do texto aumentado");
  };

  const handleDecreaseFont = () => {
    const newScale = Math.max(fontScale - 0.1, 0.8);
    if (setFontScale) setFontScale(newScale);
    if (speak) speak("Tamanho do texto diminuído");
  };

  const handleToggleNeurodivergent = (value: boolean) => {
    if (setIsNeurodivergent) setIsNeurodivergent(value);
    if (speak) speak(value ? "Modo neurodivergente ativado" : "Modo neurodivergente desativado");
  };

  const handleToggleLibras = (value: boolean) => {
    if (setLibrasEnabled) setLibrasEnabled(value);
    if (speak) speak(value ? "Suporte a Libras e leitura por voz ativado" : "Suporte a Libras desativado");
  };

  const handleLogout = () => {
    if (speak) speak("Saindo da conta");
    if (onLogout) onLogout();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Título do Perfil */}
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.textColor,
              fontSize: 22 * fontScale,
              letterSpacing: theme.letterSpacing,
            },
          ]}
        >
          Meu Perfil
        </Text>

        {/* Card do Usuário */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: theme.cardBackgroundColor,
              borderColor: theme.borderColor,
            },
          ]}
        >
          {user?.avatarUrl && !theme.hideDecorations ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: activeAccentColor }]}>
              <Text style={styles.avatarInitial}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
          )}

          <View style={styles.userInfo}>
            <Text
              style={[
                styles.userName,
                {
                  color: theme.textColor,
                  fontSize: 18 * fontScale,
                  letterSpacing: theme.letterSpacing,
                },
              ]}
            >
              {userName}
            </Text>
            <Text
              style={[
                styles.userEmail,
                {
                  color: theme.secondaryTextColor,
                  fontSize: 13 * fontScale,
                  letterSpacing: theme.letterSpacing,
                },
              ]}
            >
              {userEmail}
            </Text>
          </View>
        </View>

        {/* Seção de Preferências de Acessibilidade */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.textColor,
              fontSize: 16 * fontScale,
              letterSpacing: theme.letterSpacing,
            },
          ]}
        >
          ⚙️ Preferências de Acessibilidade
        </Text>

        <View
          style={[
            styles.preferencesCard,
            {
              backgroundColor: theme.cardBackgroundColor,
              borderColor: theme.borderColor,
            },
          ]}
        >
          {/* Controle de Tamanho de Fonte */}
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceTextGroup}>
              <Text style={[styles.preferenceLabel, { color: theme.textColor, fontSize: 14 * fontScale }]}>
                🔤 Tamanho da Fonte
              </Text>
              <Text style={[styles.preferenceSublabel, { color: theme.secondaryTextColor, fontSize: 12 * fontScale }]}>
                Escala atual: {Math.round(fontScale * 100)}%
              </Text>
            </View>

            <View style={styles.fontControls}>
              <TouchableOpacity
                style={[styles.fontButton, { borderColor: theme.borderColor }]}
                onPress={handleDecreaseFont}
                accessibilityLabel="Diminuir texto"
              >
                <Text style={{ color: theme.textColor, fontWeight: "bold", fontSize: 16 }}>A-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fontButton, { borderColor: theme.borderColor, backgroundColor: activeAccentColor }]}
                onPress={handleIncreaseFont}
                accessibilityLabel="Aumentar texto"
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }}>A+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />

          {/* Toggle Modo Neurodivergente */}
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceTextGroup}>
              <Text style={[styles.preferenceLabel, { color: theme.textColor, fontSize: 14 * fontScale }]}>
                🧠 Modo Neurodivergente
              </Text>
              <Text style={[styles.preferenceSublabel, { color: theme.secondaryTextColor, fontSize: 12 * fontScale }]}>
                Reduz distrações e imagens de fundo
              </Text>
            </View>

            <Switch
              value={isNeurodivergent}
              onValueChange={handleToggleNeurodivergent}
              trackColor={{ false: "#64748B", true: activeAccentColor }}
              thumbColor={isNeurodivergent ? "#FFFFFF" : "#F1F5F9"}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />

          {/* Toggle Libras e Leitura por Voz */}
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceTextGroup}>
              <Text style={[styles.preferenceLabel, { color: theme.textColor, fontSize: 14 * fontScale }]}>
                🤟 Libras & Leitura de Voz
              </Text>
              <Text style={[styles.preferenceSublabel, { color: theme.secondaryTextColor, fontSize: 12 * fontScale }]}>
                Habilita toque para ouvir os textos
              </Text>
            </View>

            <Switch
              value={librasEnabled}
              onValueChange={handleToggleLibras}
              trackColor={{ false: "#64748B", true: activeAccentColor }}
              thumbColor={librasEnabled ? "#FFFFFF" : "#F1F5F9"}
            />
          </View>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: theme.borderColor }]}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Sair do aplicativo"
        >
          <Text
            style={[
              styles.logoutText,
              {
                fontSize: 15 * fontScale,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            🚪 Sair da Conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontWeight: "bold", marginBottom: 16 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 14 },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarInitial: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold" },
  userInfo: { flex: 1 },
  userName: { fontWeight: "bold", marginBottom: 2 },
  userEmail: {},
  sectionTitle: { fontWeight: "bold", marginBottom: 12 },
  preferencesCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 28,
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  preferenceTextGroup: { flex: 1, paddingRight: 12 },
  preferenceLabel: { fontWeight: "bold", marginBottom: 2 },
  preferenceSublabel: {},
  fontControls: { flexDirection: "row", gap: 8 },
  fontButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: { height: 1, marginVertical: 8 },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  logoutText: { color: "#EF4444", fontWeight: "bold" },
});