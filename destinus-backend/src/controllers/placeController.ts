import { Request, Response } from "express";

export const getDestinosBaixada = (req: Request, res: Response) => {
  const locaisBaixada = [
    {
      id: "1",
      name: "Parque Natural Municipal da Taquara",
      city: "Duque de Caxias - RJ",
      category: "Trilhas & Natureza",
      imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      accessible: true,
      latitude: -22.6225,
      longitude: -43.2351,
    },
    {
      id: "2",
      name: "Museu Vivo do São Bento",
      city: "Duque de Caxias - RJ",
      category: "Cultura & História",
      imageUrl: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      accessible: true,
      latitude: -22.7381,
      longitude: -43.3089,
    },
    {
      id: "3",
      name: "Reserva Biológica do Tinguá",
      city: "Nova Iguaçu / Caxias - RJ",
      category: "Ecoturismo",
      imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      accessible: false,
      latitude: -22.5833,
      longitude: -43.4333,
    },
  ];

  return res.json(locaisBaixada);
};