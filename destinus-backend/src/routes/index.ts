import { Router, Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";

const routes = Router();

// Leitura segura do db.json
const getDbData = () => {
  try {
    const dbPath = path.resolve(__dirname, "../../db.json");
    if (!fs.existsSync(dbPath)) return { places: [], notifications: [], reservations: [], users: [] };
    const rawData = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(rawData);
  } catch {
    return { places: [], notifications: [], reservations: [], users: [] };
  }
};

// Gravação segura no db.json
const saveDbData = (data: any) => {
  try {
    const dbPath = path.resolve(__dirname, "../../db.json");
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar db.json:", err);
  }
};

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
  // Restaurantes fixos (não dependem da API do Google/Overpass estar disponível)
  {
    id: "caxias_rest_1",
    name: "Restaurante Sabor da Baixada",
    city: "Duque de Caxias - RJ",
    category: "Gastronomia",
    address: "Rua 25 de Agosto, 210 - Centro, Duque de Caxias - RJ",
    latitude: -22.7867,
    longitude: -43.3105,
    lat: -22.7867,
    lng: -43.3105,
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-22.7867,-43.3105",
    description: "Culinária regional self-service, especializado em comida caseira.",
    accessibilityDetails: {
      wheelchair: "Entrada plana e mesas com espaço para cadeira de rodas",
      blind: "Cardápio disponível em áudio mediante solicitação",
      tactilePaving: false,
      adaptedRestroom: true,
    },
  },
  {
    id: "caxias_rest_2",
    name: "Cantina Dona Amélia",
    city: "Duque de Caxias - RJ",
    category: "Gastronomia",
    address: "Av. Presidente Kennedy, 890 - Jardim 25 de Agosto, Duque de Caxias - RJ",
    latitude: -22.7791,
    longitude: -43.3049,
    lat: -22.7791,
    lng: -43.3049,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-22.7791,-43.3049",
    description: "Cantina italiana tradicional, ambiente familiar.",
    accessibilityDetails: {
      wheelchair: "Rampa de acesso e banheiro adaptado",
      blind: "Equipe treinada para acompanhamento",
      tactilePaving: false,
      adaptedRestroom: true,
    },
  },
];

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

