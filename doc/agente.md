# Guia para Agentes de IA – Projeto Tia Maria EAD

## Resumo do Projeto

Repositório monorepo que concentra:

- **Landing page estática** em HTML + Tailwind (produção na Vercel, fácil de editar);
- **Plataforma EAD** em construção, composta por backend FastAPI (JWT, Alembic, Postgres) e frontend Next.js + MUI;
- **Docker Compose** com Postgres, API e frontend, incluindo script de seed com usuários de exemplo.

Toda a documentação está em português e deve ser mantida atualizada ao final de cada intervenção.

## Estrutura Atual

- `index.html` e pasta `assets/`: landing responsiva com conteúdo institucional.
- `apps/api`: backend FastAPI (modelos SQLAlchemy, migrations Alembic, seed).
- `apps/web`: frontend Next.js App Router com componentes MUI para login/recuperação.
- `docker-compose.yml`: orquestra banco, API e frontend.
- `doc/`: documentação (arquitetura, backend, frontend, auth flow, backlog e este guia).

Scripts úteis no `package.json` raiz:

- `npm start`: servidor estático para a landing.
- `npm run dev:stack`: sobe Postgres + API + frontend (usa Docker).
- `npm run dev:backend`: apenas API + banco via Docker.
- `npm run dev:frontend`: modo dev do Next.js usando dependências locais.

## Convenções para Agentes

1. **Leia antes de agir**: revise `README.md`, este arquivo e o backlog para entender o estado atual.
2. **Respeite o tema**: mantenha o tom espiritual, linguagem inclusiva e conteúdo em pt-BR.
3. **Rode e teste**: antes de entregar mudanças, suba os serviços afetados (Docker ou local) e execute o que for necessário (lint, testes, seeds).
4. **Atualize documentação**: qualquer alteração relevante exige revisão de README, `doc/*.md` relacionados e `doc/backlog.md`.
5. **Registre no backlog**: marque tarefas como concluídas/em andamento com data.
6. **Não reverta mudanças do usuário**: se encontrar alterações externas, confirme antes de sobrescrever.
7. **Registrar histórico**: adicione uma linha no final deste arquivo resumindo o que fez e quando.

## Histórico de Mudanças

- [23/10/2025]: Criação inicial da documentação para agentes e análise do projeto estático.
- [23/10/2025]: Melhorias de conteúdo e UX na landing (seção “Como Chegar”, destaque da gira, mapa, CTA, rolagem suave, botão “voltar ao topo”).
- [23/10/2025]: Planejamento da plataforma EAD, criação do backlog e scripts básicos (`dev:*`).
- [24/10/2025]: Modelagem de banco, fluxo de autenticação e documentação (`ead_db_model.md`, `ead_auth_flow.md`).
- [24/10/2025]: Implementação do backend FastAPI (modelos, rotas de login/reset, email HTML, seed inicial).
- [24/10/2025]: Setup inicial do frontend Next.js/MUI com componentes para login e reset.
- [24/10/2025]: Integração completa do fluxo de login/recuperação no frontend, ajustes no README e guides, e validação da stack Docker com seed automático.
- [24/10/2025]: Alinhamento da landing com o backend real (login via FastAPI), ajuste de CORS para `localhost:8080` e atualização geral da documentação.