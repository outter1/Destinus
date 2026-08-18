import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useAccessibility } from "./AccessibilityContext";

const API_BASE_URL = "http://192.168.1.100:3000";

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
  };
}

export interface ExperiencesScreenProps {
  onSelectPlace?: (place: Place) => void;
  navigation?: any;
}

const DEFAULT_PLACES: Place[] = [
  {
    id: "caxias_1",
    name: "Parque Natural Municipal da Taquara",
    city: "Duque de Caxias - RJ",
    category: "Trilhas & Natureza",
    address: "Estrada Cachoeira das Dores, 3465 - Imbariê, Duque de Caxias - RJ",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Parque+Natural+Municipal+da+Taquara",
    description: "Unidade de conservação com trilhas de Mata Atlântica e cachoeiras.",
  },
  {
    id: "caxias_2",
    name: "Museu Vivo do São Bento",
    city: "Duque de Caxias - RJ",
    category: "Cultura & História",
    address: "Rua Benjamin da Rocha Júnior, s/n - São Bento, Duque de Caxias - RJ",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Museu+Vivo+do+Sao+Bento",
    description: "Ecomuseu comunitário dedicado à memória e patrimônio regional.",
  },
  {
    id: "caxias_3",
    name: "Igreja Matriz de Santo Antônio",
    city: "Duque de Caxias - RJ",
    category: "Cultura & História",
    address: "Av. Gov. Leonel de Moura Brizola, 1861 - Centro, Duque de Caxias - RJ",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1548625361-182283e0ef88?w=600",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Catedral+Santo+Antonio",
    description: "Catedral histórica no centro da cidade.",
  },
  {
    id: "caxias_4",
    name: "Polo Gastronômico de Caxias",
    city: "Duque de Caxias - RJ",
    category: "Gastronomia",
    address: "Calçadão do Centro - Duque de Caxias - RJ",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Calcadao+Centro+Duque+de+Caxias",
    description: "Ponto comercial com variadas opções gastronômicas regionais.",
  },
];

const CATEGORIES = [
  { id: "Todos", label: "Todos", icon: "🗺️" },
  { id: "Trilhas & Natureza", label: "Trilhas", icon: "🌲" },
  { id: "Cultura & História", label: "Cultura", icon: "🏛️" },
  { id: "Gastronomia", label: "Gastronomia", icon: "🍽️" },
];

export function ExperiencesScreen({ onSelectPlace, navigation }: ExperiencesScreenProps) {
  const { theme, fontScale, isNeurodivergent, speak } = useAccessibility();

  const [places] = useState<Place[]>(DEFAULT_PLACES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const activeAccentColor = isNeurodivergent ? theme.accentColor : "#F97316";

  const handleReservar = async (place: Place) => {
    const codigoReserva = `TAQ-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      setLoadingId(place.id);

      await axios.post(`${API_BASE_URL}/reservas`, {
        id_usuario: 1,
        id_local: place.id,
        codigo_reserva: codigoReserva,
        titulo: place.name,
        data_horario: new Date().toISOString(),
        quantidade_pessoas: 1,
        status: "confirmada",
      });

      if (speak) speak(`Reserva confirmada para ${place.name}`);

      Alert.alert(
        "Reserva Confirmada! 🎉",
        `Sua reserva para "${place.name}" foi realizada com sucesso.\n\nCódigo: ${codigoReserva}`
      );
    } catch (error) {
      Alert.alert(
        "Reserva Solicitada",
        `Reserva gerada localmente com o código ${codigoReserva}.`
      );
    } finally {
      setLoadingId(null);
    }
  };

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchesCategory =
        selectedCategory === "Todos" ||
        p.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [places, selectedCategory, searchQuery]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Cabeçalho */}
        <View style={[styles.headerContainer, { backgroundColor: theme.cardBackgroundColor, borderColor: theme.borderColor }]}>
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.textColor,
                fontSize: 24 * fontScale,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            Experiências
          </Text>

          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: theme.backgroundColor,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: theme.textColor,
                  fontSize: 14 * fontScale,
                },
              ]}
              placeholder="Buscar experiências..."
              placeholderTextColor={theme.secondaryTextColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categorias */}
        <View style={styles.categoriesWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: theme.cardBackgroundColor,
                      borderColor: isSelected ? activeAccentColor : theme.borderColor,
                    },
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    if (speak) speak(`Filtro ${cat.label}`);
                  }}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      {
                        color: isSelected ? activeAccentColor : theme.secondaryTextColor,
                        fontSize: 12 * fontScale,
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Lista de Experiências */}
        <View style={styles.verticalList}>
          {filteredPlaces.length === 0 ? (
            <Text
              style={[
                styles.emptyText,
                {
                  color: theme.secondaryTextColor,
                  fontSize: 13 * fontScale,
                },
              ]}
            >
              Nenhuma experiência encontrada.
            </Text>
          ) : (
            filteredPlaces.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.placeCard,
                  {
                    backgroundColor: theme.cardBackgroundColor,
                    borderColor: theme.borderColor,
                  },
                ]}
                onPress={() => {
                  if (speak) speak(item.name);
                  if (onSelectPlace) onSelectPlace(item);
                }}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.placeImage} />
                <View style={styles.placeInfo}>
                  <Text
                    style={[
                      styles.placeCategory,
                      {
                        color: activeAccentColor,
                        fontSize: 10 * fontScale,
                      },
                    ]}
                  >
                    {item.category.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.placeName,
                      {
                        color: theme.textColor,
                        fontSize: 15 * fontScale,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.placeCity,
                      {
                        color: theme.secondaryTextColor,
                        fontSize: 11 * fontScale,
                      },
                    ]}
                  >
                    📍 {item.city}
                  </Text>

                  {/* Botão Reservar */}
                  <TouchableOpacity
                    style={[
                      styles.reserveButton,
                      { backgroundColor: activeAccentColor },
                    ]}
                    disabled={loadingId === item.id}
                    onPress={() => handleReservar(item)}
                  >
                    <Text style={[styles.reserveButtonText, { fontSize: 11 * fontScale }]}>
                      {loadingId === item.id ? "Reservando..." : "Reservar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontWeight: "bold", marginBottom: 12 },
  searchBox: {
    flexDirection: "row",
    borderRadius: 14,
    alignItems: "center",
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1 },
  categoriesWrapper: { marginTop: 16, paddingLeft: 16 },
  categoryCard: {
    borderRadius: 16,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1.5,
  },
  categoryIcon: { fontSize: 24, marginBottom: 4 },
  categoryLabel: { fontWeight: "600" },
  verticalList: { paddingHorizontal: 16, marginTop: 16 },
  placeCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  placeImage: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  placeInfo: { flex: 1 },
  placeCategory: { fontWeight: "bold", marginBottom: 2 },
  placeName: { fontWeight: "bold", marginBottom: 4 },
  placeCity: { marginBottom: 6 },
  emptyText: { paddingHorizontal: 16 },
  reserveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  reserveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});