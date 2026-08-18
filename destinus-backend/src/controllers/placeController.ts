import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getDestinosBaixada = (req: Request, res: Response) => {
  try {
    const { necessidade, category, query } = req.query;

    // Carrega o arquivo db.json da raiz do backend
    const dbPath = path.resolve(__dirname, "../../db.json");
    const rawData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(rawData);

    let places = db.places || [];

    // 1. Filtro por termo de busca (nome ou cidade)
    if (query && typeof query === "string") {
      const searchTerm = query.toLowerCase();
      places = places.filter(
        (p: any) =>
          p.name.toLowerCase().includes(searchTerm) ||
          (p.city && p.city.toLowerCase().includes(searchTerm))
      );
    }

    // 2. Filtro por Categoria
    if (category && typeof category === "string" && category !== "Todos") {
      places = places.filter((p: any) => p.category === category);
    }

    // 3. Filtro por Necessidade de Acessibilidade
    if (necessidade && typeof necessidade === "string") {
      places = places.filter((p: any) => {
        const acc = p.accessibilityDetails;
        if (!acc) return false;

        switch (necessidade) {
          case "cadeirante":
            return acc.cadeirante?.rampa || acc.cadeirante?.elevador || acc.adaptedRestroom;
          case "visual":
            return acc.visual?.pisoTatil || acc.visual?.audioguia || acc.visual?.textoBraille;
          case "auditiva":
            return acc.auditiva?.interpreteLibras || acc.auditiva?.legendaEmVideos;
          case "neurodivergente":
            return acc.neurodivergente?.espacoSilencioso || acc.neurodivergente?.horarioSensorialSuave;
          default:
            return true;
        }
      });
    }

    return res.json(places);
  } catch (error) {
    console.error("Erro ao buscar locais no db.json:", error);
    return res.status(500).json({ error: "Erro interno ao buscar locais." });
  }
};