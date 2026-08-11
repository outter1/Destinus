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
import { AccessibilityOnboardingModal } from "./src/screens/AccessibilityOnboardingModal";
import { AccessibilityProvider, useAccessibility } from "./src/screens/AccessibilityContext";
import { LibrasAvatar } from "./src/components/LibrasAvatar";

type ScreenType = "login" | "register" | "main";
type TabType = "home" | "experiences" | "reservations" | "profile";

function NavigationRoot() {
  const [user, setUser] = useState<any>(null);
  const [screen, setScreen] = useState<ScreenType>("login");
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

  // Consumindo theme e isNeurodivergent do contexto
  const { fontScale, speak, theme, isNeurodivergent } = useAccessibility();

  const PRIMARY_COLOR = COLORS?.primary || "#2563EB";
  const ORANGE_COLOR = "#EA580C";
  const YELLOW_COLOR = "#CA8A04";

  const handleTabChange = (tab: TabType, label: string) => {
    setSelectedPlace(null);
    setActiveTab(tab);
    speak(`Aba ${label}`);
  };

  const handleSelectPlace = (place: any) => {
    setSelectedPlace(place);
    setRecentlyViewed((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      if (exists) return prev;
      return [place, ...prev];
    });
  };

  const getActiveTabColor = () => {
    if (isNeurodivergent) return theme.backgroundColor; // Evita luzes vibrantes no topo em modo neurodivergente

    switch (activeTab) {
      case "experiences":
        return ORANGE_COLOR;
      case "reservations":
        return YELLOW_COLOR;
      case "profile":
        return ORANGE_COLOR;
      default:
        return PRIMARY_COLOR;
    }
  };

  const getTabActiveColor = (tab: TabType) => {
    if (isNeurodivergent) return theme.accentColor;
    if (tab === "experiences" || tab === "profile") return ORANGE_COLOR;
    if (tab === "reservations") return YELLOW_COLOR;
    return PRIMARY_COLOR;
  };

  if (screen === "login") {
    return (
      <LoginScreen
        onLoginSuccess={(loggedUser: any) => {
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
      <>
        <RegisterScreen
          onGoToLogin={() => setScreen("login")}
          onRegisterSuccess={(newUser: any) => {
            setUser(newUser);
            setShowAccessibilityModal(true);
          }}
        />
        <AccessibilityOnboardingModal
          visible={showAccessibilityModal}
          onFinish={() => {
            setShowAccessibilityModal(false);
            setScreen("main");
            setActiveTab("home");
          }}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getActiveTabColor() }]}>
      <StatusBar barStyle="light-content" backgroundColor={getActiveTabColor()} />

      <View style={[styles.mainContent, { backgroundColor: theme.backgroundColor }]}>
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
                onNavigateTab={(tab: string) => handleTabChange(tab as TabType, tab)}
                onSelectPlace={handleSelectPlace}
              />
            )}
            {activeTab === "experiences" && (
              <ExperiencesScreen onSelectPlace={handleSelectPlace} />
            )}
            {activeTab === "reservations" && <ReservationsScreen />}
            {activeTab === "profile" && (
              <ProfileScreen
                user={user}
                recentlyViewed={recentlyViewed}
                onSelectPlace={handleSelectPlace}
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

      {!selectedPlace && (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: theme.cardBackgroundColor,
              borderTopColor: theme.borderColor,
            },
          ]}
        >
          <Pressable style={styles.tabItem} onPress={() => handleTabChange("home", "Início")}>
            <Text style={{ fontSize: 20 * fontScale }}>🏠</Text>
            <Text
              style={[
                styles.tabLabel,
                {
                  fontSize: 11 * fontScale,
                  letterSpacing: theme.letterSpacing,
                  color: activeTab === "home" ? getTabActiveColor("home") : theme.secondaryTextColor,
                },
                activeTab === "home" && { fontWeight: "bold" },
              ]}
            >
              Início
            </Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={() => handleTabChange("experiences", "Experiências")}>
            <Text style={{ fontSize: 20 * fontScale }}>📷</Text>
            <Text
              style={[
                styles.tabLabel,
                {
                  fontSize: 11 * fontScale,
                  letterSpacing: theme.letterSpacing,
                  color: activeTab === "experiences" ? getTabActiveColor("experiences") : theme.secondaryTextColor,
                },
                activeTab === "experiences" && { fontWeight: "bold" },
              ]}
            >
              Experiências
            </Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={() => handleTabChange("reservations", "Reservas")}>
            <Text style={{ fontSize: 20 * fontScale }}>🧳</Text>
            <Text
              style={[
                styles.tabLabel,
                {
                  fontSize: 11 * fontScale,
                  letterSpacing: theme.letterSpacing,
                  color: activeTab === "reservations" ? getTabActiveColor("reservations") : theme.secondaryTextColor,
                },
                activeTab === "reservations" && { fontWeight: "bold" },
              ]}
            >
              Reservas
            </Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={() => handleTabChange("profile", "Perfil")}>
            <Text style={{ fontSize: 20 * fontScale }}>👤</Text>
            <Text
              style={[
                styles.tabLabel,
                {
                  fontSize: 11 * fontScale,
                  letterSpacing: theme.letterSpacing,
                  color: activeTab === "profile" ? getTabActiveColor("profile") : theme.secondaryTextColor,
                },
                activeTab === "profile" && { fontWeight: "bold" },
              ]}
            >
              Perfil
            </Text>
          </Pressable>
        </View>
      )}

      {/* Intérprete Virtual de Libras flutuante */}
      <LibrasAvatar />

      <AccessibilityOnboardingModal
        visible={showAccessibilityModal}
        onFinish={() => {
          setShowAccessibilityModal(false);
          setScreen("main");
          setActiveTab("home");
        }}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <NavigationRoot />
    </AccessibilityProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1 },
  bottomBar: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    justifyContent: "space-around",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabItem: { alignItems: "center" },
  tabLabel: { marginTop: 2, fontWeight: "500" },
});