import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  Linking,
} from "react-native";
import { useAccessibility } from "./AccessibilityContext";

export interface Place {
  id: string;
  name: string;
  city: string;
  category: string;
  address: string;
  rating: number;
  imageUrl: string;
  googleMapsUrl: string;
  description?: string;
  accessibilityDetails?: {
    wheelchair?: string | boolean;
    blind?: string | boolean;
    neurodivergent?: string | boolean;
  };
}

interface PlaceDetailScreenProps {
  place: Place;
  onBack?: () => void;
  onReserve?: (place: Place) => void;
}

export function PlaceDetailScreen({ place, onBack, onReserve }: PlaceDetailScreenProps) {
  const { theme, fontScale, isNeurodivergent, speak } = useAccessibility();

  if (!place) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={{ color: theme.textColor, padding: 20 }}>Local não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const activeAccentColor = isNeurodivergent ? theme.accentColor : "#F97316";

  const handleOpenMaps = () => {
    if (place.googleMapsUrl) {
      if (speak) speak("Abrindo localização no Google Maps");
      Linking.openURL(place.googleMapsUrl).catch((err) =>
        console.error("Erro ao abrir mapa:", err)
      );
    }
  };

  const handleReserve = () => {
    if (speak) speak(`Iniciando reserva para ${place.name}`);
    if (onReserve) onReserve(place);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Botão de Voltar */}
        <View style={styles.topBar}>
          <Pressable
            style={[
              styles.backButton,
              { backgroundColor: theme.cardBackgroundColor, borderColor: theme.borderColor },
            ]}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a tela anterior"
          >
            <Text style={{ color: theme.textColor, fontSize: 16 * fontScale, fontWeight: "bold" }}>
              ← Voltar
            </Text>
          </Pressable>
        </View>

        {/* Imagem principal (ocultada no modo neurodivergente/sem distrações) */}
        {!theme.hideDecorations && (
          <Image source={{ uri: place.imageUrl }} style={styles.heroImage} />
        )}

        <View style={styles.content}>
          {/* Categoria e Nome */}
          <Text
            style={[
              styles.category,
              {
                color: activeAccentColor,
                fontSize: 12 * fontScale,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            {place.category ? place.category.toUpperCase() : "TURISMO"}
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: theme.textColor,
                fontSize: 24 * fontScale,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            {place.name}
          </Text>

          <Text
            style={[
              styles.address,
              {
                color: theme.secondaryTextColor,
                fontSize: 14 * fontScale,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            📍 {place.address || place.city}
          </Text>

          {/* Avaliação */}
          {place.rating && (
            <View
              style={[
                styles.ratingBadge,
                { backgroundColor: theme.cardBackgroundColor, borderColor: theme.borderColor },
              ]}
            >
              <Text style={{ color: "#EAB308", fontSize: 14 * fontScale, fontWeight: "bold" }}>
                ⭐ {place.rating} / 5.0
              </Text>
            </View>
          )}

          {/* Card de Detalhes de Acessibilidade (Alto Contraste) */}
          <View
            style={[
              styles.accessibilityCard,
              {
                backgroundColor: theme.cardBackgroundColor,
                borderColor: activeAccentColor,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionHeader,
                {
                  color: theme.textColor,
                  fontSize: 16 * fontScale,
                  letterSpacing: theme.letterSpacing,
                },
              ]}
            >
              ♿ Recursos de Acessibilidade
            </Text>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textColor, fontSize: 14 * fontScale }]}>
                👩‍🦽 Mobilidade:
              </Text>
              <Text style={[styles.detailValue, { color: theme.secondaryTextColor, fontSize: 13 * fontScale }]}>
                {typeof place.accessibilityDetails?.wheelchair === "string"
                  ? place.accessibilityDetails.wheelchair
                  : place.accessibilityDetails?.wheelchair
                  ? "Acesso adaptado disponível"
                  : "Não informado"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textColor, fontSize: 14 * fontScale }]}>
                👁️ Deficiência Visual:
              </Text>
              <Text style={[styles.detailValue, { color: theme.secondaryTextColor, fontSize: 13 * fontScale }]}>
                {typeof place.accessibilityDetails?.blind === "string"
                  ? place.accessibilityDetails.blind
                  : place.accessibilityDetails?.blind
                  ? "Recursos táteis/sonoros disponíveis"
                  : "Não informado"}
              </Text>
            </View>
          </View>

          {/* Descrição */}
          {place.description && (
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionHeader,
                  {
                    color: theme.textColor,
                    fontSize: 16 * fontScale,
                    letterSpacing: theme.letterSpacing,
                  },
                ]}
              >
                Sobre o Local
              </Text>
              <Text
                style={[
                  styles.descriptionText,
                  {
                    color: theme.textColor,
                    fontSize: 14 * fontScale,
                    letterSpacing: theme.letterSpacing,
                    lineHeight: (14 * fontScale) * 1.5,
                  },
                ]}
              >
                {place.description}
              </Text>
            </View>
          )}

          {/* Ações: Mapa e Reserva */}
          <View style={styles.actionContainer}>
            {place.googleMapsUrl && (
              <Pressable
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: theme.cardBackgroundColor,
                    borderColor: theme.borderColor,
                  },
                ]}
                onPress={handleOpenMaps}
                accessibilityRole="button"
                accessibilityLabel="Abrir localização no Google Maps"
              >
                <Text
                  style={{
                    color: theme.textColor,
                    fontSize: 14 * fontScale,
                    fontWeight: "bold",
                    letterSpacing: theme.letterSpacing,
                  }}
                >
                  🗺️ Abrir no Mapa
                </Text>
              </Pressable>
            )}

            <Pressable
              style={[
                styles.primaryButton,
                {
                  backgroundColor: activeAccentColor,
                },
              ]}
              onPress={handleReserve}
              accessibilityRole="button"
              accessibilityLabel={`Fazer reserva para ${place.name}`}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  {
                    fontSize: 16 * fontScale,
                    letterSpacing: theme.letterSpacing,
                  },
                ]}
              >
                📅 Fazer Reserva
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  backButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  heroImage: { width: "100%", height: 220 },
  content: { padding: 16 },
  category: { fontWeight: "bold", marginBottom: 4 },
  title: { fontWeight: "bold", marginBottom: 6 },
  address: { marginBottom: 12 },
  ratingBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  accessibilityCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 20,
  },
  sectionHeader: { fontWeight: "bold", marginBottom: 10 },
  detailRow: { marginBottom: 8 },
  detailLabel: { fontWeight: "bold" },
  detailValue: { marginTop: 2 },
  section: { marginBottom: 20 },
  descriptionText: {},
  actionContainer: { marginTop: 10, gap: 12 },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});