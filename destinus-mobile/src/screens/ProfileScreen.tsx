import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useAccessibility } from "./AccessibilityContext";

const AVATARS = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140047.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
];

export function ProfileScreen({ user, onLogout }: any) {
  const { fontScale, highContrast, setAccessibility, getColors } = useAccessibility();
  const colors = getColors();

  const [selectedPhoto, setSelectedPhoto] = useState(user?.photoUrl || AVATARS[0]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: 24 * fontScale }]}>Meu Perfil 👤</Text>

      {/* Seção de Avatar */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border, alignItems: "center" }]}>
        <Image source={{ uri: selectedPhoto }} style={styles.avatar} />
        <Text style={[styles.userName, { color: colors.text, fontSize: 18 * fontScale }]}>{user?.name || "Viajante Destinus"}</Text>
        <Text style={[styles.userEmail, { color: colors.text, fontSize: 13 * fontScale }]}>{user?.email || "usuario@destinus.com"}</Text>

        <Text style={[styles.sectionSubtitle, { color: colors.text, fontSize: 13 * fontScale }]}>Escolha seu Avatar:</Text>
        <View style={styles.avatarContainer}>
          {AVATARS.map((url, idx) => (
            <TouchableOpacity key={idx} onPress={() => setSelectedPhoto(url)}>
              <Image source={{ uri: url }} style={[styles.smallAvatar, selectedPhoto === url && { borderWidth: 2, borderColor: colors.primary }]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Configurações da Conta */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.cardHeader, { color: colors.text, fontSize: 16 * fontScale }]}>Preferências Visuais</Text>
        <TouchableOpacity style={styles.rowBtn} onPress={() => setAccessibility({ highContrast: !highContrast })}>
          <Text style={{ color: colors.text, fontSize: 14 * fontScale }}>{highContrast ? "☑️" : "⬜"} Modo Alto Contraste</Text>
        </TouchableOpacity>
      </View>

      {onLogout && (
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.primary }]} onPress={onLogout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontWeight: "bold", marginBottom: 16 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  userName: { fontWeight: "bold" },
  userEmail: { opacity: 0.7, marginBottom: 12 },
  sectionSubtitle: { fontWeight: "bold", marginTop: 8, marginBottom: 8 },
  avatarContainer: { flexDirection: "row", gap: 12 },
  smallAvatar: { width: 44, height: 44, borderRadius: 22 },
  cardHeader: { fontWeight: "bold", marginBottom: 12 },
  rowBtn: { paddingVertical: 10 },
  logoutButton: { padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 40 },
  logoutText: { color: "#FFF", fontWeight: "bold" },
});