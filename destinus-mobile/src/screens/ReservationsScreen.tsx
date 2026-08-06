import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Linking } from "react-native";
import { COLORS } from "../constants/theme";
import { API_URL } from "../services/api";

export function ReservationsScreen() {
  const [activeTab, setActiveTab] = useState<"Proximas" | "Passadas" | "Canceladas">("Proximas");
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/reservas`)
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch((err) => console.log(err));
  }, []);

  const filtered = reservations.filter((r) => r.tab === activeTab || (!r.tab && activeTab === "Proximas"));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suas reservas 🧳</Text>
      </View>

      {/* Abas idênticas às da imagem de referência */}
      <View style={styles.tabsContainer}>
        {(["Proximas", "Passadas", "Canceladas"] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === "Proximas" ? "Próximas" : tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Text style={{ fontSize: 20 }}>{item.icon || "🎫"}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status || "Confirmado"}</Text>
              </View>
            </View>

            <Text style={styles.cardDetail}>{item.detail}</Text>

            {item.merchantUrl && (
              <Pressable style={styles.merchantBtn} onPress={() => Linking.openURL(item.merchantUrl)}>
                <Text style={styles.merchantBtnText}>Ver Voucher / Detalhes do Parceiro ➔</Text>
              </Pressable>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🏖️</Text>
            <Text style={styles.emptyText}>Nenhuma reserva encontrada nesta categoria.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  tabsContainer: { flexDirection: "row", backgroundColor: "#FFF", padding: 6, margin: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 12 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: COLORS.textMuted },
  tabTextActive: { color: "#FFF", fontWeight: "bold" },
  card: { backgroundColor: "#FFF", borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.bgLight, justifyContent: "center", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.textDark },
  cardDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { backgroundColor: "#DCFCE7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: "#15803D", fontSize: 11, fontWeight: "bold" },
  cardDetail: { fontSize: 13, color: COLORS.textMuted, marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  merchantBtn: { marginTop: 12, backgroundColor: COLORS.primary, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  merchantBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  emptyBox: { alignItems: "center", marginTop: 40 },
  emptyText: { color: COLORS.textMuted, fontSize: 14 }
});