import React, { createContext, useContext, useState } from "react";

interface AccessibilityState {
  highContrast: boolean;
  fontScale: number;
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  reduceMotion: boolean;
  userNeeds: {
    wheelchair: boolean;
    blind: boolean;
    lowVision: boolean;
    epilepsy: boolean;
  };
}

interface AccessibilityContextType extends AccessibilityState {
  setAccessibility: (settings: Partial<AccessibilityState>) => void;
  getColors: () => any;
}

const AccessibilityContext = createContext<AccessibilityContextType>({} as any);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilityState>({
    highContrast: false,
    fontScale: 1,
    colorBlindMode: "none",
    reduceMotion: false,
    userNeeds: { wheelchair: false, blind: false, lowVision: false, epilepsy: false }
  });

  function setAccessibility(newSettings: Partial<AccessibilityState>) {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }

  function getColors() {
    if (settings.highContrast) {
      return {
        bg: "#000000",
        cardBg: "#121212",
        text: "#FFFFFF",
        primary: "#FFFF00",
        accent: "#00FFFF",
        border: "#FFFFFF"
      };
    }

    if (settings.colorBlindMode !== "none") {
      return {
        bg: "#F4F7FA",
        cardBg: "#FFFFFF",
        text: "#1A202C",
        primary: "#0055B8",
        accent: "#D97706",
        border: "#CBD5E1"
      };
    }

    return {
      bg: "#F4F7FA",
      cardBg: "#FFFFFF",
      text: "#1A202C",
      primary: "#0077EE",
      accent: "#FF9900",
      border: "#E2E8F0"
    };
  }

  return (
    <AccessibilityContext.Provider value={{ ...settings, setAccessibility, getColors }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => useContext(AccessibilityContext);