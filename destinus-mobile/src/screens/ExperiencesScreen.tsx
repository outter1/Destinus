import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
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
  { id: "Todos", label: "Roteiros", icon: "🗺️" },
  { id: "Trilhas & Natureza", label: "Trilhas", icon: "🌲" },
  { id: "Cultura & História", label: "Cultura", icon: "🏛️" },
  { id: "Gastronomia", label: "Gastronomia", icon: "🍽️" },
];

interface ExperiencesScreenProps {
  onSelectPlace?: (place: Place) => void;
}

export function ExperiencesScreen({ onSelectPlace }: ExperiencesScreenProps) {
  const { theme, fontScale, isNeurodivergent, speak } = useAccessibility();

  const [places] = useState<Place[]>(DEFAULT_PLACES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const activeAccentColor = isNeurodivergent ? theme.accentColor : "#EA580C";
  const headerBgColor = isNeurodivergent ? theme.cardBackgroundColor : "#EA580C";

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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Cabeçalho Acessível */}
      <View style={[styles.headerContainer, { backgroundColor: headerBgColor }]}>
        <Text
          style={[
            styles.headerSubtitle,
            {
              color: isNeurodivergent ? theme.secondaryTextColor : "#FFEDD5",
              fontSize: 14 * fontScale,
              letterSpacing: theme.letterSpacing,
            },
          ]}
        >
          Explorar a região
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
          Para onde vamos hoje?
        </Text>

        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: theme.cardBackgroundColor,
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
            placeholder="Buscar em Caxias e região..."
            placeholderTextColor={theme.secondaryTextColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Campo de busca de locais"
          />
        </View>
      </View>

      {/* Botões de Filtro */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                accessibilityRole="button"
                accessibilityLabel={`Filtro ${cat.label}`}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: isSelected
                      ? isNeurodivergent
                        ? theme.borderColor
                        : "#FFF7ED"
                      : theme.cardBackgroundColor,
                    borderColor: isSelected ? activeAccentColor : theme.borderColor,
                  },
                ]}
                onPress={() => {
                  setSelectedCategory(cat.id);
                  if (speak) speak(`Filtro ${cat.label} selecionado`);
                }}
              >
                {!theme.hideDecorations && (
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                )}
                <Text
                  style={[
                    styles.categoryLabel,
                    {
                      color: isSelected ? activeAccentColor : theme.secondaryTextColor,
                      fontSize: 12 * fontScale,
                      letterSpacing: theme.letterSpacing,
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

      {/* Lista de Destinos */}
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
          Experiências Disponíveis
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
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, em ${item.city}`}
              style={[
                styles.placeCard,
                {
                  backgroundColor: theme.cardBackgroundColor,
                  borderColor: theme.borderColor,
                },
              ]}
              onPress={() => {
                const textToSpeak = `${item.name}. ${item.description || ""} Cidade: ${item.city}`;
                if (speak) speak(textToSpeak);
                if (onSelectPlace) onSelectPlace(item);
              }}
            >
              {!theme.hideDecorations && (
                <Image source={{ uri: item.imageUrl }} style={styles.placeImage} />
              )}
              <View style={styles.placeInfo}>
                <Text
                  style={[
                    styles.placeCategory,
                    {
                      color: activeAccentColor,
                      fontSize: 10 * fontScale,
                      letterSpacing: theme.letterSpacing,
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
                      letterSpacing: theme.letterSpacing,
                      lineHeight: 18 * fontScale * theme.lineHeightMultiplier,
                    },
                  ]}
                >
                  {item.name}
                </Text>
                {item.description && (
                  <Text
                    style={[
                      styles.placeDescription,
                      {
                        color: theme.secondaryTextColor,
                        fontSize: 12 * fontScale,
                        letterSpacing: theme.letterSpacing,
                        lineHeight: 16 * fontScale * theme.lineHeightMultiplier,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                )}
                <Text
                  style={[
                    styles.placeCity,
                    {
                      color: theme.secondaryTextColor,
                      fontSize: 11 * fontScale,
                      letterSpacing: theme.letterSpacing,
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerSubtitle: { marginBottom: 2 },
  headerTitle: { fontWeight: "bold", marginTop: 4 },
  searchBox: {
    flexDirection: "row",
    borderRadius: 14,
    alignItems: "center",
    paddingHorizontal: 14,
    height: 48,
    marginTop: 16,
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
  sectionHeader: { paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontWeight: "bold" },
  verticalList: { paddingHorizontal: 16 },
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
  placeDescription: { marginBottom: 4 },
  placeCity: { marginTop: 2 },
  emptyText: { paddingHorizontal: 16 },
});