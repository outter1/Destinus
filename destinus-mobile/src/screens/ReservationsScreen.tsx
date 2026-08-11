import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useAccessibility } from "./AccessibilityContext";

export interface Reservation {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  guests: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  code: string;
  imageUrl?: string;
  description?: string;
}

const DEFAULT_RESERVATIONS: Reservation[] = [
  {
    id: "res_1",
    title: "Trilha Guiada no Parque da Taquara",
    category: "Trilhas & Natureza",
    date: "15/10/2026",
    time: "09:00",
    location: "Parque Natural Municipal da Taquara",
    guests: 2,
    status: "confirmed",
    code: "TAQ-8821",
    imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600",
    description: "Caminhada acompanhada por guia local credenciado com interpretação ambiental.",
  },
  {
    id: "res_2",
    title: "Visita Histórica ao Museu Vivo do São Bento",
    category: "Cultura & História",
    date: "22/10/2026",
    time: "14:30",
    location: "São Bento, Duque de Caxias",
    guests: 1,
    status: "pending",
    code: "MSB-4032",
    imageUrl: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600",
    description: "Tour educativo pela memória comunitária da Baixada Fluminense.",
  },
  {
    id: "res_3",
    title: "Degustação no Polo Gastronômico",
    category: "Gastronomia",
    date: "02/09/2026",
    time: "19:00",
    location: "Calçadão do Centro, Duque de Caxias",
    guests: 3,
    status: "completed",
    code: "POL-1094",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    description: "Experiência gastronômica com pratos típicos da região.",
  },
];

