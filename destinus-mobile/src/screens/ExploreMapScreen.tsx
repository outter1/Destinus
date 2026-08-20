import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Linking,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import { useAccessibility } from "./AccessibilityContext";
import { API_URL } from "../services/api";
import { useUserLocation } from "../utils/useUserLocation";

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
}

interface ExploreMapScreenProps {
  onSelectPlace?: (place: Place) => void;
}

const CITIES = ["Todas", "Duque de Caxias", "Nova Iguaçu", "São João de Meriti", "Rio de Janeiro"];

export function ExploreMapScreen({ onSelectPlace }: ExploreMapScreenProps) {
  const { theme, fontScale, isNeurodivergent, speak } = useAccessibility();
  const { location, status: locationStatus } = useUserLocation();

  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    // Só busca depois que a localização terminou de carregar (mesmo que o
    // usuário tenha negado a permissão, nesse ponto já temos o fallback),
    // para que a primeira busca já saia com o lugar certo do usuário.
    if (locationStatus === "loading") return;

    const params = new URLSearchParams({
      lat: String(location.latitude),
      lng: String(location.longitude),
    });
    if (location.city) params.set("city", location.city);

    fetch(`${API_URL}/locais?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setPlaces(data))
      .catch((err) => console.log("Erro ao carregar locais:", err));
  }, [locationStatus, location.latitude, location.longitude, location.city]);

  const filteredPlaces =
    selectedCity === "Todas"
      ? places
      : places.filter((p) => p.city.toLowerCase().includes(selectedCity.toLowerCase()));

  function openGoogleMaps(url: string) {
    if (url) {
      Linking.openURL(url).catch((err) => console.error("Erro ao abrir o mapa:", err));
    }
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    if (speak) speak(`Filtrando por ${city}`);
  };

  const activeAccentColor = isNeurodivergent ? theme.accentColor : "#2563EB";

  // HTML com OpenStreetMap via Leaflet para renderização webview gratuita e acessível
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html, #map { height: 100%; margin: 0; padding: 0; background-color: ${theme.backgroundColor}; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${location.latitude}, ${location.longitude}], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          // Marcador da localização atual do usuário
          L.circleMarker([${location.latitude}, ${location.longitude}], {
            radius: 8, color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.6
          }).addTo(map).bindPopup('Você está aqui');

          const places = ${JSON.stringify(filteredPlaces)};
          places.forEach(place => {
            const lat = place.latitude || place.lat || ${location.latitude};
            const lng = place.longitude || place.lng || ${location.longitude};
            L.marker([lat, lng]).addTo(map)
              .bindPopup('<b>' + place.name + '</b><br>' + place.city);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Cabeçalho */}
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <Text
          style={[
            styles.title,
            {
              color: theme.textColor,
              fontSize: 20 * fontScale,
              letterSpacing: theme.letterSpacing,
            },
          ]}
        >
          Explorar Mapa
        </Text>

        <Pressable
          style={[
            styles.toggleButton,
            {
              backgroundColor: theme.cardBackgroundColor,
              borderColor: theme.borderColor,
            },
          ]}
          onPress={() => setShowMap(!showMap)}
        >
          <Text
            style={{
              color: activeAccentColor,
              fontSize: 12 * fontScale,
              fontWeight: "bold",
            }}
          >
            {showMap ? "📋 Esconder Mapa" : "🗺️ Mostrar Mapa"}
          </Text>
        </Pressable>
      </View>

      {/* Filtro de Cidades */}
      <View style={styles.citiesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CITIES.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <Pressable
                key={city}
                style={[
                  styles.cityChip,
                  {
                    backgroundColor: theme.cardBackgroundColor,
                    borderColor: isSelected ? activeAccentColor : theme.borderColor,
                  },
                ]}
                onPress={() => handleCitySelect(city)}
              >
                <Text
                  style={[
                    styles.cityChipText,
                    {
                      fontSize: 12 * fontScale,
                      letterSpacing: theme.letterSpacing,
                      color: isSelected ? activeAccentColor : theme.secondaryTextColor,
                      fontWeight: isSelected ? "bold" : "500",
                    },
                  ]}
                >
                  {city}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* WebView do Mapa Interativo */}
      {showMap && (
        <View style={[styles.mapContainer, { borderColor: theme.borderColor }]}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: mapHtml }}
            style={{ flex: 1 }}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Lista de Locais */}
      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBackgroundColor,
                borderColor: theme.borderColor,
                marginBottom: theme.simplifiedLayout ? 16 : 12,
              },
            ]}
            onPress={() => {
              if (speak) speak(item.name);
              if (onSelectPlace) onSelectPlace(item);
            }}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

            <View style={styles.cardInfo}>
              <Text
                style={[
                  styles.cardCategory,
                  {
                    fontSize: 10 * fontScale,
                    letterSpacing: theme.letterSpacing,
                    color: activeAccentColor,
                  },
                ]}
              >
                {item.category?.toUpperCase() || "TURISMO"}
              </Text>

              <Text
                style={[
                  styles.cardTitle,
                  {
                    fontSize: 15 * fontScale,
                    letterSpacing: theme.letterSpacing,
                    color: theme.textColor,
                  },
                ]}
              >
                {item.name}
              </Text>

              <Text
                style={[
                  styles.cardCity,
                  {
                    fontSize: 12 * fontScale,
                    letterSpacing: theme.letterSpacing,
                    color: theme.secondaryTextColor,
                  },
                ]}
              >
                📍 {item.city}
              </Text>

              {item.googleMapsUrl && (
                <Pressable
                  style={styles.mapsLink}
                  onPress={() => openGoogleMaps(item.googleMapsUrl)}
                >
                  <Text
                    style={{
                      color: activeAccentColor,
                      fontSize: 12 * fontScale,
                      fontWeight: "bold",
                    }}
                  >
                    🗺️ Abrir no Google Maps
                  </Text>
                </Pressable>
              )}
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: { fontWeight: "bold" },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  citiesWrapper: { paddingVertical: 10, paddingLeft: 16 },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  cityChipText: {},
  mapContainer: {
    height: 200,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
  },
  card: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cardImage: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  cardInfo: { flex: 1, justifyContent: "center" },
  cardCategory: { fontWeight: "bold", marginBottom: 2 },
  cardTitle: { fontWeight: "bold", marginBottom: 4 },
  cardCity: { marginBottom: 6 },
  mapsLink: { marginTop: 2 },
});