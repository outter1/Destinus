import { Platform } from "react-native";

// 10.0.2.2 para Emulador Android | localhost para iOS/Web
// Se usar celular físico no Expo Go, troque 'localhost' pelo IP da sua máquina (ex: '192.168.1.10')
export const API_URL = `http://${Platform.OS === "android" ? "10.0.2.2" : "localhost"}:3000`;