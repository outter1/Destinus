import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { API_URL } from "../services/api";
import { useAccessibility } from "./AccessibilityContext";

interface AddPlaceScreenProps {
  onBack: () => void;
}

export function AddPlaceScreen({ onBack }: AddPlaceScreenProps) {
  const { theme, fontScale, isNeurodivergent, speak } = useAccessibility();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function handleAddFeature() {
    if (featureInput.trim()) {
      const newFeature = featureInput.trim();
      setFeatures((prev) => [...prev, newFeature]);
      setFeatureInput("");
      if (speak) speak(`Recurso ${newFeature} adicionado`);
    }
  }

  function handleRemoveFeature(index: number, featureName: string) {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
    if (speak) speak(`Recurso ${featureName} removido`);
  }

  async function handleSavePlace() {
    if (!name.trim() || !address.trim()) {
      const msg = "Preencha o nome e o endereço do local!";
      if (speak) speak(msg);
      Alert.alert("Atenção", msg);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/locais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          imageUrl,
          accessibilityFeatures: features.length > 0 ? features : ["Acessível"],
        }),
      });

      if (response.ok) {
        const successMsg = "Local cadastrado com sucesso!";
        if (speak) speak(successMsg);
        Alert.alert("Sucesso", successMsg, [{ text: "OK", onPress: onBack }]);
      } else {
        const errorMsg = "Erro ao cadastrar local.";
        if (speak) speak(errorMsg);
        Alert.alert("Erro", errorMsg);
      }
    } catch (error) {
      const connMsg = "Erro ao conectar ao servidor.";
      if (speak) speak(connMsg);
      Alert.alert("Erro de Conexão", connMsg);
    } finally {
      setLoading(false);
    }
  }

  const primaryBtnColor = isNeurodivergent ? theme.accentColor : "#2E7D32";
  const addBtnColor = isNeurodivergent ? theme.accentColor : "#0066CC";

  const dynamicInputStyle = [
    styles.input,
    {
      backgroundColor: theme.cardBackgroundColor,
      borderColor: theme.borderColor,
      color: theme.textColor,
      fontSize: 14 * fontScale,
      letterSpacing: theme.letterSpacing,
      minHeight: Math.max(48, 48 * fontScale),
    },
  ];

  const dynamicLabelStyle = [
    styles.label,
    {
      color: theme.textColor,
      fontSize: 14 * fontScale,
      letterSpacing: theme.letterSpacing,
      lineHeight: 18 * fontScale * theme.lineHeightMultiplier,
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundColor }}
      contentContainerStyle={styles.container}
    >
      {/* Botão Voltar */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Voltar para a tela anterior"
        onPress={onBack}
        style={[styles.backBtn, { minHeight: Math.max(44, 44 * fontScale) }]}
      >
        <Text
          style={[
            styles.backBtnText,
            {
              color: isNeurodivergent ? theme.accentColor : "#0066CC",
              fontSize: 16 * fontScale,
            },
          ]}
        >
          ← Voltar
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          {
            color: theme.textColor,
            fontSize: 24 * fontScale,
            letterSpacing: theme.letterSpacing,
          },
        ]}
      >
        Cadastrar Novo Local 📍
      </Text>

      {/* Nome */}
      <Text style={dynamicLabelStyle}>Nome do Estabelecimento / Local *</Text>
      <TextInput
        accessibilityLabel="Nome do estabelecimento ou local, campo obrigatório"
        accessibilityHint="Digite o nome do local"
        style={dynamicInputStyle}
        placeholder="Ex: Café Central"
        placeholderTextColor={theme.secondaryTextColor}
        value={name}
        onChangeText={setName}
      />

      {/* Endereço */}
      <Text style={dynamicLabelStyle}>Endereço Completo *</Text>
      <TextInput
        accessibilityLabel="Endereço completo, campo obrigatório"
        accessibilityHint="Digite a rua, número e bairro"
        style={dynamicInputStyle}
        placeholder="Ex: Av. Principal, 500 - Centro"
        placeholderTextColor={theme.secondaryTextColor}
        value={address}
        onChangeText={setAddress}
      />

      {/* URL da Imagem */}
      <Text style={dynamicLabelStyle}>Link da Foto (URL)</Text>
      <TextInput
        accessibilityLabel="Link da foto do local em formato URL"
        accessibilityHint="Insira a URL da imagem do local"
        style={dynamicInputStyle}
        placeholder="http://exemplo.com/foto.jpg"
        placeholderTextColor={theme.secondaryTextColor}
        value={imageUrl}
        onChangeText={setImageUrl}
        autoCapitalize="none"
        keyboardType="url"
      />

      {/* Recursos de Acessibilidade */}
      <Text style={dynamicLabelStyle}>Recursos de Acessibilidade</Text>
      <View style={styles.featureRow}>
        <TextInput
          accessibilityLabel="Novo recurso de acessibilidade"
          accessibilityHint="Digite um recurso como rampa de acesso ou piso tátil"
          style={[dynamicInputStyle, { flex: 1, marginBottom: 0 }]}
          placeholder="Ex: Rampa de acesso"
          placeholderTextColor={theme.secondaryTextColor}
          value={featureInput}
          onChangeText={setFeatureInput}
        />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Adicionar recurso de acessibilidade"
          style={[
            styles.addTagBtn,
            {
              backgroundColor: addBtnColor,
              minHeight: Math.max(48, 48 * fontScale),
            },
          ]}
          onPress={handleAddFeature}
        >
          <Text style={[styles.addTagText, { fontSize: 14 * fontScale }]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Tags com Remoção ao Clicar */}
      <View style={styles.tagsContainer}>
        {features.map((f, i) => (
          <TouchableOpacity
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`Recurso ${f}. Toque para remover.`}
            onPress={() => handleRemoveFeature(i, f)}
            style={[
              styles.tag,
              {
                backgroundColor: theme.cardBackgroundColor,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <Text
              style={[
                styles.tagText,
                {
                  color: theme.textColor,
                  fontSize: 12 * fontScale,
                },
              ]}
            >
              ✓ {f} ✕
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Salvar cadastro do local"
        disabled={loading}
        style={[
          styles.button,
          {
            backgroundColor: primaryBtnColor,
            opacity: loading ? 0.6 : 1,
            minHeight: Math.max(48, 48 * fontScale),
          },
        ]}
        onPress={handleSavePlace}
      >
        <Text style={[styles.buttonText, { fontSize: 16 * fontScale }]}>
          {loading ? "Salvando..." : "Salvar Local"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 40 },
  backBtn: { marginBottom: 12, marginTop: 10, justifyContent: "center" },
  backBtnText: { fontWeight: "bold" },
  title: { fontWeight: "bold", marginBottom: 20 },
  label: { fontWeight: "600", marginBottom: 6, marginTop: 4 },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  featureRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  addTagBtn: {
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addTagText: { color: "#ffffff", fontWeight: "bold" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  tag: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tagText: { fontWeight: "bold" },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#ffffff", fontWeight: "bold" },
});