// 1. Locais e Destinos
const handleGetLocais = async (req: Request, res: Response): Promise<void> => {
  const queryStr = typeof req.query.query === "string" ? req.query.query.toLowerCase() : "";
  const categoryStr = typeof req.query.category === "string" ? req.query.category : "";
  const necessidadeStr = typeof req.query.necessidade === "string" ? req.query.necessidade.toLowerCase() : "";

  const data = getDbData();

  // Mescla os locais padrão (incluindo restaurantes) com os que já existem no
  // db.json, em vez de só semear quando a lista está totalmente vazia. Assim,
  // novos locais adicionados aqui no código (como os restaurantes) sempre
  // aparecem, mesmo que o db.json já tivesse dados salvos de antes.
  const existingIds = new Set((data.places || []).map((p: any) => p.id));
  const missingDefaults = defaultPlaces.filter((p) => !existingIds.has(p.id));
  if (!data.places) data.places = [];
  if (missingDefaults.length > 0) {
    data.places = [...data.places, ...missingDefaults];
    saveDbData(data);
  }

  let dbPlaces = data.places || [];
  let dynamicPlaces: any[] = [];

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

  // Integração opcional com a API do Google Places, para trazer ainda mais
  // locais (incluindo restaurantes) além dos que já vêm do Overpass/OSM.
  // Para ativar: crie uma chave de API no Google Cloud Console (com a
  // "Places API" habilitada) e defina a variável de ambiente
  // GOOGLE_PLACES_API_KEY antes de rodar o servidor, por exemplo:
  //   GOOGLE_PLACES_API_KEY=sua_chave_aqui npm run dev
  // Sem a chave configurada, esse bloco é simplesmente ignorado e o app
  // continua funcionando normalmente só com o Overpass + db.json.
  // Aceita tanto GOOGLE_API_KEY (nome usado no .env do projeto) quanto
  // GOOGLE_PLACES_API_KEY (nome antigo), para não depender de uma única
  // variável específica.
  const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
  if (googleApiKey) {
    try {
      const CAXIAS_LAT = -22.7856;
      const CAXIAS_LNG = -43.3117;
      const googleTypes = ["restaurant", "tourist_attraction", "museum", "park", "cafe"];

      const googleResults = await Promise.all(
        googleTypes.map((type) =>
          axios
            .get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
              params: {
                location: `${CAXIAS_LAT},${CAXIAS_LNG}`,
                radius: 15000,
                type,
                key: googleApiKey,
              },
            })
            .then((r) => ({ type, results: r.data?.results || [] }))
            .catch(() => ({ type, results: [] }))
        )
      );

      const googlePlaces = googleResults.flatMap(({ type, results }) =>
        results
          .filter((item: any) => item.name && item.geometry?.location)
          .map((item: any) => {
            let mappedCategory = "Comércio Local";
            if (type === "restaurant" || type === "cafe") mappedCategory = "Gastronomia";
            else if (type === "museum" || type === "tourist_attraction") mappedCategory = "Cultura & História";
            else if (type === "park") mappedCategory = "Trilhas & Natureza";

            // Foto real do local via Google Places Photos, quando disponível.
            // O Nearby Search devolve só uma "photo_reference" (não a imagem
            // em si); a imagem de verdade é buscada depois no endpoint
            // /place/photo, passando essa referência + a chave da API.
            const photoReference = item.photos?.[0]?.photo_reference;
            const googlePhotoUrl = photoReference
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${googleApiKey}`
              : null;

            const fallbackImageUrl =
              mappedCategory === "Gastronomia"
                ? "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
                : mappedCategory === "Trilhas & Natureza"
                ? "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600"
                : "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600";

            return {
              id: `google_${item.place_id}`,
              name: item.name,
              city: "Duque de Caxias - RJ",
              category: mappedCategory,
              address: item.vicinity || "Duque de Caxias - RJ",
              latitude: item.geometry.location.lat,
              longitude: item.geometry.location.lng,
              lat: item.geometry.location.lat,
              lng: item.geometry.location.lng,
              rating: item.rating || 4.5,
              // Usa a foto real do Google quando o local tem uma cadastrada;
              // se não tiver, cai para a imagem padrão por categoria.
              imageUrl: googlePhotoUrl || fallbackImageUrl,
              googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${item.geometry.location.lat},${item.geometry.location.lng}`,
              accessibilityDetails: {
                wheelchair: item.wheelchair_accessible_entrance ? "Entrada acessível para cadeira de rodas" : "Não informado pelo Google",
                blind: "Não informado pelo Google",
                tactilePaving: false,
                adaptedRestroom: false,
              },
            };
          })
      );

      dynamicPlaces = [...dynamicPlaces, ...googlePlaces];
    } catch (err) {
      console.log("Erro ao carregar locais via Google Places API:", err);
    }
  }

  const existingNames = new Set(dbPlaces.map((p: any) => p.name?.toLowerCase()));
  const uniqueDynamic = dynamicPlaces.filter((p: any) => !existingNames.has(p.name?.toLowerCase()));
  let allPlaces = [...dbPlaces, ...uniqueDynamic];

  if (categoryStr && categoryStr !== "Todos" && categoryStr !== "Roteiros") {
    const cat = categoryStr.toLowerCase();
    allPlaces = allPlaces.filter((p: any) => {
      const pCategory = (p.category || "").toLowerCase();
      return pCategory.includes(cat) || cat.includes(pCategory);
    });
  }

  if (queryStr) {
    allPlaces = allPlaces.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(queryStr) ||
        p.address?.toLowerCase().includes(queryStr) ||
        p.city?.toLowerCase().includes(queryStr)
    );
  }

  if (necessidadeStr) {
    allPlaces = allPlaces.filter((p: any) => {
      const acc = p.accessibilityDetails || {};
      if (necessidadeStr === "cadeirante" || necessidadeStr === "wheelchair") {
        return acc.wheelchair || acc.cadeirante?.rampa || acc.adaptedRestroom;
      }
      if (necessidadeStr === "visual" || necessidadeStr === "blind") {
        return acc.blind || acc.tactilePaving || acc.visual?.pisoTatil;
      }
      if (necessidadeStr === "auditiva" || necessidadeStr === "hearing" || necessidadeStr === "surdo") {
        return acc.hearing || acc.auditiva?.interpreteLibras;
      }
      if (necessidadeStr === "neurodivergente" || necessidadeStr === "autismo") {
        return acc.neurodivergent || acc.neurodivergente?.espacoSilencioso;
      }
      return true;
    });
  }

  res.json(allPlaces);
};

routes.get("/locais", handleGetLocais);
routes.get("/destinos", handleGetLocais);

// 2. Notificações
routes.get("/notificacoes", (_req: Request, res: Response): void => {
  const data = getDbData();
  if (!data.notifications || data.notifications.length === 0) {
    data.notifications = defaultNotifications;
    saveDbData(data);
  }
  res.json(data.notifications);
});

routes.put("/notificacoes/ler-todas", (_req: Request, res: Response): void => {
  const data = getDbData();
  if (data.notifications) {
    data.notifications = data.notifications.map((n: any) => ({ ...n, read: true }));
    saveDbData(data);
  }
  res.json({ message: "Todas as notificações foram marcadas como lidas." });
});

// 3. Experiências
routes.get("/experiencias", (req: Request, res: Response): void => {
  const categoryStr = typeof req.query.category === "string" ? req.query.category.toLowerCase() : "";
  const data = getDbData();
  let exps = data.experiences || [];

  if (categoryStr && categoryStr !== "todos") {
    exps = exps.filter((e: any) => e.category?.toLowerCase() === categoryStr);
  }

  res.json(exps);
});

// 4. Reservas
// IMPORTANTE: as reservas são filtradas por usuário (userId). Sem isso, toda
// conta nova enxergava as reservas de TODAS as contas do banco, porque a
// rota devolvia a lista inteira sem checar quem estava logado.
routes.get("/reservas", (req: Request, res: Response): void => {
  const userId = typeof req.query.userId === "string" ? req.query.userId : "";
  const data = getDbData();
  const all = data.reservations || [];

  if (!userId) {
    // Sem usuário informado, não devolve reservas de ninguém (evita vazar
    // dados de outras contas para quem esqueceu de mandar o userId).
    res.json([]);
    return;
  }

  res.json(all.filter((r: any) => String(r.userId) === String(userId)));
});

