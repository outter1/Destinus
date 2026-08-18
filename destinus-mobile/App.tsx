import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView, StatusBar } from "react-native";
import axios from "axios";
import { COLORS } from "./src/constants/theme";
import { API_URL } from "./src/config/api";
import { notify, confirmAsync } from "./src/utils/alert";
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

// Sem isso, quando o servidor não responde (ex: IP errado em src/config/api.ts
// ou servidor caído), o axios ficava esperando indefinidamente e NENHUMA
// mensagem de sucesso ou erro aparecia na tela — parecia que o botão não
// fazia nada. Com o timeout, o erro aparece em no máximo 10s.
axios.defaults.timeout = 10000;

type ScreenType = "login" | "register" | "main";
type TabType = "home" | "experiences" | "reservations" | "profile";

function NavigationRoot() {
  const [user, setUser] = useState<any>(null);
  const [screen, setScreen] = useState<ScreenType>("login");
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [reservationsRefreshKey, setReservationsRefreshKey] = useState(0);

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

  const handleReservePlace = async (place: any) => {
    try {
      const response = await axios.post(`${API_URL}/reservas`, {
        userId: user?.id,
        placeId: place.id,
        title: place.name,
        category: place.category,
        location: place.address || place.city,
        imageUrl: place.imageUrl,
        description: place.description,
        guests: 1,
      });

      const codigoReserva = response.data?.reservation?.code || "—";
      speak(`Reserva confirmada para ${place.name}`);
      // Força a tela de Reservas a buscar a lista atualizada da API na
      // próxima vez que for exibida.
      setReservationsRefreshKey((k) => k + 1);

      const verReservas = await confirmAsync(
        "Reserva Confirmada! 🎉",
        `Sua reserva para "${place.name}" foi realizada com sucesso.\n\nCódigo: ${codigoReserva}\n\nVer suas reservas agora?`
      );
      if (verReservas) {
        setSelectedPlace(null);
        setActiveTab("reservations");
      }
    } catch (error) {
      notify(
        "Erro ao Reservar",
        "Não foi possível concluir a reserva agora. Verifique sua conexão com o servidor (veja src/config/api.ts) e tente novamente."
      );
    }
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
            onReserve={handleReservePlace}
          />
        ) : (
          <>
            {activeTab === "home" && (
              <HomeScreen
                user={user}
                onNavigateTab={(tab: string) => handleTabChange(tab as TabType, tab)}
                onSelectPlace={handleSelectPlace}
                onReservationMade={() => setReservationsRefreshKey((k) => k + 1)}
              />
            )}
            {activeTab === "experiences" && (
              <ExperiencesScreen
                user={user}
                onSelectPlace={handleSelectPlace}
                onReservationMade={() => setReservationsRefreshKey((k) => k + 1)}
              />
            )}
            {activeTab === "reservations" && (
              <ReservationsScreen user={user} refreshKey={reservationsRefreshKey} />
            )}
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