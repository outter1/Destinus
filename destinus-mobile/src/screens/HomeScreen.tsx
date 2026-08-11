import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
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

export interface HomeScreenProps {
  user?: any;
  onNavigateTab?: (tab: string) => void;
  onSelectPlace?: (place: Place) => void;
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
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Parque+Natural+Municipal+da+Taquara+Duque+de+Caxias",
    description: "Unidade de conservação com trilhas de Mata Atlântica e cachoeiras.",
    accessibilityDetails: {
      wheelchair: "Rampa e vias planas no acesso inicial",
      blind: "Monitores capacitados e guia sonoro de apoio",
    },
  },
  {
    id: "caxias_2",
    name: "Museu Vivo do São Bento",
    city: "Duque de Caxias - RJ",
    category: "Cultura & História",
    address: "Rua Benjamin da Rocha Júnior, s/n - São Bento, Duque de Caxias - RJ",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Museu+Vivo+do+Sao+Bento+Duque+de+Caxias",
    description: "Ecomuseu comunitário dedicado à memória e patrimônio da Baixada Fluminense.",
    accessibilityDetails: {
      wheelchair: "Entrada sem degraus e ambiente plano",
      blind: "Acompanhamento monitorado e oficinas sensoriais",
    },
  },
  {
    id: "caxias_5",
    name: "Igreja Matriz de Santo Antônio",
    city: "Duque de Caxias - RJ",
    category: "Cultura & História",
    address: "Av. Gov. Leonel de Moura Brizola, 1861 - Centro, Duque de Caxias - RJ",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1548625361-182283e0ef88?w=600",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Catedral+Santo+Antonio+Duque+de+Caxias",
    description: "Catedral histórica localizada no centro urbano.",
    accessibilityDetails: {
      wheelchair: "Rampa de acesso lateral",
      blind: "Sistema de som adaptado",
    },
  },
  {
    id: "caxias_4",
    name: "Feira e Polo Gastronômico de Caxias",
    city: "Duque de Caxias - RJ",
    category: "Gastronomia",
    address: "Calçadão do Centro - Duque de Caxias - RJ",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Calcadao+Centro+Duque+de+Caxias",
    description: "Ponto comercial com variadas opções gastronômicas regionais.",
    accessibilityDetails: {
      wheelchair: "Calçadão plano",
      blind: "Sinalização sonora de travessia próxima",
    },
  },
];

const CATEGORIES = [
  { id: "Roteiros", label: "Roteiros", icon: "🗺️" },
  { id: "Trilhas & Natureza", label: "Trilhas", icon: "🌲" },
  { id: "Cultura & História", label: "Cultura", icon: "🏛️" },
  { id: "Gastronomia", label: "Gastronomia", icon: "🍽️" },
];

const LANDSCAPE_BANNER_URL = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80";

