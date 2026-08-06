import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { API_URL } from "../services/api";

interface AddPlaceScreenProps {
  onBack: () => void;
}

export function AddPlaceScreen({ onBack }: AddPlaceScreenProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  function handleAddFeature() {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  }

  async function handleSavePlace() {
    if (!name || !address) {
      alert("Preencha o nome e o endereço do local!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/locais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          imageUrl,
          accessibilityFeatures: features.length > 0 ? features : ["Acessível"]
        })
      });

      if (response.ok) {
        alert("Local cadastrado com sucesso!");
        onBack();
      } else {
        alert("Erro ao cadastrar local.");
      }
    } catch (error) {
      alert("Erro ao conectar ao servidor.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Cadastrar Novo Local 📍</Text>

      <Text style={styles.label}>Nome do Estabelecimento / Local</Text>
      <TextInput style={styles.input} placeholder="Ex: Café Central" value={name} onChangeText={setName} />

      <Text style={styles.label}>Endereço Completo</Text>
      <TextInput style={styles.input} placeholder="Ex: Av. Principal, 500 - Centro" value={address} onChangeText={setAddress} />

      <Text style={styles.label}>Link da Foto (URL)</Text>
      <TextInput style={styles.input} placeholder="http://exemplo.com/foto.jpg" value={imageUrl} onChangeText={setImageUrl} />

      <Text style={styles.label}>Recursos de Acessibilidade</Text>
      <View style={styles.featureRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Ex: Rampa de acesso"
          value={featureInput}
          onChangeText={setFeatureInput}
        />
        <TouchableOpacity style={styles.addTagBtn} onPress={handleAddFeature}>
          <Text style={styles.addTagText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tagsContainer}>
        {features.map((f, i) => (
          <Text key={i} style={styles.tag}>✓ {f}</Text>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSavePlace}>
        <Text style={styles.buttonText}>Salvar Local</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff" },
  backBtn: { marginBottom: 12, marginTop: 10 },
  backBtnText: { color: "#0066cc", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 4 },
  input: { backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
  featureRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  addTagBtn: { backgroundColor: "#0066cc", paddingHorizontal: 16, borderRadius: 8, justifyContent: "center" },
  addTagText: { color: "#fff", fontWeight: "bold" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  tag: { backgroundColor: "#e1f5fe", color: "#0288d1", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, fontSize: 12 },
  button: { backgroundColor: "#2e7d32", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});