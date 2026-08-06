import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Linking } from "react-native";
import { COLORS } from "../constants/theme";

interface PlaceDetailProps {
  place: any;
  onBack: () => void;
}

export function PlaceDetailScreen({ place, onBack }: PlaceDetailProps) {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgLight }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner com Botão Voltar */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: place.imageUrl || "https://picsum.photos/600/400" }} style={styles.heroImage} />
          <Pressable style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>← Voltar</Text>
          </Pressable>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.category}>{place.category} • {place.city}</Text>
          <Text style={styles.title}>{place.name}</Text>
          <Text style={styles.address}>📍 {place.address}</Text>

          {/* Seção de Acessibilidade Certificada */}
          <View style={styles.accessBox}>
            <Text style={styles.accessBoxTitle}>♿ Recursos de Acessibilidade Testados</Text>

            <View style={styles.accessRow}>
              <Text style={styles.accessIcon}>🧑‍🦽</Text>
              <Text style={styles.accessDesc}>Cadeirante: {place.accessibilityDetails?.wheelchair || "Rampa e elevador disponível"}</Text>
            </View>

            <View style={styles.accessRow}>
              <Text style={styles.accessIcon}>🦯</Text>
              <Text style={styles.accessDesc}>Baixa Visão: {place.accessibilityDetails?.blind || "Piso tátil e audiodescrição"}</Text>
            </View>
          </View>

          {/* Botões de Ação Direct-to-Merchant */}
          <Pressable style={styles.actionBtnPrimary} onPress={() => Linking.openURL(place.googleMapsUrl || "https://maps.google.com")}>
            <Text style={styles.actionBtnText}>🗺️ Abrir Rota Acessível no Maps</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: { position: "relative", width: "100%", height: 280 },
  heroImage: { width: "100%", height: "100%" },
  backBtn: { position: "absolute", top: 40, left: 20, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  backBtnText: { color: "#FFF", fontWeight: "bold" },
  contentBox: { padding: 20, backgroundColor: COLORS.bgLight, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20 },
  category: { fontSize: 12, fontWeight: "bold", color: COLORS.primary, textTransform: "uppercase" },
  title: { fontSize: 24, fontWeight: "bold", color: COLORS.textDark, marginTop: 4 },
  address: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  accessBox: { marginTop: 20, backgroundColor: "#FFF", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  accessBoxTitle: { fontSize: 15, fontWeight: "bold", color: COLORS.textDark, marginBottom: 12 },
  accessRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  accessIcon: { fontSize: 18, marginRight: 10 },
  accessDesc: { fontSize: 13, color: COLORS.textDark, flex: 1 },
  actionBtnPrimary: { marginTop: 24, backgroundColor: COLORS.accentOrange, paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  actionBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 }
});