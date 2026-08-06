import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView } from "react-native";
import { COLORS } from "../constants/theme";
import { API_URL } from "../services/api";

export function ExperiencesScreen() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState("Todos");

  useEffect(() => {
    fetch(`${API_URL}/experiencias`)
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.log(err));
  }, []);

  const categories = ["Todos", "Aventura", "Cultura", "Gastronomia", "Ecoturismo"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Experiências Inesquecíveis ✨</Text>
      </View>

      {/* Categorias estilo Airbnb */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.catChip, selectedCat === cat && styles.catChipActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text style={[styles.catText, selectedCat === cat && styles.catTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={experiences}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl || "https://picsum.photos/400/250" }} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <View style={styles.rowBetween}>
                <Text style={styles.category}>{item.category || "Passeio"}</Text>
                <Text style={styles.price}>{item.price || "R$ 150"}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.location}>📍 {item.location || "Baixada Fluminense"}</Text>

              <View style={styles.accessBadge}>
                <Text style={styles.accessText}>♿ {item.accessibilitySummary || "Adaptado para Cadeira de Rodas"}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  catScroll: { paddingHorizontal: 20, marginVertical: 14, maxHeight: 40 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#FFF", borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  catChipActive: { backgroundColor: COLORS.accentOrange, borderColor: COLORS.accentOrange },
  catText: { fontSize: 13, fontWeight: "600", color: COLORS.textDark },
  catTextActive: { color: "#FFF" },
  card: { backgroundColor: "#FFF", borderRadius: 20, overflow: "hidden", marginBottom: 20, borderWidth: 1, borderColor: COLORS.border, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardImage: { width: "100%", height: 180 },
  cardBody: { padding: 16 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  category: { fontSize: 12, fontWeight: "bold", color: COLORS.primary, textTransform: "uppercase" },
  price: { fontSize: 16, fontWeight: "bold", color: COLORS.accentOrange },
  title: { fontSize: 18, fontWeight: "bold", color: COLORS.textDark, marginTop: 4 },
  location: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  accessBadge: { marginTop: 12, backgroundColor: "#E0F2FE", padding: 8, borderRadius: 8 },
  accessText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: "600" }
});