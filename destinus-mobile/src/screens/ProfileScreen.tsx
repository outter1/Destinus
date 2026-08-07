import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ProfileScreenProps {
  user?: any;
  recentlyViewed?: any[];
  onSelectPlace?: (place: any) => void;
  onUpdateUser?: (user: any) => void;
  onLogout?: () => void;
}

export function ProfileScreen({
  user,
  recentlyViewed = [],
  onSelectPlace,
  onUpdateUser,
  onLogout,
}: ProfileScreenProps) {
  const [profileData, setProfileData] = useState({
    name: user?.name || "Rayssa Rocha",
    email: user?.email || "rayssa@email.com",
    phone: user?.phone || "(21) 98765-4321",
    avatarUri:
      user?.avatarUri ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(profileData.name);
  const [editEmail, setEditEmail] = useState(profileData.email);
  const [editPhone, setEditPhone] = useState(profileData.phone);

  const pickAvatarFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Permita o acesso à galeria para alterar sua foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      const newAvatar = result.assets[0].uri;
      const updated = { ...profileData, avatarUri: newAvatar };
      setProfileData(updated);
      if (onUpdateUser) onUpdateUser(updated);
    }
  };

  const handleSaveProfile = () => {
    const updated = {
      ...profileData,
      name: editName,
      email: editEmail,
      phone: editPhone,
    };
    setProfileData(updated);
    if (onUpdateUser) onUpdateUser(updated);
    setIsEditModalVisible(false);
    Alert.alert("Sucesso", "Dados cadastrais atualizados!");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Perfil & Troca de Foto */}
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatarFromGallery}>
          <Image source={{ uri: profileData.avatarUri }} style={styles.avatarImage} />
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.profileName}>{profileData.name}</Text>
        <Text style={styles.profileEmail}>{profileData.email}</Text>

        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => {
            setEditName(profileData.name);
            setEditEmail(profileData.email);
            setEditPhone(profileData.phone);
            setIsEditModalVisible(true);
          }}
        >
          <Text style={styles.editProfileBtnText}>Editar Dados Cadastrais</Text>
        </TouchableOpacity>
      </View>

      {/* Informações Cadastrais */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Telefone / WhatsApp</Text>
        <Text style={styles.infoValue}>{profileData.phone}</Text>
      </View>

      {/* Seção Visto Recently */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Visto Recently</Text>
      </View>

      {recentlyViewed.length === 0 ? (
        <Text style={styles.emptyText}>Você ainda não navegou por nenhum local.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          {recentlyViewed.map((item) => (
            <TouchableOpacity
              key={`recent_${item.id}`}
              style={styles.recentCard}
              onPress={() => onSelectPlace && onSelectPlace(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.recentCardImage} />
              <View style={styles.recentCardOverlay}>
                <Text style={styles.recentCardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.recentCardCity}>📍 {item.city}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {onLogout && (
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>Sair da Conta</Text>
        </TouchableOpacity>
      )}

      {/* Modal Editar Dados Cadastrais */}
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
                <Text style={styles.closeText}>✕</Text>
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

            <TouchableOpacity style={styles.saveButtonOrange} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
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
  profileName: { color: "#0F172A", fontSize: 20, fontWeight: "bold" },
  profileEmail: { color: "#64748B", fontSize: 13, marginBottom: 16 },
  editProfileBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EA580C",
  },
  editProfileBtnText: { color: "#EA580C", fontWeight: "bold", fontSize: 13 },
  infoCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoLabel: { color: "#64748B", fontSize: 11, fontWeight: "bold" },
  infoValue: { color: "#0F172A", fontSize: 14, marginTop: 2 },
  sectionHeader: { paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { color: "#0F172A", fontSize: 18, fontWeight: "bold" },
  emptyText: { color: "#64748B", paddingHorizontal: 16, fontSize: 13 },
  recentCard: { width: 140, height: 100, borderRadius: 14, overflow: "hidden", marginRight: 12 },
  recentCardImage: { width: "100%", height: "100%" },
  recentCardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    padding: 6,
  },
  recentCardTitle: { color: "#FFFFFF", fontSize: 11, fontWeight: "bold" },
  recentCardCity: { color: "#CBD5E1", fontSize: 9 },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
  },
  logoutBtnText: { color: "#EF4444", fontWeight: "bold", fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  editModalContent: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  editModalTitle: { color: "#0F172A", fontSize: 18, fontWeight: "bold" },
  closeText: { color: "#0F172A", fontSize: 18, fontWeight: "bold" },
  inputLabel: { color: "#64748B", fontSize: 12, marginTop: 12, marginBottom: 4 },
  formInput: {
    backgroundColor: "#F1F5F9",
    color: "#0F172A",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  saveButtonOrange: { backgroundColor: "#EA580C", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 20 },
  saveButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
});