export function HomeScreen({ user, onSelectPlace }: HomeScreenProps) {
  const [places, setPlaces] = useState<Place[]>(DEFAULT_PLACES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Roteiros");

  // Consumindo dados de acessibilidade dinâmicos
  const { theme, fontScale, isNeurodivergent, speak } = useAccessibility();

  const loadPlacesFromApi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locais`);
      if (response.data && response.data.length > 0) {
        setPlaces(response.data);
      }
    } catch {
      // Mantém os DEFAULT_PLACES offline
    }
  };

  useEffect(() => {
    loadPlacesFromApi();
  }, []);

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchesCategory =
        selectedCategory === "Roteiros" ||
        p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(p.category.toLowerCase());

      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [places, selectedCategory, searchQuery]);

  const handleSelectPlace = (place: Place) => {
    if (speak) speak(`Selecionado ${place.name}`);
    if (onSelectPlace) onSelectPlace(place);
  };

  const handleSelectCategory = (catId: string, label: string) => {
    setSelectedCategory(catId);
    if (speak) speak(`Categoria ${label}`);
  };

  // Renderizador condicional do cabeçalho
  const renderHeaderContent = () => (
    <>
      <View style={styles.topRow}>
        <View>
          <Text
            style={[
              styles.greetingTextOrange,
              {
                fontSize: 14 * fontScale,
                letterSpacing: theme.letterSpacing,
                color: isNeurodivergent ? theme.textColor : "#FFFFFF",
              },
            ]}
          >
            Olá, {user?.username || user?.name || user?.nome || "Rayssa"}!
          </Text>
          <Text
            style={[
              styles.headerTitle,
              {
                fontSize: 26 * fontScale,
                letterSpacing: theme.letterSpacing,
                color: isNeurodivergent ? theme.textColor : "#FFFFFF",
              },
            ]}
          >
            Para onde vamos{"\n"}hoje?
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: theme.cardBackgroundColor,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <Text style={[styles.searchIcon, { fontSize: 16 * fontScale }]}>🔍</Text>
        <TextInput
          style={[
            styles.searchInput,
            {
              color: theme.textColor,
              fontSize: 14 * fontScale,
              letterSpacing: theme.letterSpacing,
            },
          ]}
          placeholder="Buscar em Caxias e Baixada..."
          placeholderTextColor={theme.secondaryTextColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* Desativa imagem de fundo com alto estímulo no modo neurodivergente */}
        {theme.hideDecorations || isNeurodivergent ? (
          <View
            style={[
              styles.headerContainerOrange,
              { backgroundColor: theme.cardBackgroundColor, borderBottomWidth: 1, borderColor: theme.borderColor },
            ]}
          >
            {renderHeaderContent()}
          </View>
        ) : (
          <ImageBackground
            source={{ uri: LANDSCAPE_BANNER_URL }}
            style={styles.headerContainerOrange}
            resizeMode="cover"
          >
            <View style={styles.darkOverlay} />
            {renderHeaderContent()}
          </ImageBackground>
        )}

        {/* Categorias de navegação */}
        <View style={styles.categoriesWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const activeAccentColor = isNeurodivergent ? theme.accentColor : "#F97316";

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
                  onPress={() => handleSelectCategory(cat.id, cat.label)}
                >
                  <Text style={[styles.categoryIcon, { fontSize: 26 * fontScale }]}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      {
                        fontSize: 12 * fontScale,
                        letterSpacing: theme.letterSpacing,
                        color: isSelected ? activeAccentColor : theme.secondaryTextColor,
                        fontWeight: isSelected ? "bold" : "600",
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

        {/* Seção Destinos em Alta */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.textColor,
                fontSize: 18 * fontScale,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            Destinos em alta
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          {filteredPlaces.slice(0, 3).map((item) => (
            <TouchableOpacity
              key={`high_${item.id}`}
              style={[
                styles.highCard,
                {
                  backgroundColor: theme.cardBackgroundColor,
                  borderColor: theme.borderColor,
                  borderWidth: 1,
                },
              ]}
              onPress={() => handleSelectPlace(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.highCardImage} />
              <View
                style={[
                  styles.highCardOverlay,
                  { backgroundColor: isNeurodivergent ? theme.cardBackgroundColor : "rgba(15, 23, 42, 0.85)" },
                ]}
              >
                <Text
                  style={[
                    styles.highCardTitle,
                    {
                      fontSize: 11 * fontScale,
                      letterSpacing: theme.letterSpacing,
                      color: theme.textColor,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.highCardCity,
                    {
                      fontSize: 9 * fontScale,
                      letterSpacing: theme.letterSpacing,
                      color: theme.secondaryTextColor,
                    },
                  ]}
                >
                  📍 {item.city}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Seção Lista Vertical */}
        <View style={[styles.sectionHeader, { marginTop: theme.simplifiedLayout ? 28 : 24 }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.textColor,
                fontSize: 18 * fontScale,
                letterSpacing: theme.letterSpacing,
              },
            ]}
          >
            Especialmente para Você
          </Text>
        </View>

        <View style={styles.verticalList}>
          {filteredPlaces.length === 0 ? (
            <Text
              style={[
                styles.emptyText,
                {
                  color: theme.secondaryTextColor,
                  fontSize: 13 * fontScale,
                  letterSpacing: theme.letterSpacing,
                },
              ]}
            >
              Nenhum local encontrado para esta busca.
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
                    borderWidth: 1,
                    marginBottom: theme.simplifiedLayout ? 16 : 12,
                  },
                ]}
                onPress={() => handleSelectPlace(item)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.placeImage} />
                <View style={styles.placeInfo}>
                  <Text
                    style={[
                      styles.placeCategoryOrange,
                      {
                        fontSize: 10 * fontScale,
                        letterSpacing: theme.letterSpacing,
                        color: isNeurodivergent ? theme.accentColor : "#F97316",
                      },
                    ]}
                  >
                    {item.category ? item.category.toUpperCase() : "TURISMO"}
                  </Text>
                  <Text
                    style={[
                      styles.placeName,
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
                      styles.placeCity,
                      {
                        fontSize: 12 * fontScale,
                        letterSpacing: theme.letterSpacing,
                        color: theme.secondaryTextColor,
                      },
                    ]}
                  >
                    📍 {item.city}
                  </Text>
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
  headerContainerOrange: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    position: "relative",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  greetingTextOrange: {
    fontWeight: "600",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitle: {
    fontWeight: "bold",
    lineHeight: 32,
    marginTop: 4,
  },
  searchBox: {
    flexDirection: "row",
    borderRadius: 14,
    alignItems: "center",
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1 },
  categoriesWrapper: { marginTop: -16, paddingLeft: 16 },
  categoryCard: {
    borderRadius: 16,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1.5,
  },
  categoryIcon: { marginBottom: 4 },
  categoryLabel: { fontWeight: "600" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontWeight: "bold" },
  highCard: {
    width: 140,
    height: 100,
    borderRadius: 14,
    overflow: "hidden",
    marginRight: 12,
  },
  highCardImage: { width: "100%", height: "100%" },
  highCardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
  },
  highCardTitle: { fontWeight: "bold" },
  highCardCity: {},
  verticalList: { paddingHorizontal: 16, marginTop: 12 },
  placeCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  placeImage: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  placeInfo: { flex: 1, justifyContent: "center" },
  placeCategoryOrange: { fontWeight: "bold", marginBottom: 2 },
  placeName: { fontWeight: "bold", marginBottom: 4 },
  placeCity: {},
  emptyText: { paddingHorizontal: 16 },
});