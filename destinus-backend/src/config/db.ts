import * as fs from "fs";
import * as path from "path";

const dbPath = path.resolve(__dirname, "../../db.json");

// Dados iniciais para o teste
const defaultData = {
  users: [],
  categories: [
    { id: "1", name: "Restaurantes" },
    { id: "2", name: "Hotéis" },
    { id: "3", name: "Pontos Turísticos" }
  ],
  places: [
    {
      id: "101",
      categoryId: "1",
      name: "Café Acessível Exemplo",
      address: "Rua das Flores, 123",
      lat: -22.47,
      lng: -44.45,
      accessibilityFeatures: ["Rampa de acesso", "Banheiro adaptado", "Cardápio em Braille"],
      ratingAvg: 4.8
    }
  ],
  reviews: []
};

// Se o db.json não existir na raiz do backend, cria um automaticamente
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
}

export const db = {
  read: () => JSON.parse(fs.readFileSync(dbPath, "utf-8")),
  write: (data: any) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
};