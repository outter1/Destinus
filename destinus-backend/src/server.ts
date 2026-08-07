import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

// Registra todas as rotas com o prefixo /api
app.use("/api", routes);

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});