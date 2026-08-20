import React, { createContext, useContext, useRef, useState } from "react";
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
  voiceCommandEnabled: boolean;
  textToTranslate: string;
  isNeurodivergent: boolean;
  theme: AccessibilityTheme;
  setAccessibilityProfile: (profile: AccessibilityProfile) => void;
  setFontScale: (scale: number) => void;
  setIsNeurodivergent: (value: boolean) => void;
  setLibrasEnabled: (value: boolean) => void;
  setVoiceCommandEnabled: (value: boolean) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

// Tema Claro Padrão (utilizado por "none", "low_vision", "blind" e "libras")
const standardTheme: AccessibilityTheme = {
  backgroundColor: "#F4F7FC",
  cardBackgroundColor: "#FFFFFF",
  textColor: "#0F172A",
  secondaryTextColor: "#64748B",
  accentColor: "#10B981",
  borderColor: "#E2E8F0",
  letterSpacing: 0,
  lineHeightMultiplier: 1.2,
  hideDecorations: false,
  simplifiedLayout: false,
};

// Tema Escuro / Suave (exclusivo para "neurodivergent")
const neurodivergentTheme: AccessibilityTheme = {
  backgroundColor: "#0F172A",
  cardBackgroundColor: "#1E293B",
  textColor: "#F8FAFC",
  secondaryTextColor: "#94A3B8",
  accentColor: "#6EE7B7",
  borderColor: "#334155",
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
  // Libras (avatar VLibras) e comando de voz (leitura por toque/TTS) agora
  // são independentes um do outro — cada um tem seu próprio switch na tela
  // de Perfil e pode ser ligado/desligado sem depender do outro.
  const [librasEnabled, setLibrasEnabledState] = useState<boolean>(false);
  const [voiceCommandEnabled, setVoiceCommandEnabledState] = useState<boolean>(false);
  const [textToTranslate, setTextToTranslate] = useState<string>("");
  const [theme, setTheme] = useState<AccessibilityTheme>(standardTheme);
  // Controla se já avisamos o usuário, na primeira vez, que o comando de voz
  // está ativo e como usá-lo (toque no texto para ouvir).
  const hasAnnouncedVoiceCommand = useRef(false);

  const setAccessibilityProfile = (selectedProfile: AccessibilityProfile) => {
    setProfile(selectedProfile);

    switch (selectedProfile) {
      case "low_vision":
        setFontScale(1.35);
        setHighContrast(true);
        setReduceMotion(false);
        setTheme(standardTheme);
        // O perfil de baixa visão liga o comando de voz por padrão, mas o
        // usuário pode desligar depois em Perfil sem perder o resto do perfil.
        setVoiceCommandEnabledState(true);
        Speech.speak("Perfil de baixa visão ativado.", { language: "pt-BR" });
        break;

      case "blind":
        setFontScale(1.2);
        setHighContrast(true);
        setReduceMotion(false);
        setTheme(standardTheme);
        setVoiceCommandEnabledState(true);
        Speech.speak("Perfil para deficiência visual ativado.", { language: "pt-BR" });
        break;

      case "libras":
        setFontScale(1.0);
        setHighContrast(false);
        setReduceMotion(false);
        setTheme(standardTheme);
        setLibrasEnabledState(true);
        Speech.stop();
        break;

      case "neurodivergent":
        setFontScale(1.1);
        setHighContrast(false);
        setReduceMotion(true);
        setTheme(neurodivergentTheme);
        Speech.stop();
        break;

      case "none":
      default:
        setFontScale(1.0);
        setHighContrast(false);
        setReduceMotion(false);
        setTheme(standardTheme);
        Speech.stop();
        break;
    }
  };

  const setIsNeurodivergent = (value: boolean) => {
    setAccessibilityProfile(value ? "neurodivergent" : "none");
  };

  // Liga/desliga só o avatar de Libras, sem mexer no comando de voz.
  const setLibrasEnabled = (value: boolean) => {
    setLibrasEnabledState(value);
  };

  // Liga/desliga só o comando de voz (leitura por toque), sem mexer em Libras.
  // Na primeira ativação, avisa o usuário como o recurso funciona.
  const setVoiceCommandEnabled = (value: boolean) => {
    setVoiceCommandEnabledState(value);
    if (value && !hasAnnouncedVoiceCommand.current) {
      hasAnnouncedVoiceCommand.current = true;
      Speech.speak(
        "Comando de voz ativado. Toque em qualquer texto na tela para ouvi-lo.",
        { language: "pt-BR" }
      );
    }
  };

  const speak = (text: string) => {
    if (!text) return;

    if (voiceCommandEnabled) {
      Speech.stop();
      Speech.speak(text, { language: "pt-BR", pitch: 1.0, rate: 0.95 });
    }

    if (librasEnabled) {
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
        voiceCommandEnabled,
        textToTranslate,
        isNeurodivergent: profile === "neurodivergent",
        theme,
        setAccessibilityProfile,
        setFontScale,
        setIsNeurodivergent,
        setLibrasEnabled,
        setVoiceCommandEnabled,
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