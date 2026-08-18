<div align="center">

<img src="./destinus-mobile/assets/logo.png" alt="Logo Destinus" width="120" />

# ♿ Destinus

### Turismo e mobilidade acessível para todos

Mapeie, avalie e descubra locais e experiências acessíveis perto de você.

<img src="./destinus-mobile/assets/banner-destinus.png" alt="Banner Destinus" width="100%" />

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-51-000020?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

</div>

---

## 📖 Sobre o projeto

O **Destinus** é um aplicativo mobile que ajuda pessoas com deficiência ou mobilidade reduzida a encontrar, avaliar e compartilhar locais realmente acessíveis — trilhas, museus, restaurantes, igrejas e pontos turísticos — com foco inicial na região da **Baixada Fluminense (Duque de Caxias, RJ)**.

Mais do que um guia turístico, o app foi pensado para se **adaptar ao usuário**, e não o contrário: o onboarding define um perfil de acessibilidade (baixa visão, cegueira, Libras ou neurodivergência) e todo o app — cores, tamanho de fonte, espaçamento, som — se ajusta automaticamente a partir dessa escolha.

> 💡 O nome **Destinus** remete a "destino" — o compromisso do projeto é que a acessibilidade seja o destino, não um obstáculo no caminho.

---

## ✨ Funcionalidades

### 🧭 Para o viajante
- **Onboarding de acessibilidade** — escolha entre navegação padrão, baixa visão, cegueira, Libras ou modo neurodivergente logo no cadastro, e o app inteiro se adapta ao perfil.
- **Explorar locais** — busca e filtro de estabelecimentos por categoria (Trilhas & Natureza, Cultura & História, Gastronomia, Comércio Local) e por tipo de necessidade de acessibilidade.
- **Mapa interativo** — visualização dos locais com integração ao Google Maps para rotas.
- **Detalhes de acessibilidade por local** — informações específicas como rampas, piso tátil, banheiro adaptado, audiodescrição e sinalização sonora.
- **Cadastro colaborativo de locais** — qualquer usuário pode adicionar um novo estabelecimento, com nome, endereço, imagem e recursos de acessibilidade.
- **Reservas por conta** — cada usuário só vê e gerencia as próprias reservas (o backend valida e filtra por `userId` em toda a jornada de criar/listar/cancelar).
- **Feedback confiável em toda ação** — confirmação visível ao reservar, cancelar, cadastrar ou entrar, funcionando igual no navegador, Android e iOS.
- **Notificações** — recomendações do dia, dicas de acessibilidade e atualizações de reservas.
- **Perfil personalizado** — edição de foto, preferências de navegação e histórico de locais visitados recentemente.

### ♿ Recursos de acessibilidade
- **Intérprete virtual de Libras (VLibras)** — avatar flutuante integrado via WebView, usando o widget oficial do governo brasileiro.
  - **Arrastável** — pode ser reposicionado livremente na tela segurando a alcinha (⠿), e nunca sai dos limites visíveis.
  - **Fechamento garantido** — o botão "✕" recria o widget do zero, sem depender do estado interno do player de terceiros.
  - Ao abrir/fechar, o painel cresce a partir do mesmo canto onde o botão estava — nunca "pula" para longe de onde o usuário tocou.
- **Leitura em voz alta (Text-to-Speech)** — narração de telas e ações via `expo-speech`.
- **Temas adaptativos** — paleta de cores, espaçamento entre letras e altura de linha ajustados automaticamente para o modo neurodivergente.
- **Escala de fonte dinâmica** — todo o app responde a um fator de escala de texto.

