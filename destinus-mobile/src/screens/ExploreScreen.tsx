import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Linking, ActivityIndicator } from "react-native";
import { API_URL } from "../services/api";

export function ExploreScreen() {
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState("Todos");
  const [loading, setLoading] = useState(true);

  const categories = ["Todos", "Praia", "Montanha", "Cidade", "Rural"];

  function loadPlaces(cat: string) {
    setLoading(true);
    fetch(`${API_URL}/locais?category=${cat}`)
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadPlaces(selectedCat);
  }, [selectedCat]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore destinos 🗺️</Text>

      {/* Pill Filters */}
      <View style={styles.pillsContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.pill, selectedCat === cat && styles.pillActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text style={[styles.pillText, selectedCat === cat && styles.pillTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0077ee" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => item.bookingUrl && Linking.openURL(item.bookingUrl)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.rating}>⭐ {item.ratingAvg}</Text>
              </View>
              <Text style={styles.cardAddress}>📍 {item.address}</Text>

              <View style={styles.tagContainer}>
                {item.accessibilityFeatures?.map((f: string, i: number) => (
                  <Text key={i} style={styles.tag}>✓ {f}</Text>
                ))}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7fa", padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1a202c", marginBottom: 16 },
  pillsContainer: { flexDirection: "row", marginBottom: 16, gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#edf2f7" },
  pillActive: { backgroundColor: "#0077ee" },
  pillText: { color: "#4a5568", fontWeight: "600", fontSize: 13 },
  pillTextActive: { color: "#ffffff" },
  card: { backgroundColor: "#ffffff", borderRadius: 14, padding: 14, marginBottom: 16, elevation: 2 },
  cardImage: { width: "100%", height: 150, borderRadius: 10, marginBottom: 10 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: "#2d3748" },
  rating: { fontSize: 14, color: "#d69e2e", fontWeight: "bold" },
  cardAddress: { fontSize: 13, color: "#718096", marginTop: 2 },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  tag: { backgroundColor: "#ebf8ff", color: "#2b6cb0", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 11, fontWeight: "600" }
});