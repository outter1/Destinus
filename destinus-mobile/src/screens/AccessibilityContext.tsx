import React, { createContext, useContext, useState } from "react";
import * as Speech from "expo-speech";

export type AccessibilityProfile =
  | "none"
  | "low_vision"
  | "blind"
  | "libras"
  | "neurodivergent";

export interface AccessibilityTheme {
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  accentColor: string;
  borderColor: string;
  letterSpacing: number;
  lineHeightMultiplier: number;
  hideDecorations: boolean;
  simplifiedLayout: boolean;
}

interface AccessibilityContextType {
  profile: AccessibilityProfile;
  fontScale: number;
  highContrast: boolean;
  reduceMotion: boolean;
  librasEnabled: boolean;
  textToTranslate: string;
  isNeurodivergent: boolean;
  theme: AccessibilityTheme;
  setAccessibilityProfile: (profile: AccessibilityProfile) => void;
  setFontScale: (scale: number) => void;
  setIsNeurodivergent: (value: boolean) => void;
  setLibrasEnabled: (value: boolean) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const standardTheme: AccessibilityTheme = {
  backgroundColor: "#0F172A",
  cardBackgroundColor: "#1E293B",
  textColor: "#FFFFFF",
  secondaryTextColor: "#94A3B8",
  accentColor: "#10B981",
  borderColor: "#334155",
  letterSpacing: 0,
  lineHeightMultiplier: 1.2,
  hideDecorations: false,
  simplifiedLayout: false,
};

const neurodivergentTheme: AccessibilityTheme = {
  backgroundColor: "#1A1D24",
  cardBackgroundColor: "#252932",
  textColor: "#E2E8F0",
  secondaryTextColor: "#CBD5E1",
  accentColor: "#6EE7B7",
  borderColor: "#475569",
  letterSpacing: 1.2,
  lineHeightMultiplier: 1.6,
  hideDecorations: true,
  simplifiedLayout: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<AccessibilityProfile>("none");
  const [fontScale, setFontScale] = useState<number>(1.0);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [librasEnabled, setLibrasEnabledState] = useState<boolean>(false);
  const [textToTranslate, setTextToTranslate] = useState<string>("");
  const [theme, setTheme] = useState<AccessibilityTheme>(standardTheme);

  const setAccessibilityProfile = (selectedProfile: AccessibilityProfile) => {
    setProfile(selectedProfile);

    switch (selectedProfile) {
      case "low_vision":
        setFontScale(1.35);
        setHighContrast(true);
        setReduceMotion(false);
        setLibrasEnabledState(false);
        setTheme(standardTheme);
        Speech.speak("Perfil de baixa visão ativado.", { language: "pt-BR" });
        break;

      case "blind":
        setFontScale(1.2);
        setHighContrast(true);
        setReduceMotion(false);
        setLibrasEnabledState(false);
        setTheme(standardTheme);
        Speech.speak("Perfil para deficiência visual ativado.", { language: "pt-BR" });
        break;

      case "libras":
        setFontScale(1.0);
        setHighContrast(false);
        setReduceMotion(false);
        setLibrasEnabledState(true);
        setTheme(standardTheme);
        Speech.stop();
        break;

      case "neurodivergent":
        setFontScale(1.1);
        setHighContrast(false);
        setReduceMotion(true);
        setLibrasEnabledState(false);
        setTheme(neurodivergentTheme);
        Speech.stop();
        break;

      case "none":
      default:
        setFontScale(1.0);
        setHighContrast(false);
        setReduceMotion(false);
        setLibrasEnabledState(false);
        setTheme(standardTheme);
        Speech.stop();
        break;
    }
  };

  const setIsNeurodivergent = (value: boolean) => {
    setAccessibilityProfile(value ? "neurodivergent" : "none");
  };

  const setLibrasEnabled = (value: boolean) => {
    setAccessibilityProfile(value ? "libras" : "none");
  };

  const speak = (text: string) => {
    if (!text) return;

    if (profile === "blind" || profile === "low_vision") {
      Speech.stop();
      Speech.speak(text, { language: "pt-BR", pitch: 1.0, rate: 0.95 });
    }

    if (profile === "libras") {
      setTextToTranslate(text);
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
  };

  return (
    <AccessibilityContext.Provider
      value={{
        profile,
        fontScale,
        highContrast,
        reduceMotion,
        librasEnabled,
        textToTranslate,
        isNeurodivergent: profile === "neurodivergent",
        theme,
        setAccessibilityProfile,
        setFontScale,
        setIsNeurodivergent,
        setLibrasEnabled,
        speak,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility deve ser usado dentro de AccessibilityProvider");
  }
  return context;
};