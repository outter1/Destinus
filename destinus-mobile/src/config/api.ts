import { Platform } from "react-native";

// ⚠️ CONFIGURAÇÃO ÚNICA DA API — todo o app importa o valor daqui.
//
// O backend (destinus-backend) roda na porta 3333 (veja src/server.ts) e
// expõe as rotas tanto em "/api/..." quanto em "/..." na raiz.
//
// - Emulador Android            -> usa 10.0.2.2 (alias do localhost da máquina host)
// - Simulador iOS / Web         -> usa localhost
// - Celular físico no Expo Go   -> troque LOCAL_NETWORK_IP abaixo pelo IP da SUA máquina
//   na rede local (ex: 192.168.0.15). Descubra com "ipconfig" (Windows) ou
//   "ifconfig / ip a" (Mac/Linux). O celular e o computador precisam estar
//   na MESMA rede Wi-Fi.
const LOCAL_NETWORK_IP = "192.168.0.168"; // <-- troque pelo IP da sua máquina
const PORT = 3000; // precisa bater com a PORT definida no .env do backend

const getHost = () => {
  if (Platform.OS === "android") return "10.0.2.2";
  if (Platform.OS === "web") return "localhost";
  return LOCAL_NETWORK_IP;
};

export const API_URL = `http://${getHost()}:${PORT}/api`;