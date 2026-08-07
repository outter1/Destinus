import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

interface Booking {
  id: string;
  placeName: string;
  date: string;
  tickets: number;
  status: string;
}

export function ReservationsScreen() {
  const [bookings] = useState<Booking[]>([
    {
      id: "b1",
      placeName: "Parque Natural Municipal da Taquara",
      date: "15/10/2026 - 09:00",
      tickets: 2,
      status: "Confirmada",
    },
    {
      id: "b2",
      placeName: "Museu Vivo do São Bento",
      date: "22/10/2026 - 14:00",
      tickets: 1,
      status: "Pendente",
    },
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Cabeçalho Amarelo sem emojis no título */}
      <View style={styles.headerContainer}>
        <Text style={styles.subTitle}>Suas Viagens e Ingressos</Text>
        <Text style={styles.headerTitle}>Minhas Reservas</Text>
      </View>

      <View style={styles.verticalList}>
        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <Text style={styles.bookingPlaceName}>{booking.placeName}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{booking.status}</Text>
              </View>
            </View>
            <Text style={styles.bookingDetail}>📅 Data: {booking.date}</Text>
            <Text style={styles.bookingDetail}>🎟️ Ingressos: {booking.tickets}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerContainer: {
    backgroundColor: "#CA8A04",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  subTitle: { color: "#FEF08A", fontSize: 14, fontWeight: "500" },
  headerTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold", marginTop: 4 },
  verticalList: { paddingHorizontal: 16, marginTop: 20 },
  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bookingHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  bookingPlaceName: { color: "#0F172A", fontSize: 15, fontWeight: "bold", flex: 1 },
  statusBadge: { backgroundColor: "#FEF08A", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: "#854D0E", fontWeight: "bold", fontSize: 11 },
  bookingDetail: { color: "#64748B", fontSize: 13, marginTop: 4 },
});