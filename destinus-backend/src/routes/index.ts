import { Router } from "express";
import axios from "axios";
import { db } from "../config/db";

const routes = Router();

// Locais padrão de Duque de Caxias e Baixada Fluminense com acessibilidade detalhada
const defaultPlaces = [
  {
    id: "caxias_1",
    name: "Parque Natural Municipal da Taquara",
    city: "Duque de Caxias - RJ",
    category: "Trilhas & Natureza",
    address: "Estrada da Taquara, s/n - Taquara, Duque de Caxias - RJ",
    latitude: -22.6225,
    longitude: -43.2351,
    lat: -22.6225,
    lng: -43.2351,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-22.6225,-43.2351",
    accessibilityDetails: {
      wheelchair: "Rampa e acesso adaptado disponível",
      blind: "Piso tátil e audiodescrição",
      tactilePaving: true,
      adaptedRestroom: true,
    },
  },
  {
    id: "caxias_2",
    name: "Museu Vivo do São Bento",
    city: "Duque de Caxias - RJ",
    category: "Cultura & História",
    address: "Rua Professor Sérgio Henrique, s/n - São Bento, Duque de Caxias - RJ",
    latitude: -22.7381,
    longitude: -43.3089,
    lat: -22.7381,
    lng: -43.3089,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=600&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-22.7381,-43.3089",
    accessibilityDetails: {
      wheelchair: "Entrada plana e banheiro adaptado",
      blind: "Guia tátil e monitores",
      tactilePaving: true,
      adaptedRestroom: true,
    },
  },
  {
    id: "caxias_3",
    name: "Reserva Biológica do Tinguá",
    city: "Nova Iguaçu / Caxias - RJ",
    category: "Trilhas & Natureza",
    address: "Estrada do Tinguá, Nova Iguaçu - RJ",
    latitude: -22.5833,
    longitude: -43.4333,
    lat: -22.5833,
    lng: -43.4333,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-22.5833,-43.4333",
    accessibilityDetails: {
      wheelchair: "Acesso parcial às trilhas principais",
      blind: "Acompanhamento guiado disponível",
      tactilePaving: false,
      adaptedRestroom: false,
    },
  },
  {
    id: "caxias_4",
    name: "Feira e Polo Gastronômico de Caxias",
    city: "Duque de Caxias - RJ",
    category: "Gastronomia",
    address: "Centro, Duque de Caxias - RJ",
    latitude: -22.7856,
    longitude: -43.3117,
    lat: -22.7856,
    lng: -43.3117,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-22.7856,-43.3117",
    accessibilityDetails: {
      wheelchair: "Calçadas rebaixadas na região central",
      blind: "Sinalização sonora de travessia",
      tactilePaving: true,
      adaptedRestroom: true,
    },
  },
  {
    id: "caxias_5",
    name: "Igreja Matriz de Santo Antônio",
    city: "Duque de Caxias - RJ",
    category: "Cultura & História",
    address: "Av. Gov. Leonel de Moura Brizola - Centro, Duque de Caxias - RJ",
    latitude: -22.7881,
    longitude: -43.3082,
    lat: -22.7881,
    lng: -43.3082,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1548625361-182283e0ef88?auto=format&fit=crop&w=600&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-22.7881,-43.3082",
    accessibilityDetails: {
      wheelchair: "Rampa de acesso lateral e nave ampla",
      blind: "Audiodescrição e sistema de som adaptado",
      tactilePaving: true,
      adaptedRestroom: true,
    },
  },
];

// Notificações padrão para experiência inicial do usuário
const defaultNotifications = [
  {
    id: "notif_1",
    title: "📍 Recomendação do Dia",
    message: "Que tal visitar a Igreja Matriz de Santo Antônio no Centro de Caxias hoje?",
    time: "Há 10 min",
    read: false,
    type: "recommendation",
  },
  {
    id: "notif_2",
    title: "♿ Dica de Acessibilidade",
    message: "O Parque Natural da Taquara atualizou suas rampas de acesso às trilhas baixas.",
    time: "Há 2 horas",
    read: false,
    type: "accessibility",
  },
  {
    id: "notif_3",
    title: "🎉 Bem-vindo ao Destinus",
    message: "Explore a Baixada Fluminense com rotas acessíveis e personalizadas.",
    time: "Ontem",
    read: true,
    type: "system",
  },
];

