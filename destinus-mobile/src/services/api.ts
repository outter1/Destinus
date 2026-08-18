// Reexporta a configuração única da API (src/config/api.ts).
// Isso evita ter IPs/portas duplicados e divergentes em vários arquivos,
// que era a causa de vários botões parecerem "não funcionar" (a chamada
// de rede ia para um endereço errado e silenciosamente falhava).
export { API_URL } from "../config/api";
