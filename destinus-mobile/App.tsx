import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView, StatusBar } from "react-native";
import { COLORS } from "./src/constants/theme";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ExperiencesScreen } from "./src/screens/ExperiencesScreen";
import { ReservationsScreen } from "./src/screens/ReservationsScreen";
import { PlaceDetailScreen } from "./src/screens/PlaceDetailScreen";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [screen, setScreen] = useState<"login" | "register" | "main">("login");
  const [activeTab, setActiveTab] = useState<"home" | "experiences" | "reservations">("home");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  if (screen === "login") {
    return (
      <LoginScreen
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          setScreen("main");
        }}
        onGoToRegister={() => setScreen("register")}
      />
    );
  }

  if (screen === "register") {
    return (
      <RegisterScreen
        onGoToLogin={() => setScreen("login")}
        onRegisterSuccess={(newUser) => {
          setUser(newUser);
          setScreen("main");
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Conteúdo Principal ou Detalhes */}
      <View style={{ flex: 1 }}>
        {selectedPlace ? (
          <PlaceDetailScreen place={selectedPlace} onBack={() => setSelectedPlace(null)} />
        ) : (
          <>
            {activeTab === "home" && (
              <HomeScreen
                user={user}
                onNavigateTab={(tab: any) => setActiveTab(tab)}
                onSelectPlace={(place) => setSelectedPlace(place)}
              />
            )}
            {activeTab === "experiences" && <ExperiencesScreen />}
            {activeTab === "reservations" && <ReservationsScreen />}
          </>
        )}
      </View>

      {/* Barra de Navegação Inferior (Bottom Tab Bar) */}
      {!selectedPlace && (
        <View style={styles.bottomBar}>
          <Pressable style={styles.tabItem} onPress={() => setActiveTab("home")}>
            <Text style={{ fontSize: 20 }}>{activeTab === "home" ? "🏠" : "🏚️"}</Text>
            <Text style={[styles.tabLabel, activeTab === "home" && styles.tabLabelActive]}>Início</Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={() => setActiveTab("experiences")}>
            <Text style={{ fontSize: 20 }}>📷</Text>
            <Text style={[styles.tabLabel, activeTab === "experiences" && styles.tabLabelActive]}>Experiências</Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={() => setActiveTab("reservations")}>
            <Text style={{ fontSize: 20 }}>🧳</Text>
            <Text style={[styles.tabLabel, activeTab === "reservations" && styles.tabLabelActive]}>Reservas</Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={() => setScreen("login")}>
            <Text style={{ fontSize: 20 }}>👤</Text>
            <Text style={styles.tabLabel}>Sair</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  bottomBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    justifyContent: "space-around",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2, fontWeight: "500" },
  tabLabelActive: { color: COLORS.primary, fontWeight: "bold" },
});