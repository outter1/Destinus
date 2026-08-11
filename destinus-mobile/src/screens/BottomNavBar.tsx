import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

interface BottomNavBarProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export function BottomNavBar({ activeTab, onTabPress }: BottomNavBarProps) {
  const tabs = [
    { id: "home", label: "Início", icon: "🏠" },
    { id: "experiences", label: "Experiências", icon: "⭐" },
    { id: "reservations", label: "Reservas", icon: "📅" },
    { id: "add", label: "Adicionar", icon: "➕" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onTabPress(tab.id)}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: { alignItems: "center", justifyContent: "center", flex: 1 },
  icon: { fontSize: 18 },
  label: { fontSize: 12, color: "#64748B", marginTop: 2 },
  activeLabel: { color: "#2563EB", fontWeight: "bold" },
});