export function ReservationsScreen() {
  const { theme, fontScale, isNeurodivergent, speak } = useAccessibility();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [reservations, setReservations] = useState<Reservation[]>(DEFAULT_RESERVATIONS);

  const headerBgColor = isNeurodivergent ? theme.cardBackgroundColor : "#CA8A04";
  const activeAccentColor = isNeurodivergent ? theme.accentColor : "#CA8A04";

  // Filtro simples entre "Próximas" e "Histórico"
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      if (activeTab === "upcoming") {
        return res.status === "confirmed" || res.status === "pending";
      }
      return res.status === "completed" || res.status === "cancelled";
    });
  }, [reservations, activeTab]);

  // Configuração acessível de badges (sem depender unicamente da cor)
  const getStatusBadge = (status: Reservation["status"]) => {
    if (isNeurodivergent) {
      switch (status) {
        case "confirmed":
          return { label: "Confirmada", color: theme.textColor, bgColor: theme.borderColor, icon: "✓" };
        case "pending":
          return { label: "Aguardando", color: theme.textColor, bgColor: theme.borderColor, icon: "⏳" };
        case "completed":
          return { label: "Concluída", color: theme.secondaryTextColor, bgColor: theme.borderColor, icon: "★" };
        case "cancelled":
          return { label: "Cancelada", color: theme.secondaryTextColor, bgColor: theme.borderColor, icon: "✕" };
      }
    }

    switch (status) {
      case "confirmed":
        return { label: "Confirmada", color: "#15803D", bgColor: "#DCFCE7", icon: "✓" };
      case "pending":
        return { label: "Aguardando", color: "#B45309", bgColor: "#FEF3C7", icon: "⏳" };
      case "completed":
        return { label: "Concluída", color: "#2563EB", bgColor: "#DBEAFE", icon: "★" };
      case "cancelled":
        return { label: "Cancelada", color: "#B91C1C", bgColor: "#FEE2E2", icon: "✕" };
    }
  };

  const handleCancelReservation = (id: string, title: string) => {
    Alert.alert(
      "Cancelar Agendamento",
      `Deseja realmente cancelar sua reserva para "${title}"?`,
      [
        { text: "Manter reserva", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: () => {
            setReservations((prev) =>
              prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
            );
            if (speak) speak(`Agendamento para ${title} foi cancelado.`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Cabeçalho */}
      <View style={[styles.headerContainer, { backgroundColor: headerBgColor }]}>
        <Text
          style={[
            styles.headerSubtitle,
            {
              color: isNeurodivergent ? theme.secondaryTextColor : "#FEF08A",
              fontSize: 14 * fontScale,
              letterSpacing: theme.letterSpacing,
            },
          ]}
        >
          Seus Agendamentos
        </Text>
        <Text
          style={[
            styles.headerTitle,
            {
              color: isNeurodivergent ? theme.textColor : "#FFFFFF",
              fontSize: 24 * fontScale,
              letterSpacing: theme.letterSpacing,
              lineHeight: 28 * fontScale * theme.lineHeightMultiplier,
            },
          ]}
        >
          Minhas Reservas
        </Text>
      </View>

      {/* Seleção Simplificada de Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "upcoming" }}
          accessibilityLabel="Aba Próximos Agendamentos"
          style={[
            styles.tabButton,
            {
              backgroundColor: activeTab === "upcoming" ? activeAccentColor : theme.cardBackgroundColor,
              borderColor: theme.borderColor,
            },
          ]}
          onPress={() => {
            setActiveTab("upcoming");
            if (speak) speak("Exibindo próximas reservas");
          }}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === "upcoming" ? "#FFFFFF" : theme.textColor,
                fontSize: 14 * fontScale,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            Próximas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "past" }}
          accessibilityLabel="Aba Histórico de Agendamentos"
          style={[
            styles.tabButton,
            {
              backgroundColor: activeTab === "past" ? activeAccentColor : theme.cardBackgroundColor,
              borderColor: theme.borderColor,
            },
          ]}
          onPress={() => {
            setActiveTab("past");
            if (speak) speak("Exibindo histórico de reservas");
          }}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === "past" ? "#FFFFFF" : theme.textColor,
                fontSize: 14 * fontScale,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Cartões de Agendamento */}
      <View style={styles.listContainer}>
        {filteredReservations.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: theme.cardBackgroundColor,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <Text style={{ fontSize: 32, marginBottom: 8 }}>📭</Text>
            <Text
              style={[
                styles.emptyText,
                {
                  color: theme.textColor,
                  fontSize: 14 * fontScale,
                  letterSpacing: theme.letterSpacing,
                  lineHeight: 20 * fontScale * theme.lineHeightMultiplier,
                },
              ]}
            >
              Nenhuma reserva encontrada nesta categoria.
            </Text>
          </View>
        ) : (
          filteredReservations.map((item) => {
            const statusInfo = getStatusBadge(item.status);

            return (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Reserva para ${item.title}, dia ${item.date} às ${item.time}. Status: ${statusInfo.label}. Código: ${item.code}`}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.cardBackgroundColor,
                    borderColor: theme.borderColor,
                  },
                ]}
                onPress={() => {
                  if (speak) {
                    speak(
                      `Reserva de ${item.title}. Data: ${item.date} às ${item.time}. Local: ${item.location}. Código do comprovante: ${item.code}. Status: ${statusInfo.label}.`
                    );
                  }
                }}
              >
                {/* Topo do Cartão: Título e Status */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text
                      style={[
                        styles.cardCategory,
                        {
                          color: activeAccentColor,
                          fontSize: 11 * fontScale,
                          letterSpacing: theme.letterSpacing,
                        },
                      ]}
                    >
                      {item.category.toUpperCase()}
                    </Text>
                    <Text
                      style={[
                        styles.cardTitle,
                        {
                          color: theme.textColor,
                          fontSize: 16 * fontScale,
                          letterSpacing: theme.letterSpacing,
                          lineHeight: 20 * fontScale * theme.lineHeightMultiplier,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>

                  {/* Badge de Status Acessível */}
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusInfo.bgColor },
                    ]}
                  >
                    <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                      {statusInfo.icon} {statusInfo.label}
                    </Text>
                  </View>
                </View>

                {/* Conteúdo Central: Foto opcional e Dados Organizados */}
                <View style={styles.cardBody}>
                  {!theme.hideDecorations && item.imageUrl && (
                    <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                  )}

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>📅</Text>
                      <Text
                        style={[
                          styles.detailText,
                          {
                            color: theme.textColor,
                            fontSize: 13 * fontScale,
                            letterSpacing: theme.letterSpacing,
                          },
                        ]}
                      >
                        {item.date} às {item.time}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>📍</Text>
                      <Text
                        style={[
                          styles.detailText,
                          {
                            color: theme.secondaryTextColor,
                            fontSize: 12 * fontScale,
                            letterSpacing: theme.letterSpacing,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item.location}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>👥</Text>
                      <Text
                        style={[
                          styles.detailText,
                          {
                            color: theme.secondaryTextColor,
                            fontSize: 12 * fontScale,
                            letterSpacing: theme.letterSpacing,
                          },
                        ]}
                      >
                        {item.guests} {item.guests === 1 ? "pessoa" : "pessoas"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Código de Comprovante em Destaque Simplificado */}
                <View
                  style={[
                    styles.codeBox,
                    {
                      backgroundColor: isNeurodivergent ? theme.backgroundColor : "#F8FAFC",
                      borderColor: theme.borderColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.codeLabel,
                      {
                        color: theme.secondaryTextColor,
                        fontSize: 11 * fontScale,
                        letterSpacing: theme.letterSpacing,
                      },
                    ]}
                  >
                    CÓDIGO DE RESERVA:
                  </Text>
                  <Text
                    style={[
                      styles.codeValue,
                      {
                        color: theme.textColor,
                        fontSize: 13 * fontScale,
                        letterSpacing: theme.letterSpacing,
                      },
                    ]}
                  >
                    {item.code}
                  </Text>
                </View>

                {/* Ações do Cartão */}
                {(item.status === "confirmed" || item.status === "pending") && (
                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Cancelar agendamento de ${item.title}`}
                      style={[
                        styles.cancelButton,
                        { borderColor: isNeurodivergent ? theme.borderColor : "#FCA5A5" },
                      ]}
                      onPress={() => handleCancelReservation(item.id, item.title)}
                    >
                      <Text
                        style={[
                          styles.cancelButtonText,
                          {
                            color: isNeurodivergent ? theme.textColor : "#DC2626",
                            fontSize: 12 * fontScale,
                            letterSpacing: theme.letterSpacing,
                          },
                        ]}
                      >
                        Cancelar Reserva
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerSubtitle: { fontWeight: "500" },
  headerTitle: { fontWeight: "bold", marginTop: 4 },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  tabText: { fontWeight: "bold" },
  listContainer: { paddingHorizontal: 16, marginTop: 16 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardCategory: { fontWeight: "bold", marginBottom: 2 },
  cardTitle: { fontWeight: "bold" },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeText: { fontWeight: "bold", fontSize: 11 },
  cardBody: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
  },
  detailsContainer: { flex: 1, gap: 4 },
  detailRow: { flexDirection: "row", alignItems: "center" },
  detailIcon: { width: 20, fontSize: 13 },
  detailText: { fontWeight: "500" },
  codeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  codeLabel: { fontWeight: "bold" },
  codeValue: { fontWeight: "bold", fontFamily: "monospace" },
  cardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    alignItems: "flex-end",
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButtonText: { fontWeight: "bold" },
  emptyCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
  },
  emptyText: { textAlign: "center" },
});