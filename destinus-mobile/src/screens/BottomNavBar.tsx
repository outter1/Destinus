import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAccessibility } from "./AccessibilityContext";

interface BottomNavBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export function BottomNavBar({ activeTab, onSelectTab }: BottomNavBarProps) {
  const { fontScale, getColors } = useAccessibility();
  const colors = getColors();

  const tabs = [
    { id: "home", label: "Início", icon: "🏠" },
    { id: "map", label: "Explorar", icon: "🗺️" },
    { id: "experiences", label: "Passeios", icon: "📷" },
    { id: "reservations", label: "Reservas", icon: "🧳" },
    { id: "profile", label: "Perfil", icon: "👤" },
  ];

  return (
    <View style={[styles.navContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Aba ${tab.label}`}
            style={[styles.tabButton, isActive && { backgroundColor: colors.primary + "20" }]}
            onPress={() => onSelectTab(tab.id)}
          >
            <Text style={{ fontSize: 20 * fontScale }}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, { color: isActive ? colors.primary : colors.text, fontSize: 11 * fontScale }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 8, borderTopWidth: 1, elevation: 8 },
  tabButton: { alignItems: "center", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
  tabLabel: { fontWeight: "bold", marginTop: 2 },
});