import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView, StatusBar } from "react-native";
import { COLORS } from "./src/constants/theme";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ExperiencesScreen } from "./src/screens/ExperiencesScreen";
import { ReservationsScreen } from "./src/screens/ReservationsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { PlaceDetailScreen } from "./src/screens/PlaceDetailScreen";

type ScreenType = "login" | "register" | "main";
type TabType = "home" | "experiences" | "reservations" | "profile";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [screen, setScreen] = useState<ScreenType>("login");
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const PRIMARY_COLOR = COLORS?.primary || "#2563EB";

  const handleTabChange = (tab: TabType) => {
    setSelectedPlace(null);
    setActiveTab(tab);
  };

  if (screen === "login") {
    return (
      <LoginScreen
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          setScreen("main");
          setActiveTab("home");
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
          setActiveTab("home");
        }}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: PRIMARY_COLOR }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />

      {/* Conteúdo Principal */}
      <View style={styles.mainContent}>
        {selectedPlace ? (
          <PlaceDetailScreen
            place={selectedPlace}
            onBack={() => setSelectedPlace(null)}
          />
        ) : (
          <>
            {activeTab === "home" && (
              <HomeScreen
                user={user}
                onNavigateTab={(tab) => handleTabChange(tab as TabType)}
                onSelectPlace={(place) => setSelectedPlace(place)}
              />
            )}
            {activeTab === "experiences" && <ExperiencesScreen />}
            {activeTab === "reservations" && <ReservationsScreen />}
            {activeTab === "profile" && (
              <ProfileScreen
                user={user}
                onUpdateUser={(updatedUser) => setUser(updatedUser)}
                onLogout={() => {
                  setUser(null);
                  setSelectedPlace(null);
                  setScreen("login");
                }}
              />
            )}
          </>
        )}
      </View>

      {/* Barra de Navegação Inferior */}
      {!selectedPlace && (
        <View style={styles.bottomBar}>
          <Pressable style={styles.tabItem} onPress={() => handleTabChange("home")}>
            <Text style={{ fontSize: 20 }}>🏠</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === "home" && { color: PRIMARY_COLOR, fontWeight: "bold" },
              ]}
            >
              Início
            </Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={() => handleTabChange("experiences")}>
            <Text style={{ fontSize: 20 }}>📷</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === "experiences" && { color: PRIMARY_COLOR, fontWeight: "bold" },
              ]}
            >
              Experiências
            </Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={() => handleTabChange("reservations")}>
            <Text style={{ fontSize: 20 }}>🧳</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === "reservations" && { color: PRIMARY_COLOR, fontWeight: "bold" },
              ]}
            >
              Reservas
            </Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={() => handleTabChange("profile")}>
            <Text style={{ fontSize: 20 }}>👤</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === "profile" && { color: PRIMARY_COLOR, fontWeight: "bold" },
              ]}
            >
              Perfil
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1, backgroundColor: "#F8FAFC" },
  bottomBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    justifyContent: "space-around",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 11, color: "#64748B", marginTop: 2, fontWeight: "500" },
});