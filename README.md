# Casa de Leilões

Projeto pessoal para simular uma plataforma de leilões online, com foco em backend, regras de negócio, experiência do usuário e arquitetura de aplicação.

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20desenvolvimento-blue" alt="Status do projeto" />
  <img src="https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-0A66C2" alt="Stack" />
  <img src="https://img.shields.io/badge/Type-Portfolio%20Project-1f2937" alt="Tipo do projeto" />
</p>

## Visão geral

O Casa de Leilões é um protótipo de gestão de leilões online, pensado para reproduzir cenários reais como:

- vitrine de lotes
- sala de lances em tempo real
- painel do leiloeiro
- carteira do licitante
- histórico de auditoria
- fluxo de criação e fechamento de lotes

A proposta é criar uma aplicação funcional, organizada e de fácil extensão, servindo como estudo prático de arquitetura de software, APIs REST, persistência e integração entre frontend e backend.

## Stack tecnológica

- Front-end: React + Vite
- Back-end: Node.js + Express
- Banco de dados: PostgreSQL + Prisma
- Ambiente: Docker Compose (opcional)
- Testes: Node test runner + validação de build do frontend

## Funcionalidades

- Vitrine de lotes com listagem e filtros
- Criação de novos lotes pelo leiloeiro
- Sala de lances para interação do usuário
- Sistema de carteira e saldo do licitante
- Histórico de auditoria das operações
- Fechamento de leilão com atualização de status
- Estrutura preparada para persistência real com banco

## Estrutura do projeto

```text
.
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── package.json
├── README.md
└── .gitignore
```

## Requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js 20+
- npm
- PostgreSQL (para uso real com Prisma)
- Docker (opcional, para subir o ambiente completo)

## Configuração de ambiente

Copie o arquivo [.env.example](.env.example) para `.env` e ajuste os valores conforme o ambiente local.

Exemplo:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/leiloes
```

## Como executar localmente

Na raiz do projeto:

```bash
npm install
npm run dev
```

Isso deve subir:

- backend em http://localhost:3000
- frontend em http://localhost:5173

## Como testar

```bash
npm run test --workspace backend
```

## Validação do frontend

```bash
npm run build --workspace frontend
```

## Principais endpoints da API

- `GET /health`
- `GET /lots`
- `GET /lots/:id`
- `POST /lots`
- `POST /lots/:id/bids`
- `POST /lots/:id/close`
- `GET /users/:id/balance`
- `GET /users/:id/auctions`
- `GET /audit`

## Observação sobre banco de dados

O projeto está preparado para uso com Prisma e PostgreSQL quando a variável `DATABASE_URL` estiver configurada. Caso o banco não esteja disponível, o backend pode utilizar dados mockados para manter a aplicação funcional e facilitar testes locais.

## Roadmap

- Provisionar PostgreSQL real localmente ou via Docker
- Rodar `npx prisma migrate dev`
- Adicionar seed para popular dados iniciais
- Remover fallback mockado e manter persistência total no banco
- Expandir testes automatizados de regra de negócio e integração
- Melhorar UX da interface e fluxos de lances

## Autor

Projeto desenvolvido por Felipe Sampaio como estudo e portfólio em desenvolvimento backend, arquitetura de software e experiência de usuário.

Se quiser, posso continuar evoluindo este projeto com:

- autenticação e autorização
- controle de usuários e roles
- melhorias na interface
- deploy em AWS
- estrutura de microserviços ou modularização avançada