### 🗺️ Fonte de dados dos locais
Além dos locais cadastrados manualmente (armazenados no `db.json`), o backend enriquece a busca em tempo real consultando a **[Overpass API](https://overpass-api.de/)** (OpenStreetMap) para trazer pontos turísticos, restaurantes, cafés e espaços de lazer da região automaticamente.

---

## 🏗️ Arquitetura

O projeto é dividido em dois pacotes independentes:

Destinus/
├── destinus-backend/ # API REST em Node.js + Express + TypeScript
│ ├── scripts/
│ │ └── free-port.cjs # Libera a porta 3333 antes de subir o servidor
│ ├── src/
│ │ ├── config/ # Configuração de acesso ao "banco de dados"
│ │ ├── controllers/ # Regras de negócio (locais, autenticação, reviews)
│ │ ├── routes/ # Definição das rotas da API
│ │ └── server.ts # Ponto de entrada do servidor
│ └── db.json # Banco de dados leve (JSON), ideal para prototipagem
│
└── destinus-mobile/ # App mobile em React Native + Expo + TypeScript
├── assets/ # Logo, banner e imagens estáticas
└── src/
├── components/ # Componentes reutilizáveis (ex: LibrasAvatar)
├── config/ # Configuração de ambiente/API
├── constants/ # Tema, cores e constantes visuais
├── screens/ # Telas do app (Home, Explorar, Reservas, Perfil...)
├── services/ # Camada de comunicação com a API
└── utils/ # Helpers cross-platform (ex: alert.ts)


### Stack utilizada

| Camada | Tecnologias |
| :--- | :--- |
| **Mobile / Frontend** | React Native · Expo · TypeScript · Axios · Expo Speech · Expo Image Picker · React Native WebView |
| **Backend / API** | Node.js · Express · TypeScript · Axios · CORS · `tsx` (dev runner) |
| **Banco de Dados** | JSON local (`db.json`) — leve e ideal para prototipagem, com espaço para evoluir para um banco relacional/NoSQL |
| **Dados geográficos** | Overpass API (OpenStreetMap) para enriquecimento dinâmico de locais |
| **Acessibilidade** | Widget oficial VLibras (Governo Federal) e Text-to-Speech nativo |

---

## 🚀 Como executar o projeto

### Pré-requisitos
- **Node.js** instalado na máquina.
- **Aplicativo Expo Go** no celular *(opcional — dá para testar direto no navegador ou emulador)*.

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/destinus.git
cd destinus
```

### 2. Rodar o backend
```bash
cd destinus-backend
npm install
npm run dev
```
O servidor sobe em `http://localhost:3333` e expõe as rotas em `/api/...` e na raiz `/...`.

- `npm run dev` roda em **processo único** (sem auto-reload) e, antes de subir, libera sozinho a porta 3333 caso tenha sobrado algum processo de uma execução anterior — então mesmo fechando o terminal "no braço", o próximo `npm run dev` sempre funciona.
- `npm run dev:watch` reinicia automaticamente a cada alteração de arquivo (útil enquanto edita o backend), mas por rodar num processo filho, é mais suscetível a ficar "preso" ao fechar a janela do terminal.
- `npm run stop` libera a porta 3333 manualmente, sem subir o servidor.

### 3. Rodar o app mobile
Em outro terminal:
```bash
cd destinus-mobile
npm install
npm start
```
Depois é só escanear o QR Code com o **Expo Go** ou rodar em um emulador/navegador (`npm run android`, `npm run ios` ou `npm run web`).

> ⚠️ **Importante:** se for testar em um celular físico na mesma rede Wi-Fi, edite a constante `LOCAL_NETWORK_IP` em `destinus-mobile/src/config/api.ts` para o IP da sua máquina (descubra com `ipconfig` no Windows ou `ifconfig`/`ip a` no Mac/Linux) — o app detecta sozinho quando está rodando em emulador Android ou na Web, mas em celular físico não tem como adivinhar o IP da sua rede.

---

## 🩺 Solução de problemas

Problemas de conexão entre celular e computador são, de longe, a causa mais comum de "o app não funciona" durante o desenvolvimento. Antes de desconfiar do código, confira:

| Sintoma | Causa provável | O que fazer |
| :--- | :--- | :--- |
| Erro ao escanear o QR code do Expo Go ("Algo deu errado") | Celular e PC em redes diferentes, ou firewall bloqueando a porta 8081 | Confirme que os dois estão no **mesmo Wi-Fi/roteador**; libere a porta 8081 no Firewall do Windows; ou rode `npx expo start --tunnel` para contornar a rede local |
| App abre mas não carrega dados / fica girando para sempre | Backend fora do ar, ou `LOCAL_NETWORK_IP` desatualizado em `src/config/api.ts` | Confirme que `npm run dev` está rodando no backend; teste `http://SEU_IP:3333/api/destinos` no navegador do próprio celular |
| "EADDRINUSE" / porta 3333 já em uso ao rodar `npm run dev` | Um processo antigo do servidor ficou preso (comum ao fechar a janela do terminal no Windows) | Já resolvido automaticamente pelo `predev` — se persistir, rode `npm run stop` e tente de novo |
| Login/cadastro não funciona, ou mensagens de sucesso/erro não aparecem | Normalmente reflexo do backend inacessível (ver linha acima) | As telas agora sempre mostram uma mensagem clara de erro (`"Sem conexão com o servidor"`) em vez de falhar silenciosamente — use ela para diagnosticar |
| Testando pelo navegador (`npm run web`) e nada acontece ao clicar em botões de confirmação | *(Corrigido)* — `Alert.alert` do React Native não funciona de forma confiável no navegador | O app usa `src/utils/alert.ts`, que troca automaticamente para `window.alert`/`window.confirm` na Web |

---

## 🔌 Principais endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/locais` | Lista locais, com filtros por `query`, `category` e `necessidade` |
| `GET` | `/api/notificacoes` | Lista notificações do usuário |
| `PUT` | `/api/notificacoes/ler-todas` | Marca todas as notificações como lidas |
| `GET` | `/api/experiencias` | Lista experiências disponíveis |
| `GET` | `/api/reservas?userId=` | Lista as reservas **do usuário informado** — sem `userId`, retorna lista vazia |
| `POST` | `/api/reservas` | Cria uma nova reserva (requer `userId` no corpo da requisição) |
| `PUT` | `/api/reservas/:id/cancelar` | Cancela uma reserva existente |
| `POST` | `/api/cadastro` | Cadastra um novo usuário |
| `POST` | `/api/login` | Autentica um usuário |
| `PUT` | `/api/usuarios/:id/foto` | Atualiza a foto de perfil do usuário |

---

## 🗺️ Roadmap

- [ ] Migrar o banco de dados de JSON para PostgreSQL/MongoDB
- [ ] Autenticação com JWT e criptografia de senha
- [ ] Avaliações e comentários de acessibilidade por outros usuários
- [ ] Upload real de imagens (hoje via URL)
- [ ] Expansão para outras cidades além da Baixada Fluminense
- [ ] Testes automatizados (backend e mobile)
- [ ] Lembrar a posição do intérprete de Libras entre sessões

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Sinta-se à vontade para abrir uma *issue* relatando bugs ou sugestões, ou enviar um *pull request*:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Faça commit das suas alterações (`git commit -m 'feat: minha nova feature'`)
4. Envie para o seu fork (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

<div align="center">

Feito com 💙 pensando em um turismo mais acessível para todos.

</div>
