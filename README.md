# Casa de Leilões

Projeto de estudo e portfólio para simular uma plataforma de leilões online, com foco em arquitetura de software, regras de negócio, API REST, banco de dados relacional e interface de usuário.

<p align="center">
  <img src="https://img.shields.io/badge/Status-Validado%20em%20PostgreSQL-blue" alt="Status do projeto" />
  <img src="https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20Prisma%20%7C%20PostgreSQL-0A66C2" alt="Stack" />
  <img src="https://img.shields.io/badge/Type-Portfolio%20Project-1f2937" alt="Tipo do projeto" />
</p>

## Visão geral

O Casa de Leilões é um protótipo funcional de gestão de leilões online. O sistema permite:

- listar lotes em vitrine
- publicar novos lotes
- receber lances
- validar regras de negócio do leilão
- encerrar lotes
- consultar histórico de auditoria
- consultar carteira e saldo do usuário
- persistir dados em PostgreSQL real via Prisma

A aplicação foi estruturada em monorepo com backend e frontend separados, mantendo uma arquitetura simples e fácil de evoluir.

## Stack tecnológica

- Frontend: React + Vite
- Backend: Node.js + Express
- Banco: PostgreSQL + Prisma
- Testes: Node test runner
- Orquestração local: npm workspaces
- Infra: Docker Compose preparado para ambiente completo

## Requisitos atendidos

- criação de lote
- publicação de lote pelo leiloeiro
- cadastro de usuários e permissões por papel
- validação de lance inicial e incrementos mínimos
- bloqueio de lances em lotes inativos
- validação de saldo insuficiente
- fechamento de lote com vencedor registrado
- auditoria de ações do sistema
- persistência em PostgreSQL real
- interface funcional para vitrine, leiloeiro, lote ao vivo, carteira e auditoria

## Estrutura do projeto

```text
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── data/
│   │   ├── domain/
│   │   ├── lib/
│   │   └── routes/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── package.json
├── README.md
├── .gitignore
└── .env
```

## Pré-requisitos

Antes de iniciar, garanta que o ambiente tenha:

- Node.js 20+
- npm
- PostgreSQL 16+
- opcionalmente Docker + Docker Compose

## Configuração do ambiente

Copie o arquivo `.env.example` para `.env` e ajuste conforme seu ambiente local.

Exemplo:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/leiloes
JWT_SECRET=change-me
VITE_API_URL=http://localhost:3000
```

## Executando localmente

Na raiz do projeto:

```bash
npm install
npm run dev
```

Isso inicia:

- backend em http://localhost:3000
- frontend em http://localhost:5173

## Banco de dados PostgreSQL

### 1) Subir o PostgreSQL localmente

Se estiver usando o PostgreSQL instalado no Fedora/Ubuntu, crie o banco:

```bash
sudo -u postgres createdb leiloes
```

### 2) Aplicar migration

```bash
npx prisma migrate deploy --schema backend/prisma/schema.prisma
```

### 3) Popular o seed

```bash
node backend/prisma/seed.js
```

### 4) Validar a conexão

```bash
psql postgresql://postgres:postgres@localhost:5432/leiloes
```

## Testes automatizados

```bash
npm test --workspace backend
```

## Build do frontend

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

## Fluxo de validação real

1. iniciar PostgreSQL
2. rodar migration do Prisma
3. rodar seed
4. subir aplicação com `npm run dev`
5. testar:
   - criação de lote
   - lance válido e inválido
   - fechamento de lote
   - auditoria do sistema
   - consulta de lotes e carteira

Exemplos:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/lots
curl http://localhost:3000/audit

curl -X POST http://localhost:3000/lots \
  -H "Content-Type: application/json" \
  -d '{"title":"Lote final","description":"Teste de persistência real","initialPrice":5000,"minimumIncrement":100}'

curl -X POST http://localhost:3000/lots/<id-do-lote>/bids \
  -H "Content-Type: application/json" \
  -d '{"amount":5200}'
```

## Observação sobre fallback mockado

O projeto foi pensado para funcionar mesmo sem banco real durante desenvolvimento. Quando `DATABASE_URL` não está disponível, o backend usa dados mockados para manter o frontend funcional. No ambiente com PostgreSQL ativo, a aplicação utiliza a persistência real do Prisma.

## Roadmap

- expandir autenticação e autorização
- melhorar UX e refinamento visual
- adicionar mais casos de teste de borda
- consolidar regras de usuário e saldo em banco real
- preparar deploy em ambiente de produção

## Uso de IA no desenvolvimento

Este projeto foi desenvolvido com apoio de inteligência artificial como ferramenta de aceleração e validação de etapas. A IA foi utilizada para:

- estruturar a arquitetura inicial do monorepo
- propor a organização de pastas e módulos
- auxiliar na modelagem do domínio do leilão
- identificar regras de negócio e bordas de validação
- sugerir endpoints e contratos da API
- revisar a organização do backend e frontend
- ajudar na depuração de erros de runtime e integração
- validar ajustes de Prisma, PostgreSQL e ambiente local
- sugerir melhorias de documentação e organização do projeto

A IA foi usada como parceiro de desenvolvimento para acelerar a implementação, reduzir retrabalho e auxiliar na análise crítica das decisões de arquitetura. O código final foi revisado e ajustado manualmente para adequar a solução aos requisitos do projeto e ao contexto de execução local.

## Autor

Projeto desenvolvido por Felipe Sampaio como estudo prático de backend, arquitetura de software, persistência relacional e desenvolvimento de interfaces.
