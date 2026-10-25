# Casa de Leilões

Aplicação de protótipo para gestão de leilões online, com vitrine de lotes, sala do leilão, painel do leiloeiro, carteira do licitante e histórico de auditoria.

## Stack

- Front-end: React + Vite
- Back-end: Node.js + Express
- Banco: PostgreSQL + Prisma
- Ambiente de execução: Docker Compose (opcional)
- Testes: Node test runner + Vite build validation

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

- Node.js 20+
- npm
- PostgreSQL (para uso real com Prisma)
- Docker (opcional, para subir o ambiente completo)

## Variáveis de ambiente

Copie o arquivo [.env.example](.env.example) para um arquivo .env ou ajuste diretamente a variável `DATABASE_URL`.

Exemplo:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/leiloes
```

## Como rodar localmente

Na raiz do projeto:

```bash
npm install
npm run dev
```

Isso inicia:
- backend em http://localhost:3000
- frontend em http://localhost:5173

## Como testar

```bash
npm run test --workspace backend
```

## Como validar a build do frontend

```bash
npm run build --workspace frontend
```

## Endpoints principais da API

- GET /health
- GET /lots
- GET /lots/:id
- POST /lots
- POST /lots/:id/bids
- POST /lots/:id/close
- GET /users/:id/balance
- GET /users/:id/auctions
- GET /audit

## Observação sobre banco real

O projeto está preparado para usar Prisma com PostgreSQL quando a variável `DATABASE_URL` estiver configurada. Caso o banco não esteja disponível, o backend usa dados mockados para manter a aplicação funcional.

## Funcionalidades implementadas

- vitrine de lotes
- painel do leiloeiro
- sala do lote ao vivo
- carteira do licitante
- histórico de auditoria
- criação de lote via formulário
- envio de lances via API mockada
- testes automatizados da regra de negócio e endpoints principais

## Próximo passo recomendado

- provisionar PostgreSQL real localmente ou via Docker
- rodar `npx prisma migrate dev`
- popular dados com seed
- remover o fallback mockado e manter persistência total no banco
