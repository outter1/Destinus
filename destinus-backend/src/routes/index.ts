import { Router } from "express";
import axios from "axios";
import { db } from "../config/db";

const routes = Router();

// 1. Busca de Locais e Destinos (Com fallback e busca integrada ao OpenStreetMap)
routes.get("/locais", async (req, res) => {
  const { query, category } = req.query;
  const data = db.read();
  let places = data.places || [];

  // Filtro por categoria
  if (category && category !== "Todos") {
    places = places.filter(
      (p: any) => p.category?.toLowerCase() === String(category).toLowerCase()
    );
  }

  // Filtro por busca textual (nome, endereço ou cidade)
  if (query) {
    const q = String(query).toLowerCase();
    places = places.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q)
    );

    // Se houver poucos locais cadastrados no banco, busca dinamicamente via OpenStreetMap
    if (places.length < 3) {
      try {
        const osmResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            String(query) + " Baixada Fluminense Rio de Janeiro"
          )}&limit=5`,
          { headers: { "User-Agent": "DestinusApp/1.0" } }
        );

        const dynamicPlaces = osmResponse.data.map((item: any) => ({
          id: `osm_${item.place_id}`,
          name: item.display_name.split(",")[0],
          city: item.display_name.split(",")[2]?.trim() || "Baixada Fluminense",
          category: "Turismo",
          address: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          imageUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`,
          accessibilityDetails: {
            wheelchair: "Informação via geolocalização pública",
            blind: "Rota mapeada via GPS",
            tactilePaving: false,
            adaptedRestroom: false,
          },
        }));

        places = [...places, ...dynamicPlaces];
      } catch (err) {
        console.log("Erro na busca de locais externos:", err);
      }
    }
  }

  return res.json(places);
});

// 2. Experiências e Passeios
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

// 3. Minhas Reservas
routes.get("/reservas", (req, res) => {
  const data = db.read();
  return res.json(data.reservations || []);
});

// 4. Criar Nova Reserva Direct-to-Merchant (Intermédio de pagamento/agendamento)
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
  db.write(data);

  return res.status(201).json({
    message: "Reserva realizada com sucesso!",
    reservation: newReservation,
  });
});

// 5. Autenticação e Perfil de Usuário
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

  // Suporta busca unificada nas chaves 'users' ou 'usuarios' do db.json
  const allUsers = [...(data.users || []), ...(data.usuarios || [])];
  const user = allUsers.find(
    (u: any) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "E-mail ou senha inválidos" });
  }

  return res.json({ message: "Login realizado com sucesso!", user });
});

export default routes;