import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  Alert,
} from "react-native";

export interface Place {
  id: string;
  name: string;
  city?: string;
  category: string;
  address: string;
  rating: number;
  imageUrl: string;
  googleMapsUrl: string;
  description?: string;
  accessibilityDetails?: {
    wheelchair?: string | boolean;
    blind?: string | boolean;
    tactilePaving?: boolean;
    adaptedRestroom?: boolean;
  };
}

export interface PlaceDetailScreenProps {
  place: Place;
  onBack: () => void;
}

export function PlaceDetailScreen({ place, onBack }: PlaceDetailScreenProps) {
  const openMap = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() =>
        Alert.alert("Erro", "Não foi possível abrir o mapa.")
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Imagem de Capa e Botão Voltar */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: place.imageUrl }} style={styles.detailImage} />
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        {/* Informações do Local */}
        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text style={styles.categoryBadge}>{place.category.toUpperCase()}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {place.rating || "4.5"}</Text>
            </View>
          </View>

          <Text style={styles.title}>{place.name}</Text>
          <Text style={styles.address}>📍 {place.address}</Text>

          {place.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sobre o Local</Text>
              <Text style={styles.sectionText}>{place.description}</Text>
            </View>
          )}

          {place.accessibilityDetails && (
            <View style={styles.accessBox}>
              <Text style={styles.accessTitle}>♿ Acessibilidade:</Text>
              <Text style={styles.accessText}>
                • {typeof place.accessibilityDetails.wheelchair === "string"
                    ? place.accessibilityDetails.wheelchair
                    : "Acesso para cadeirantes disponível"}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => openMap(place.googleMapsUrl)}
          >
            <Text style={styles.mapButtonText}>📍 Abrir no Google Maps</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  imageContainer: {
    position: "relative",
  },
  detailImage: {
    width: "100%",
    height: 250,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  body: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBadge: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "bold",
  },
  ratingBadge: {
    backgroundColor: "#334155",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  address: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionText: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 22,
  },
  accessBox: {
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  accessTitle: {
    color: "#38BDF8",
    fontSize: 14,
    fontWeight: "bold",
  },
  accessText: {
    color: "#CBD5E1",
    fontSize: 13,
    marginTop: 6,
  },
  mapButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});