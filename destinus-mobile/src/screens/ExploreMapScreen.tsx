import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable, Linking } from "react-native";
import { useAccessibility } from "./AccessibilityContext";
import { API_URL } from "../services/api";

interface ExploreMapScreenProps {
  onSelectPlace?: (place: any) => void;
}

export function ExploreMapScreen({ onSelectPlace }: ExploreMapScreenProps) {
  const { fontScale, getColors } = useAccessibility();
  const colors = getColors();

  const [places, setPlaces] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("Todas");

  useEffect(() => {
    fetch(`${API_URL}/locais`)
      .then((res) => res.json())
      .then((data) => setPlaces(data))
      .catch((err) => console.log("Erro ao carregar locais:", err));
  }, []);

  const filteredPlaces = selectedCity === "Todas" 
    ? places 
    : places.filter((p) => p.city === selectedCity);

  function openGoogleMaps(url: string) {
    Linking.openURL(url).catch(() => alert("Não foi possível abrir o Google Maps."));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.header, { color: colors.text, fontSize: 22 * fontScale }]}>
        Atrativos na Baixada Fluminense 📍
      </Text>

      {/* Filtro Rápido por Município */}
      <View style={styles.cityFilters}>
        {["Todas", "Duque de Caxias", "Nova Iguaçu"].map((city) => (
          <Pressable
            key={city}
            style={[styles.cityChip, { backgroundColor: selectedCity === city ? colors.primary : colors.cardBg }]}
            onPress={() => setSelectedCity(city)}
          >
            <Text style={{ color: selectedCity === city ? "#FFF" : colors.text, fontWeight: "bold" }}>
              {city}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => onSelectPlace?.(item)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={{ padding: 14 }}>
              <Text style={[styles.category, { color: colors.accent, fontSize: 12 * fontScale }]}>
                {item.category} • {item.city}
              </Text>
              <Text style={[styles.title, { color: colors.text, fontSize: 18 * fontScale }]}>
                {item.name}
              </Text>
              <Text style={[styles.address, { color: colors.text, fontSize: 13 * fontScale }]}>
                📍 {item.address}
              </Text>

              {/* Bloco de Acessibilidade Específica */}
              <View style={styles.accessBox}>
                <Text style={[styles.accessTitle, { fontSize: 13 * fontScale }]}>♿ Recursos de Acessibilidade:</Text>
                <Text style={[styles.accessText, { fontSize: 12 * fontScale }]}>
                  🧑‍🦽 Cadeirante: {item.accessibilityDetails?.wheelchair}
                </Text>
                <Text style={[styles.accessText, { fontSize: 12 * fontScale }]}>
                  🦯 Cego / Baixa Visão: {item.accessibilityDetails?.blind}
                </Text>
              </View>

              <Pressable
                style={[styles.mapBtn, { backgroundColor: colors.primary }]}
                onPress={() => openGoogleMaps(item.googleMapsUrl)}
              >
                <Text style={[styles.mapBtnText, { fontSize: 14 * fontScale }]}>
                  🗺️ Ver Rota Acessível no Google Maps
                </Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  header: { fontWeight: "bold", marginBottom: 12 },
  cityFilters: { flexDirection: "row", gap: 8, marginBottom: 16 },
  cityChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#DDD" },
  card: { borderRadius: 12, marginBottom: 16, overflow: "hidden", borderWidth: 1 },
  image: { width: "100%", height: 160 },
  category: { fontWeight: "bold", textTransform: "uppercase" },
  title: { fontWeight: "bold", marginTop: 2 },
  address: { marginTop: 4 },
  accessBox: { marginTop: 12, backgroundColor: "rgba(0,0,0,0.03)", padding: 10, borderRadius: 8 },
  accessTitle: { fontWeight: "bold", marginBottom: 4 },
  accessText: { marginTop: 2, color: "#444" },
  mapBtn: { marginTop: 12, padding: 12, borderRadius: 8, alignItems: "center" },
  mapBtnText: { color: "#FFF", fontWeight: "bold" }
});