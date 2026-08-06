import express from "express";
import cors from "cors";
import { db } from "./config/db";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

// Carrega todas as rotas do projeto
app.use("/api", routes);

app.get("/health", (_req, res) => {
  const data = db.read();
  return res.json({ status: "ok", message: "Backend Destinus 100% ativo!", data });
});

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Destinus rodando em http://localhost:${PORT}`);
});