routes.post("/reservas", (req: Request, res: Response): void => {
  // Aceita tanto os nomes de campo "novos" (title, category, date...) quanto os
  // nomes legados que algumas telas antigas do app ainda enviavam (titulo,
  // id_local, data_horario...), para nunca perder uma reserva por causa de
  // um nome de campo diferente.
  const {
    title,
    titulo,
    category,
    date,
    time,
    location,
    guests,
    quantidade_pessoas,
    imageUrl,
    description,
    placeId,
    id_local,
    data_horario,
    userId,
    usuarioId,
  } = req.body;

  const reservationUserId = userId || usuarioId || null;

  if (!reservationUserId) {
    res.status(400).json({ message: "userId é obrigatório para criar uma reserva." });
    return;
  }

  const reservationTitle = title || titulo || "Reserva Destinus";
  const data = getDbData();

  let reservationDate = date;
  let reservationTime = time;
  if (!reservationDate && data_horario) {
    const parsed = new Date(data_horario);
    if (!isNaN(parsed.getTime())) {
      reservationDate = parsed.toLocaleDateString("pt-BR");
      reservationTime = reservationTime || parsed.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
  }

  const newReservation = {
    id: `res_${Date.now()}`,
    userId: reservationUserId,
    placeId: placeId || id_local || null,
    title: reservationTitle,
    category: category || "Passeio",
    date: reservationDate || "A confirmar",
    time: reservationTime || "",
    location: location || "",
    guests: guests || quantidade_pessoas || 1,
    status: "confirmed",
    code: `DST-${Math.floor(1000 + Math.random() * 9000)}`,
    imageUrl: imageUrl || null,
    description: description || "Reserva enviada ao parceiro.",
    createdAt: new Date().toISOString(),
  };

  data.reservations = data.reservations || [];
  data.reservations.unshift(newReservation);

  data.notifications = data.notifications || defaultNotifications;
  data.notifications.unshift({
    id: `notif_${Date.now()}`,
    title: "📅 Reserva Solicitada",
    message: `Sua solicitação para "${reservationTitle}" foi enviada com sucesso!`,
    time: "Agora",
    read: false,
    type: "reservation",
  });

  saveDbData(data);

  res.status(201).json({
    message: "Reserva realizada com sucesso!",
    reservation: newReservation,
  });
});

// Cancelar uma reserva existente (antes não existia nenhuma rota para isso,
// então o botão "Cancelar Reserva" no app não tinha como funcionar de verdade).
routes.put("/reservas/:id/cancelar", (req: Request, res: Response): void => {
  const { id } = req.params;
  const data = getDbData();

  data.reservations = data.reservations || [];
  const reservation = data.reservations.find((r: any) => String(r.id) === String(id));

  if (!reservation) {
    res.status(404).json({ message: "Reserva não encontrada." });
    return;
  }

  reservation.status = "cancelled";
  saveDbData(data);

  res.json({ message: "Reserva cancelada com sucesso!", reservation });
});

// 5. Autenticação e Perfil
routes.post("/cadastro", (req: Request, res: Response): void => {
  const { name, email, password, needs, disabilities, preferences } = req.body;
  const data = getDbData();

  const newUser = {
    id: String(Date.now()),
    name,
    email,
    password,
    photoUrl: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    needs: needs || { wheelchair: false, visual: false, hearing: false, neurodivergent: false },
    disabilities: disabilities || { wheelchair: false, blind: false, lowVision: false, deaf: false, autism: false, epilepsy: false },
    preferences: preferences || { trails: false, walks: false, beaches: false, culture: false, gastronomy: false },
  };

  data.users = data.users || [];
  data.users.push(newUser);
  saveDbData(data);

  res.status(201).json({ message: "Usuário cadastrado com sucesso!", user: newUser });
});

routes.post("/login", (req: Request, res: Response): void => {
  const { email, password } = req.body;
  const data = getDbData();

  const allUsers = [...(data.users || []), ...(data.usuarios || [])];
  const user = allUsers.find((u: any) => u.email === email && u.password === password);

  if (!user) {
    res.status(401).json({ message: "E-mail ou senha inválidos" });
    return;
  }

  res.json({ message: "Login realizado com sucesso!", user });
});

routes.put("/usuarios/:id/foto", (req: Request, res: Response): void => {
  const { id } = req.params;
  const { photoUrl } = req.body;
  const data = getDbData();

  let user = (data.users || []).find((u: any) => String(u.id) === String(id));
  if (!user) {
    user = (data.usuarios || []).find((u: any) => String(u.id) === String(id));
  }

  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado" });
    return;
  }

  user.photoUrl = photoUrl;
  saveDbData(data);

  res.json({ message: "Foto atualizada com sucesso!", photoUrl: user.photoUrl, user });
});

export default routes;