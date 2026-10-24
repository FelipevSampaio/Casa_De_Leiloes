# Casa de Leilões

Este projeto foi estruturado como um monorepo para receber a solução do desafio "Teste técnico: Elite Dev na Verzel".

## Stack escolhida

- Front-end: React + Vite + TypeScript
- Back-end: Node.js + Express
- Banco de dados: PostgreSQL
- Gerenciamento de ambiente: Docker Compose
- ORM: Prisma

## Estrutura proposta

```text
.
├── backend/
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── docker-compose.yml
├── package.json
├── .env.example
└── README.md
```

## Objetivo desta etapa

Definir a arquitetura base do projeto e preparar a estrutura inicial para o desenvolvimento das regras de negócio do leilão.

## Próximo passo

- criar a modelagem do banco
- definir entidades e regras do leilão
- implementar a API do backend
