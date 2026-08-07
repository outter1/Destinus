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
  const [places] = useState<Place[]>(DEFAULT_PLACES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Cabeçalho Laranja sem emojis no título */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerSubtitle}>Explorar a região</Text>
        <Text style={styles.headerTitle}>Para onde vamos hoje?</Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar em Caxias e região..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
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
                style={[styles.categoryCard, isSelected && styles.selectedCategoryCard]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryLabel, isSelected && styles.selectedCategoryLabel]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Destinos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Experiências Disponíveis</Text>
      </View>

      <View style={styles.verticalList}>
        {filteredPlaces.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum local encontrado para esta busca.</Text>
        ) : (
          filteredPlaces.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.placeCard}
              onPress={() => onSelectPlace && onSelectPlace(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.placeImage} />
              <View style={styles.placeInfo}>
                <Text style={styles.placeCategory}>{item.category.toUpperCase()}</Text>
                <Text style={styles.placeName}>{item.name}</Text>
                <Text style={styles.placeCity}>📍 {item.city}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerContainer: {
    backgroundColor: "#EA580C",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerSubtitle: { color: "#FFEDD5", fontSize: 14 },
  headerTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold", marginTop: 4 },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    alignItems: "center",
    paddingHorizontal: 14,
    height: 48,
    marginTop: 16,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, color: "#0F172A", fontSize: 14 },
  categoriesWrapper: { marginTop: 16, paddingLeft: 16 },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  selectedCategoryCard: { borderColor: "#EA580C", backgroundColor: "#FFF7ED" },
  categoryIcon: { fontSize: 24, marginBottom: 4 },
  categoryLabel: { color: "#64748B", fontSize: 12, fontWeight: "600" },
  selectedCategoryLabel: { color: "#EA580C", fontWeight: "bold" },
  sectionHeader: { paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  sectionTitle: { color: "#0F172A", fontSize: 18, fontWeight: "bold" },
  verticalList: { paddingHorizontal: 16 },
  placeCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  placeImage: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  placeInfo: { flex: 1 },
  placeCategory: { color: "#EA580C", fontSize: 10, fontWeight: "bold", marginBottom: 2 },
  placeName: { color: "#0F172A", fontSize: 15, fontWeight: "bold", marginBottom: 4 },
  placeCity: { color: "#64748B", fontSize: 12 },
  emptyText: { color: "#64748B", fontSize: 13, paddingHorizontal: 16 },
});