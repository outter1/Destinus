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

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`Servidor Destinus rodando com sucesso na porta ${PORT} 🚀`);
  console.log(`Acesse: http://localhost:${PORT}/api/destinos`);
});
