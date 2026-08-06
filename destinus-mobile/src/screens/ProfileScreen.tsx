import React from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";

interface ProfileScreenProps {
  user: any;
  onLogout: () => void;
  onUpdateUser?: (updatedUser: any) => void;
}

export function ProfileScreen({ user, onLogout, onUpdateUser }: ProfileScreenProps) {
  const needs = user?.needs || {};
  const preferences = user?.preferences || {};

  const activeNeeds = [
    needs.wheelchair && "👨‍🛈 Cadeirante / Mobilidade",
    needs.visual && "👁️ Deficiência Visual",
    needs.hearing && "🧏 Deficiência Auditiva",
    needs.neurodivergent && "🧠 Neurodivergente",
  ].filter(Boolean);

  const activePreferences = [
    preferences.trails && "🌲 Trilhas & Ecoturismo",
    preferences.walks && "🚶 Passeios ao Ar Livre",
    preferences.culture && "🏛️ Cultura & História",
    preferences.beaches && "🏖️ Praias & Lazer",
    preferences.gastronomy && "🍽️ Gastronomia",
  ].filter(Boolean);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
        <Text style={styles.userEmail}>{user?.email || "email@exemplo.com"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>♿ Necessidades de Acessibilidade</Text>
        {activeNeeds.length > 0 ? (
          <View style={styles.chipGroup}>
            {activeNeeds.map((item, index) => (
              <Text key={index} style={styles.chipBlue}>{item}</Text>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Nenhuma necessidade cadastrada.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🗺️ Preferências de Turismo</Text>
        {activePreferences.length > 0 ? (
          <View style={styles.chipGroup}>
            {activePreferences.map((item, index) => (
              <Text key={index} style={styles.chipGreen}>{item}</Text>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Nenhuma preferência cadastrada.</Text>
        )}
      </View>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>🚪 Sair da Conta</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 20, gap: 16 },
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 20,
    elevation: 2,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  userName: { fontSize: 20, fontWeight: "bold", color: "#0F172A" },
  userEmail: { fontSize: 14, color: "#64748B", marginTop: 2 },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1E293B", marginBottom: 12 },
  chipGroup: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chipBlue: {
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
  },
  chipGreen: {
    backgroundColor: "#F0FDF4",
    color: "#15803D",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
  },
  emptyText: { fontSize: 13, color: "#94A3B8", fontStyle: "italic" },

  logoutButton: {
    backgroundColor: "#FEE2E2",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: { color: "#DC2626", fontWeight: "bold", fontSize: 15 },
});