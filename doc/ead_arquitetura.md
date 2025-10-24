# Plano de Arquitetura para Plataforma EAD

## Objetivos
- Suportar distribuição de cursos, materiais digitais e vendas de conteúdos.
- Minimizar custo inicial mantendo base para escalar conforme crescimento.
- Preservar landing page estática atual com deploy simples na Vercel.

## Visão Geral da Arquitetura
- **Frontend**: Next.js 14 (App Router) hospedado na Vercel utilizando MUI para UI (MVP já possui home, modais de login e reset).
  - Cartilha de roteamento: `/` (landing estática), `/catalogo`, `/curso/[id]`, `/biblioteca`, `/loja`, `/admin`.
  - Consumo de APIs via `fetch`/React Query; autenticação com tokens JWT armazenados em cookies httpOnly.
- **Backend**: FastAPI servindo APIs REST e webhooks (login/reset implementados, seed configurado).
  - Hospedagem inicial sugerida: Railway (Free/Tier baixo) ou Render (Starter) com autosleep, reduzindo custo.
  - Estrutura modular (routers por domínio) + SQLAlchemy e Alembic para migrações.
- **Banco de Dados**: PostgreSQL gerenciado (Railway/Render/PostgresSupabase). Plano inicial: 1GB gratuito/baixo custo com upgrade simples.
- **Armazenamento de Arquivos**:
  - Vídeos: Mux (paga por minuto mas escala gradualmente) ou alternativa low-cost com Bunny Stream (pay-as-you-go).
  - Materiais (PDF, EPUB, ZIP): Cloudflare R2 (baixo custo e egress gratuito para Cloudflare) ou Backblaze B2.
- **Entrega de Conteúdo**:
  - CDN para vídeos via provedor escolhido.
  - Arquivos protegidos com URLs assinadas (pré-assinatura S3 API compatible) + marca d'água opcional.
- **Pagamentos**: Stripe (internacional) ou Pagar.me (BR). Inicialmente Stripe por simplicidade e boa documentação; fallback com Mercado Pago se necessário.
- **Autenticação**:
  - MVP utiliza FastAPI + JWT manual (token único de acesso e refresh planejado).
  - OAuth social (Google) planejado para fase posterior.
- **Observabilidade**:
  - Logs estruturados no backend (Loguru + envio para Railway/Render).
  - Monitoramento uptime gratuito (Better Stack, UptimeRobot).
- **CI/CD**:
  - GitHub Actions: lint + testes + build. Deploy automático para Vercel (frontend) e Railway/Render (backend) via API tokens.

## Fluxo de Deploy
1. Landing page atual continua servida pelo build estático (branch principal/Vercel).
2. Monorepo já estruturado com `apps/web` e `apps/api`; manter pipelines separados.
3. Para releases do MVP EAD:
  - Backend: Railway/Render com deploy via CI (rodar migrations antes do release).
  - Frontend: Vercel (App Router). Configure variáveis `NEXT_PUBLIC_API_BASE_URL`/`NEXT_PUBLIC_SITE_URL`.
4. Enquanto a landing antiga estiver ativa, mantenha scripts Tailwind (`npm run build:css`) disponíveis para hotfixes.

## Considerações de Custo
- **Vercel**: Plano gratuito dá direito a deploys ilimitados com limites de 100GB/h mês de bandwidth.
- **Railway/Render**: plano gratuito com crédito/mês; autosleep a cada 50 min ocioso, suficiente em MVP.
- **PostgreSQL**: 512MB/1GB grátis (Railway) ou $7/m (Render starter).
- **Mux/Bunny**: paga conforme uso; iniciar com pacotes mínimos (Mux ~US$0.12 por hora de streaming).
- **Cloudflare R2**: $0.015/GB armazenado, sem egress para Cloudflare (utilizar Workers para fornecer URLs assinadas).
- **Stripe**: 3.99% + R$0.39 por transação (BR via Stripe Brazil); sem custo fixo.

## Bibliotecas e Serviços Recomendados
- FastAPI stack: `fastapi`, `uvicorn`, `sqlalchemy`, `alembic`, `pydantic`, `fastapi-users`, `httpx`.
- Next.js stack: `@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`, `@tanstack/react-query`, `zod`, `axios` ou `ky`.
- Infra: Docker, docker-compose, GitHub Actions, Railway CLI, Vercel CLI.

## Roadmap Técnico (Resumo)
1. Estruturar monorepo e pipelines CI.
2. Implementar backend com autenticação e modelos principais.
3. Desenvolver frontend Next.js com MUI, integrando APIs.
4. Configurar infraestrutura de conteúdo (vídeo + materiais) e pagamentos.
5. Realizar QA, monitoramento e plano de lançamento.

## Próximos Passos Imediatos
- Validar provedor (Railway vs Render) conforme custo e ciclos de sleep.
- Automatizar pipeline de deploy (GitHub Actions) para lint/test + publish.
- Conectar React Query ao backend (`/dashboard/me`) e desenhar layout do dashboard.
- Prototipar entrega de conteúdo (Mux/Bunny) e fluxo de pagamentos (Stripe ou alternativa local).
- Atualizar backlog continuamente alinhado a este plano.
