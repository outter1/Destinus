import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Image, Pressable, FlatList } from "react-native";
import { COLORS } from "../constants/theme";
import { API_URL } from "../services/api";

interface HomeProps {
  user: any;
  onNavigateTab: (tab: string) => void;
  onSelectPlace: (place: any) => void;
}

export function HomeScreen({ user, onNavigateTab, onSelectPlace }: HomeProps) {
  const [places, setPlaces] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPlaces();
  }, [search]);

  function fetchPlaces() {
    fetch(`${API_URL}/locais?query=${search}`)
      .then((res) => res.json())
      .then((data) => setPlaces(data))
      .catch((err) => console.log(err));
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Estilo Referência */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name || "viajante"}! 👋</Text>
            <Text style={styles.headerTitle}>Para onde vamos hoje?</Text>
          </View>
          <Image source={require("../../assets/logo.png")} style={styles.logoHeader} resizeMode="contain" />
        </View>

        {/* Input de Busca */}
        <View style={styles.searchBox}>
          <Text>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Para onde você quer ir?"
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Botões de Categoria Coloridos */}
      <View style={styles.categoriesContainer}>
        <Pressable style={styles.catItem} onPress={() => onNavigateTab("reservations")}>
          <View style={[styles.catIcon, { backgroundColor: "#0096C7" }]}>
            <Text style={styles.iconText}>✈️</Text>
          </View>
          <Text style={styles.catText}>Voos</Text>
        </Pressable>

        <Pressable style={styles.catItem} onPress={() => onNavigateTab("reservations")}>
          <View style={[styles.catIcon, { backgroundColor: COLORS.accentOrange }]}>
            <Text style={styles.iconText}>🏨</Text>
          </View>
          <Text style={styles.catText}>Hotéis</Text>
        </Pressable>

        <Pressable style={styles.catItem} onPress={() => onNavigateTab("experiences")}>
          <View style={[styles.catIcon, { backgroundColor: COLORS.accentYellow }]}>
            <Text style={styles.iconText}>📷</Text>
          </View>
          <Text style={styles.catText}>Experiências</Text>
        </Pressable>

        <Pressable style={styles.catItem} onPress={() => onNavigateTab("map")}>
          <View style={[styles.catIcon, { backgroundColor: COLORS.accentTeal }]}>
            <Text style={styles.iconText}>🗺️</Text>
          </View>
          <Text style={styles.catText}>Roteiros</Text>
        </Pressable>
      </View>

      {/* Destinos em Alta */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Destinos em alta 🔥</Text>
        <Pressable onPress={() => onNavigateTab("map")}>
          <Text style={styles.seeAll}>Ver todos</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={places}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => onSelectPlace(item)}>
            <Image source={{ uri: item.imageUrl || "https://picsum.photos/300/200" }} style={styles.cardImg} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>{item.city}</Text>
            </View>
          </Pressable>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: 50, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { color: "#E0F2FE", fontSize: 14, fontWeight: "500" },
  headerTitle: { color: "#FFF", fontSize: 22, fontWeight: "bold", marginTop: 2 },
  logoHeader: { width: 50, height: 50 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", marginTop: 20, borderRadius: 16, paddingHorizontal: 14, height: 48 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: COLORS.textDark },
  categoriesContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: -20, marginHorizontal: 20, backgroundColor: "#FFF", paddingVertical: 16, borderRadius: 20, elevation: 4, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8 },
  catItem: { alignItems: "center" },
  catIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginBottom: 6 },
  iconText: { fontSize: 20 },
  catText: { fontSize: 12, fontWeight: "600", color: COLORS.textDark },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 24, marginBottom: 12, alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.textDark },
  seeAll: { color: COLORS.primary, fontWeight: "600" },
  card: { width: 180, backgroundColor: "#FFF", borderRadius: 16, marginRight: 14, overflow: "hidden", borderWidth: 1, borderColor: COLORS.border },
  cardImg: { width: "100%", height: 120 },
  cardContent: { padding: 12 },
  cardTitle: { fontWeight: "bold", fontSize: 15, color: COLORS.textDark },
  cardSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 }
});