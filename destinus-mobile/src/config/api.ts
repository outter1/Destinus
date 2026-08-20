// ⚠️ CONFIGURAÇÃO ÚNICA DA API — todo o app importa o valor daqui.
//
// Agora que o backend (destinus-backend) está publicado na Vercel, o app
// aponta direto para essa URL fixa em vez de localhost/IP da rede local.
// Isso funciona igual no emulador, no celular físico e na web — não
// depende mais de estar na mesma rede Wi-Fi do computador.
export const API_URL = "https://destinuslegacy.vercel.app/api";
