import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { API_URL as CONFIG_API_URL } from "../config/api";

const API_URL = CONFIG_API_URL || "http://10.0.2.2:3000";

export interface Destination {
  id: string;
  name: string;
  city: string;
  category: string;
  imageUrl: string;
  rating: number;
  accessible: boolean;
}

interface HomeScreenProps {
  user?: any;
  onNavigateTab?: (tab: string) => void;
  onSelectPlace?: (place: Destination) => void;
}

const BAIXADA_DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "Parque Natural da Taquara",
    city: "Duque de Caxias - RJ",
    category: "Trilhas & Natureza",
    imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    accessible: true,
  },
  {
    id: "2",
    name: "Museu Vivo do São Bento",
    city: "Duque de Caxias - RJ",
    category: "Cultura & História",
    imageUrl: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    accessible: true,
  },
  {
    id: "3",
    name: "Reserva Biológica do Tinguá",
    city: "Nova Iguaçu / Caxias - RJ",
    category: "Ecoturismo",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    accessible: false,
  },
  {
    id: "4",
    name: "Igreja Matriz de Santo Antônio",
    city: "Duque de Caxias - RJ",
    category: "Patrimônio Histórico",
    imageUrl: "https://images.unsplash.com/photo-1548625361-1859c8334468?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    accessible: true,
  },
  {
    id: "5",
    name: "Vila de Secretário & Serra do Tinguá",
    city: "Baixada Fluminense - RJ",
    category: "Passeios ao Ar Livre",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    accessible: true,
  },
];

const CATEGORIES = [
  { id: "all", label: "Roteiros", icon: "🗺️" },
  { id: "nature", label: "Trilhas", icon: "🌲" },
  { id: "culture", label: "Cultura", icon: "🏛️" },
  { id: "food", label: "Gastronomia", icon: "🍽️" },
  { id: "leisure", label: "Passeios", icon: "🚶" },
];

export function HomeScreen({ user, onNavigateTab, onSelectPlace }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [destinations, setDestinations] = useState<Destination[]>(BAIXADA_DESTINATIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/destinos/baixada`);
      if (response.data && response.data.length > 0) {
        setDestinations(response.data);
      }
    } catch (error) {
      setDestinations(BAIXADA_DESTINATIONS);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = destinations.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const firstName = user?.name ? user.name.split(" ")[0] : "viajante";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabeçalho Principal */}
        <View style={styles.heroContainer}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greetingText}>Olá, {firstName}! 👋</Text>
              <Text style={styles.heroTitle}>Para onde vamos{"\n"}hoje?</Text>
            </View>
            <View style={styles.notificationBadge}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </View>
          </View>

          {/* Campo de Busca */}
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar em Caxias e Baixada..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categorias */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === cat.id && styles.categoryCardActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <View style={styles.categoryIconContainer}>
                  <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === cat.id && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Seção Em Alta */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Destinos em alta 🔥</Text>
          <Pressable onPress={() => onNavigateTab && onNavigateTab("experiences")}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#F2861F" style={{ marginVertical: 30 }} />
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filteredDestinations}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalCardsList}
            renderItem={({ item }) => (
              <Pressable
                style={styles.destinationCard}
                onPress={() => onSelectPlace && onSelectPlace(item)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                <View style={styles.cardTag}>
                  <Text style={styles.cardTagText}>⭐ {item.rating}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    📍 {item.city}
                  </Text>
                  {item.accessible && (
                    <View style={styles.accessibilityBadge}>
                      <Text style={styles.accessibilityText}>♿ Acessível</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            )}
          />
        )}

        {/* Recomendados */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Especialmente para Você 🎯</Text>
        </View>

        <View style={styles.verticalList}>
          {filteredDestinations.map((item) => (
            <Pressable
              key={`vert-${item.id}`}
              style={styles.verticalCard}
              onPress={() => onSelectPlace && onSelectPlace(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.verticalCardImage} />
              <View style={styles.verticalCardBody}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>📍 {item.city}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  heroContainer: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greetingText: { color: "#93C5FD", fontSize: 15, fontWeight: "600" },
  heroTitle: { color: "#FFFFFF", fontSize: 26, fontWeight: "800", marginTop: 4, lineHeight: 32 },
  notificationBadge: { backgroundColor: "rgba(255, 255, 255, 0.2)", padding: 10, borderRadius: 12 },
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: { marginRight: 10, fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: "#1E293B" },
  categoriesSection: { marginTop: -20, marginBottom: 10 },
  categoriesList: { paddingHorizontal: 16, gap: 12 },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minWidth: 80,
    elevation: 2,
  },
  categoryCardActive: { borderColor: "#F2861F", backgroundColor: "#FFF7ED" },
  categoryIconContainer: { marginBottom: 4 },
  categoryLabel: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  categoryLabelActive: { color: "#F2861F", fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  seeAllText: { fontSize: 13, color: "#2563EB", fontWeight: "600" },
  horizontalCardsList: { paddingLeft: 20, paddingRight: 10 },
  destinationCard: {
    width: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginRight: 12,
    elevation: 3,
  },
  cardImage: { width: "100%", height: 140 },
  cardTag: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardTagText: { color: "#FFFFFF", fontSize: 11, fontWeight: "bold" },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  cardSubtitle: { fontSize: 12, color: "#64748B", marginTop: 2 },
  accessibilityBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  accessibilityText: { color: "#2563EB", fontSize: 10, fontWeight: "600" },
  verticalList: { paddingHorizontal: 20, gap: 12, paddingBottom: 30 },
  verticalCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  verticalCardImage: { width: 80, height: 80, borderRadius: 12 },
  verticalCardBody: { flex: 1, marginLeft: 12 },
  categoryBadgeText: {
    fontSize: 11,
    color: "#F2861F",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 2,
  },
});