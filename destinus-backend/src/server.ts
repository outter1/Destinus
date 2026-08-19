import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas com prefixo /api e rota raiz como fallback
app.use("/api", routes);
app.use("/", routes);

// Usa a porta definida no .env (PORT=...) e cai para 3333 se não houver nada
// configurado, para não quebrar quem já estava rodando sem .env.
const PORT = Number(process.env.PORT) || 3333;

const server = app.listen(PORT, () => {
  console.log(`Servidor Destinus rodando com sucesso na porta ${PORT} 🚀`);
  console.log(`Acesse: http://localhost:${PORT}/api/destinos`);
  if (process.env.GOOGLE_API_KEY || process.env.GOOGLE_PLACES_API_KEY) {
    console.log("✅ Integração com o Google Places API está ATIVA (chave encontrada no .env).");
  } else {
    console.log("⚠️  Nenhuma chave do Google Places encontrada no .env — usando apenas Overpass/db.json.");
  }
});

// Encerramento explícito do servidor quando o terminal/processo recebe um
// sinal para fechar (Ctrl+C, fechar a janela pelo X, encerrar pelo painel
// do VS Code, etc.). Sem isso, em alguns terminais (principalmente no
// Windows) o processo Node podia ficar "pendurado" segurando a porta 3333,
// e era preciso matar o processo manualmente para conseguir rodar
// "npm run dev" de novo.
function shutdown(signal: string) {
  console.log(`\nRecebido ${signal}, encerrando o servidor Destinus...`);
  server.close(() => {
    console.log("Servidor encerrado.");
    process.exit(0);
  });
  // Garantia extra: se algo travar o close() por mais de 3s, força a saída.
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
// Sinal específico do console do Windows (ex: fechar a janela pelo X ou
// Ctrl+Break) — sem isso, no Windows o handler acima nem sempre é chamado.
process.on("SIGBREAK", () => shutdown("SIGBREAK"));