// 1. Busca de Locais e Destinos (Banco Local + Mapeamento de Comércios da Baixada via Overpass)
routes.get("/locais", async (req, res) => {
  const { query, category } = req.query;
  const data = db.read();

  // Inicializa o db.json com os locais padrão se estiver vazio
  if (!data.places || data.places.length === 0) {
    data.places = defaultPlaces;
    db.write(data);
  }

  let dbPlaces = data.places || [];
  let dynamicPlaces: any[] = [];

  // Busca comércios e pontos da Baixada via Overpass API
  try {
    const overpassQuery = `
      [out:json][timeout:15];
      area["name"="Duque de Caxias"]->.searchArea;
      (
        node["tourism"](area.searchArea);
        node["amenity"="restaurant"](area.searchArea);
        node["amenity"="cafe"](area.searchArea);
        node["amenity"="bar"](area.searchArea);
        node["leisure"](area.searchArea);
        node["shop"](area.searchArea);
      );
      out body 50;
    `;

    const osmResponse = await axios.post(
      "https://overpass-api.de/api/interpreter",
      `data=${encodeURIComponent(overpassQuery)}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (osmResponse.data && osmResponse.data.elements) {
      dynamicPlaces = osmResponse.data.elements
        .filter((item: any) => item.tags && item.tags.name)
        .map((item: any) => {
          const lat = item.lat;
          const lng = item.lon;
          const tags = item.tags;

          let mappedCategory = "Comércio Local";
          if (tags.amenity === "restaurant" || tags.amenity === "cafe" || tags.amenity === "bar") {
            mappedCategory = "Gastronomia";
          } else if (tags.tourism || tags.historic) {
            mappedCategory = "Cultura & História";
          } else if (tags.leisure || tags.sport) {
            mappedCategory = "Trilhas & Natureza";
          }

          return {
            id: `osm_${item.id}`,
            name: tags.name,
            city: tags["addr:city"] || "Duque de Caxias - RJ",
            category: mappedCategory,
            address: tags["addr:street"]
              ? `${tags["addr:street"]}, ${tags["addr:housenumber"] || "s/n"} - ${tags["addr:suburb"] || "Duque de Caxias"}`
              : "Duque de Caxias - RJ",
            latitude: lat,
            longitude: lng,
            lat,
            lng,
            rating: 4.5,
            imageUrl:
              mappedCategory === "Gastronomia"
                ? "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
                : mappedCategory === "Trilhas & Natureza"
                ? "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600"
                : "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600",
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            accessibilityDetails: {
              wheelchair: tags.wheelchair === "yes" ? "Acesso total para cadeirante" : "Entrada no nível da rua",
              blind: "Sinalização por geolocalização",
              tactilePaving: tags.wheelchair === "yes",
              adaptedRestroom: false,
            },
          };
        });
    }
  } catch (err) {
    console.log("Erro ao carregar locais via Overpass API:", err);
  }

  // Mescla banco local + comércios dinâmicos sem duplicar
  const existingNames = new Set(dbPlaces.map((p: any) => p.name?.toLowerCase()));
  const uniqueDynamic = dynamicPlaces.filter((p: any) => !existingNames.has(p.name?.toLowerCase()));
  let allPlaces = [...dbPlaces, ...uniqueDynamic];

  // Aplica filtro por Categoria
  if (category && category !== "Todos" && category !== "Roteiros") {
    const cat = String(category).toLowerCase();
    allPlaces = allPlaces.filter((p: any) => {
      const pCategory = (p.category || "").toLowerCase();
      return pCategory.includes(cat) || cat.includes(pCategory);
    });
  }

  // Aplica filtro por busca textual
  if (query) {
    const q = String(query).toLowerCase();
    allPlaces = allPlaces.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q)
    );
  }

  return res.json(allPlaces);
});

// 2. Notificações e Alertas
routes.get("/notificacoes", (req, res) => {
  const data = db.read();
  if (!data.notifications || data.notifications.length === 0) {
    data.notifications = defaultNotifications;
    db.write(data);
  }
  return res.json(data.notifications);
});

routes.put("/notificacoes/ler-todas", (req, res) => {
  const data = db.read();
  if (data.notifications) {
    data.notifications = data.notifications.map((n: any) => ({ ...n, read: true }));
    db.write(data);
  }
  return res.json({ message: "Todas as notificações foram marcadas como lidas." });
});

// 3. Experiências e Passeios
routes.get("/experiencias", (req, res) => {
  const { category } = req.query;
  const data = db.read();
  let exps = data.experiences || [];

  if (category && category !== "Todos") {
    exps = exps.filter(
      (e: any) => e.category?.toLowerCase() === String(category).toLowerCase()
    );
  }

  return res.json(exps);
});

// 4. Minhas Reservas
routes.get("/reservas", (req, res) => {
  const data = db.read();
  return res.json(data.reservations || []);
});

// 5. Criar Nova Reserva e Notificar
routes.post("/reservas", (req, res) => {
  const { title, type, date, detail, merchantUrl } = req.body;
  const data = db.read();

  const newReservation = {
    id: `res_${Date.now()}`,
    type: type || "Passeio",
    title,
    date: date || "A confirmar",
    detail: detail || "Reserva enviada ao parceiro",
    status: "Confirmado",
    tab: "Proximas",
    icon: type === "Voo" ? "✈️" : type === "Hotel" ? "🏨" : "📷",
    merchantUrl,
  };

  data.reservations = data.reservations || [];
  data.reservations.unshift(newReservation);

  // Gera notificação automática ao criar reserva
  data.notifications = data.notifications || defaultNotifications;
  data.notifications.unshift({
    id: `notif_${Date.now()}`,
    title: "📅 Reserva Solicitada",
    message: `Sua solicitação para "${title}" foi enviada com sucesso!`,
    time: "Agora",
    read: false,
    type: "reservation",
  });

  db.write(data);

  return res.status(201).json({
    message: "Reserva realizada com sucesso!",
    reservation: newReservation,
  });
});

// 6. Autenticação e Perfil de Usuário
routes.post("/cadastro", (req, res) => {
  const { name, email, password, needs, disabilities, preferences } = req.body;
  const data = db.read();

  const newUser = {
    id: String(Date.now()),
    name,
    email,
    password,
    photoUrl: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    needs: needs || {
      wheelchair: false,
      visual: false,
      hearing: false,
      neurodivergent: false,
    },
    disabilities: disabilities || {
      wheelchair: false,
      blind: false,
      lowVision: false,
      deaf: false,
      autism: false,
      epilepsy: false,
    },
    preferences: preferences || {
      trails: false,
      walks: false,
      beaches: false,
      culture: false,
      gastronomy: false,
    },
  };

  data.users = data.users || [];
  data.users.push(newUser);
  db.write(data);

  return res
    .status(201)
    .json({ message: "Usuário cadastrado com sucesso!", user: newUser });
});

routes.post("/login", (req, res) => {
  const { email, password } = req.body;
  const data = db.read();

  const allUsers = [...(data.users || []), ...(data.usuarios || [])];
  const user = allUsers.find(
    (u: any) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "E-mail ou senha inválidos" });
  }

  return res.json({ message: "Login realizado com sucesso!", user });
});

// 7. Atualizar Foto de Perfil
routes.put("/usuarios/:id/foto", (req, res) => {
  const { id } = req.params;
  const { photoUrl } = req.body;
  const data = db.read();

  let user = (data.users || []).find((u: any) => String(u.id) === String(id));
  if (!user) {
    user = (data.usuarios || []).find((u: any) => String(u.id) === String(id));
  }

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  user.photoUrl = photoUrl;
  db.write(data);

  return res.json({ message: "Foto atualizada com sucesso!", photoUrl: user.photoUrl, user });
});

export default routes;