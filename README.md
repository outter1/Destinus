# ♿ Destinus

> **Status do Projeto:** 🚧 Em Desenvolvimento

O **Destinus** é uma aplicação focada em mapear, avaliar e compartilhar estabelecimentos e espaços públicos acessíveis, ajudando pessoas com diferentes necessidades de acessibilidade a encontrarem locais adequados para o seu dia a dia.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
| :--- | :--- |
| **Mobile / Frontend** | React Native, Expo, TypeScript |
| **Backend / API** | Node.js, Express, TypeScript |
| **Banco de Dados** | Estrutura leve em JSON (`db.json`) pensado para prototipagem pois é um projeto que pode ser melhorado e completo.|

---

## ✨ Funcionalidades em Construção

* **Cadastro de Usuários Personalizado:** Permite registrar usuários especificando necessidades específicas (mobilidade reduzida, deficiência visual, auditiva ou neurodivergência).
* **Autenticação de Usuários:** Sistema de login integrado para acesso aos recursos da plataforma.
* **Mapeamento de Locais:** Exibição de locais cadastrados com fotos, notas de acessibilidade e lista de recursos disponíveis.
* **Cadastro Colaborativo:** Inclusão de novos estabelecimentos informando nome, endereço, imagem e tags de acessibilidade.
* **Suporte Multiplataforma:** Compatível com dispositivos móveis (via Expo Go) e navegadores web.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js** instalado na máquina.
* Aplicativo **Expo Go** instalado no celular (caso queira testar em dispositivo físico).
* Não é necessário ter o Expo Go no celular, pois você consegue executar o teste pelo seu pc também.

---

### 1. Inicializar o Backend

cd destinus-backend

# Instale as dependências
npm install

# Inicie o servidor em modo de desenvolvimento
npm run dev

# E depois o mobile

# Entre na pasta do mobile
cd destinus-mobile

# Instale as dependências
npm install

# Inicie a aplicação
npm start
