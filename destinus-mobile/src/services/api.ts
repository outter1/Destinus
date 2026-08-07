import { Platform } from "react-native";

const MEU_IP_LOCAL = "192.168.0.168w";
const PORTA = "3333"; // Altere para 3000 se o servidor estiver rodando na porta padrão do React Native

export const API_URL =
  Platform.OS === "web"
    ? `http://localhost:${PORTA}/api`
    : `http://${MEU_IP_LOCAL}:${PORTA}/api`;