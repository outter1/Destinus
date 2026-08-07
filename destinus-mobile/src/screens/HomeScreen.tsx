import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  SafeAreaView,
  Linking,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

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

export interface Booking {
  id: string;
  placeName: string;
  date: string;
  tickets: number;
  status: string;
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

export function HomeScreen({ user, onNavigateTab, onSelectPlace }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<"experiencias" | "reservas" | "perfil">("experiencias");

  const [places, setPlaces] = useState<Place[]>(DEFAULT_PLACES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Roteiros");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const [recentlyViewed, setRecentlyViewed] = useState<Place[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: user?.name || user?.nome || "Rayssa Rocha",
    username: user?.username || "rayssard2005",
    email: user?.email || "rayssa@email.com",
    phone: user?.phone || "(21) 98765-4321",
    avatarUri: user?.avatarUri || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editPhone, setEditPhone] = useState(userProfile.phone);

  const [bookings] = useState<Booking[]>([
    {
      id: "b1",
      placeName: "Parque Natural Municipal da Taquara",
      date: "15/10/2026 - 09:00",
      tickets: 2,
      status: "Confirmada",
    },
    {
      id: "b2",
      placeName: "Museu Vivo do São Bento",
      date: "22/10/2026 - 14:00",
      tickets: 1,
      status: "Pendente",
    },
  ]);

  const loadPlacesFromApi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locais`);
      if (response.data && response.data.length > 0) {
        setPlaces(response.data);
      }
    } catch {
      // Mantém os DEFAULT_PLACES em caso de erro/offline
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
    setSelectedPlace(place);
    if (onSelectPlace) onSelectPlace(place);

    setRecentlyViewed((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      if (exists) return prev;
      return [place, ...prev];
    });
  };

  const handleTabChange = (tab: "experiencias" | "reservas" | "perfil") => {
    setActiveTab(tab);
    if (onNavigateTab) onNavigateTab(tab);
  };

  const openGoogleMaps = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() =>
        Alert.alert("Erro", "Não foi possível abrir o Google Maps.")
      );
    }
  };

  const pickAvatarImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "É necessário conceder acesso à galeria para alterar a foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUserProfile((prev) => ({ ...prev, avatarUri: result.assets[0].uri }));
    }
  };

  const handleSaveProfile = () => {
    setUserProfile((prev) => ({
      ...prev,
      name: editName,
      email: editEmail,
      phone: editPhone,
    }));
    setIsEditModalVisible(false);
    Alert.alert("Sucesso", "Dados cadastrais atualizados com sucesso!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ABA 1: EXPERIÊNCIAS */}
      {activeTab === "experiencias" && (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.headerContainerOrange}>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.greetingTextOrange}>Olá, {userProfile.username}!</Text>
                <Text style={styles.headerTitle}>Para onde vamos{"\n"}hoje?</Text>
              </View>
            </View>

            <View style={styles.searchBox}>
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

          <View style={styles.categoriesWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.selectedCategoryCardOrange,
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.categoryLabel,
                        isSelected && styles.selectedCategoryLabelOrange,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destinos em alta</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
            {filteredPlaces.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={`high_${item.id}`}
                style={styles.highCard}
                onPress={() => handleSelectPlace(item)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.highCardImage} />
                <View style={styles.highCardOverlay}>
                  <Text style={styles.highCardTitle} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.highCardCity}>📍 {item.city}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>Especialmente para Você</Text>
          </View>

          <View style={styles.verticalList}>
            {filteredPlaces.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum local encontrado para esta busca.</Text>
            ) : (
              filteredPlaces.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.placeCard}
                  onPress={() => handleSelectPlace(item)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.placeImage} />
                  <View style={styles.placeInfo}>
                    <Text style={styles.placeCategoryOrange}>
                      {item.category ? item.category.toUpperCase() : "TURISMO"}
                    </Text>
                    <Text style={styles.placeName}>{item.name}</Text>
                    <Text style={styles.placeCity}>📍 {item.city}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* ABA 2: RESERVAS */}
      {activeTab === "reservas" && (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.headerContainerYellow}>
            <Text style={styles.greetingTextYellow}>Suas Viagens & Ingressos</Text>
            <Text style={styles.headerTitle}>Minhas Reservas</Text>
          </View>

          <View style={styles.verticalList}>
            {bookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingPlaceName}>{booking.placeName}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{booking.status}</Text>
                  </View>
                </View>
                <Text style={styles.bookingDetail}>📅 Data: {booking.date}</Text>
                <Text style={styles.bookingDetail}>🎟️ Ingressos: {booking.tickets}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ABA 3: PERFIL */}
      {activeTab === "perfil" && (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatarImage}>
              <Image source={{ uri: userProfile.avatarUri }} style={styles.avatarImage} />
              <View style={styles.cameraBadge}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileUsername}>@{userProfile.username}</Text>

            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => {
                setEditName(userProfile.name);
                setEditEmail(userProfile.email);
                setEditPhone(userProfile.phone);
                setIsEditModalVisible(true);
              }}
            >
              <Text style={styles.editProfileBtnText}>Editar Dados Cadastrais</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.sectionHeader, { marginTop: 10 }]}>
            <Text style={styles.sectionTitle}>Visto Recentemente</Text>
          </View>

          {recentlyViewed.length === 0 ? (
            <Text style={styles.emptyText}>Você ainda não visualizou nenhum local.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
              {recentlyViewed.map((item) => (
                <TouchableOpacity
                  key={`recent_${item.id}`}
                  style={styles.highCard}
                  onPress={() => handleSelectPlace(item)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.highCardImage} />
                  <View style={styles.highCardOverlay}>
                    <Text style={styles.highCardTitle} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.highCardCity}>📍 {item.city}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </ScrollView>
      )}

      {/* MODAL DETALHES DO LOCAL */}
      <Modal
        visible={selectedPlace !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedPlace(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            {selectedPlace && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selectedPlace.imageUrl }} style={styles.modalPlaceImage} />

                <TouchableOpacity
                  style={styles.modalCloseIconBtn}
                  onPress={() => setSelectedPlace(null)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                <View style={styles.modalBody}>
                  <View style={styles.modalMetaRow}>
                    <Text style={styles.modalCategoryBadge}>
                      {selectedPlace.category?.toUpperCase()}
                    </Text>
                    <Text style={styles.modalRatingText}>⭐ {selectedPlace.rating || 4.8}</Text>
                  </View>

                  <Text style={styles.modalTitle}>{selectedPlace.name}</Text>
                  <Text style={styles.modalAddress}>📍 {selectedPlace.address}</Text>

                  {selectedPlace.description && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoSectionTitle}>Sobre o Local</Text>
                      <Text style={styles.infoSectionText}>{selectedPlace.description}</Text>
                    </View>
                  )}

                  <View style={styles.accessBox}>
                    <Text style={styles.accessTitle}>♿ Acessibilidade e Inclusão:</Text>
                    <Text style={styles.accessItemText}>
                      • {typeof selectedPlace.accessibilityDetails?.wheelchair === "string"
                          ? selectedPlace.accessibilityDetails.wheelchair
                          : "Acesso adaptado disponível"}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => openGoogleMaps(selectedPlace.googleMapsUrl)}
                  >
                    <Text style={styles.mapButtonText}>📍 Abrir Trajeto no Google Maps</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL EDITAR PERFIL */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.editModalTitle}>Editar Dados Cadastrais</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nome Completo</Text>
            <TextInput
              style={styles.formInput}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.formInput}
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>Telefone / WhatsApp</Text>
            <TextInput
              style={styles.formInput}
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* NAVEGAÇÃO INFERIOR */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabChange("experiencias")}
        >
          <Text style={[styles.tabIcon, activeTab === "experiencias" && styles.tabIconActiveOrange]}>
            🗺️
          </Text>
          <Text style={[styles.tabLabel, activeTab === "experiencias" && styles.tabLabelActiveOrange]}>
            Experiências
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabChange("reservas")}
        >
          <Text style={[styles.tabIcon, activeTab === "reservas" && styles.tabIconActiveYellow]}>
            🎟️
          </Text>
          <Text style={[styles.tabLabel, activeTab === "reservas" && styles.tabLabelActiveYellow]}>
            Reservas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabChange("perfil")}
        >
          <Text style={[styles.tabIcon, activeTab === "perfil" && styles.tabIconActiveOrange]}>
            👤
          </Text>
          <Text style={[styles.tabLabel, activeTab === "perfil" && styles.tabLabelActiveOrange]}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },

  headerContainerOrange: {
    backgroundColor: "#EA580C",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greetingTextOrange: { color: "#FFEDD5", fontSize: 14, fontWeight: "500" },

  headerContainerYellow: {
    backgroundColor: "#CA8A04",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greetingTextYellow: { color: "#FEF08A", fontSize: 14, fontWeight: "500" },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitle: { color: "#FFFFFF", fontSize: 26, fontWeight: "bold", lineHeight: 32, marginTop: 4 },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#0F172A",
    borderRadius: 14,
    alignItems: "center",
    paddingHorizontal: 14,
    height: 50,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, color: "#FFFFFF", fontSize: 14 },

  categoriesWrapper: { marginTop: -16, paddingLeft: 16 },
  categoryCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  selectedCategoryCardOrange: { borderColor: "#F97316" },
  categoryIcon: { fontSize: 26, marginBottom: 4 },
  categoryLabel: { color: "#94A3B8", fontSize: 12, fontWeight: "600" },
  selectedCategoryLabelOrange: { color: "#F97316", fontWeight: "bold" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },

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
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    padding: 6,
  },
  highCardTitle: { color: "#FFFFFF", fontSize: 11, fontWeight: "bold" },
  highCardCity: { color: "#CBD5E1", fontSize: 9 },

  verticalList: { paddingHorizontal: 16, marginTop: 12 },
  placeCard: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  placeImage: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  placeInfo: { flex: 1, justifyContent: "center" },
  placeCategoryOrange: { color: "#F97316", fontSize: 10, fontWeight: "bold", marginBottom: 2 },
  placeName: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold", marginBottom: 4 },
  placeCity: { color: "#94A3B8", fontSize: 12 },
  emptyText: { color: "#64748B", paddingHorizontal: 16, fontSize: 13 },

  bookingCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  bookingHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  bookingPlaceName: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold", flex: 1 },
  statusBadge: { backgroundColor: "#EAB308", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: "#0F172A", fontWeight: "bold", fontSize: 10 },
  bookingDetail: { color: "#94A3B8", fontSize: 12, marginTop: 2 },

  profileHeader: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 16 },
  avatarContainer: { position: "relative", marginBottom: 12 },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#EA580C",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: { fontSize: 14 },
  profileName: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold" },
  profileUsername: { color: "#94A3B8", fontSize: 13, marginBottom: 16 },
  editProfileBtn: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EA580C",
  },
  editProfileBtnText: { color: "#EA580C", fontWeight: "bold", fontSize: 13 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  detailModalContent: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "88%",
    overflow: "hidden",
  },
  modalPlaceImage: { width: "100%", height: 200 },
  modalCloseIconBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  modalBody: { padding: 20 },
  modalMetaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  modalCategoryBadge: { color: "#F97316", fontWeight: "bold", fontSize: 12 },
  modalRatingText: { color: "#F59E0B", fontWeight: "bold", fontSize: 14 },
  modalTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  modalAddress: { color: "#94A3B8", fontSize: 13, marginBottom: 16 },
  infoSection: { marginBottom: 16 },
  infoSectionTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold", marginBottom: 6 },
  infoSectionText: { color: "#CBD5E1", fontSize: 13, lineHeight: 20 },
  accessBox: { backgroundColor: "#0F172A", padding: 14, borderRadius: 12, marginBottom: 20 },
  accessTitle: { color: "#38BDF8", fontSize: 13, fontWeight: "bold", marginBottom: 6 },
  accessItemText: { color: "#CBD5E1", fontSize: 12, marginTop: 4 },
  mapButton: {
    backgroundColor: "#EA580C",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  mapButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },

  editModalContent: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  editModalTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  inputLabel: { color: "#94A3B8", fontSize: 12, marginTop: 12, marginBottom: 4 },
  formInput: {
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  saveButton: {
    backgroundColor: "#EA580C",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },

  bottomTabBar: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabIcon: { fontSize: 20, opacity: 0.5 },
  tabIconActiveOrange: { opacity: 1 },
  tabIconActiveYellow: { opacity: 1 },
  tabLabel: { fontSize: 11, color: "#64748B", marginTop: 2 },
  tabLabelActiveOrange: { color: "#EA580C", fontWeight: "bold" },
  tabLabelActiveYellow: { color: "#EAB308", fontWeight: "bold" },
});