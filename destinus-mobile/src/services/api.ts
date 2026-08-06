import { Platform } from "react-native";

// IP da Rede Local
const MEU_IP_LOCAL = "192.168.19.155";

export const API_URL =
  Platform.OS === "web"
    ? "http://localhost:3333/api"
    : `http://${MEU_IP_LOCAL}:3333/api`;