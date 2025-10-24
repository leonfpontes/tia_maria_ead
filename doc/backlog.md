# Backlog do Projeto Tia Maria EAD

Este arquivo é utilizado pelos agentes de IA para controlar e atualizar o status das atividades do projeto. Sempre que uma tarefa for iniciada, atualizada ou concluída, marque-a aqui com o status apropriado.

> Branch de trabalho contínuo: `feat(ead)-branch-main-ead-001`. Sempre que for iniciar algo (esteja na `main` ou já na staging), rode `git checkout feat(ead)-branch-main-ead-001 && git pull`, crie uma branch filha e só depois implemente. Cada fase concluída é mergeada de volta nessa base intermediária e só então promovida para `main` quando a plataforma EAD estiver pronta. A `main` segue servindo a landing em produção (agenda atualizada manualmente).

## Fases do Projeto EAD (Pendente)

### Fase 0 – Estratégia e Governança
- [ ] Validar escopo EAD com stakeholders e definir entregas incrementais.
- [ ] Mapear requisitos legais (LGPD, direitos autorais) e registrar políticas internas.
- [ ] Definir métricas de sucesso (retenção, conclusão de curso, conversão) e painéis simples (planilha ou Looker Studio gratuito).
- [ ] Escolher provedores alinhados ao menor custo (Railway vs Render, Stripe vs Pagar.me) e documentar decisão.

### Fase 1 – Arquitetura e Base Técnica
- [x] Organizar monorepo com `apps/landing`, `apps/web (Next.js)`, `apps/api (FastAPI)` preservando deploy atual na Vercel. (23/10/2025)
- [x] Configurar Docker + docker-compose locais e GitHub Actions (lint/test) para web e api. – Compose validado em 24/10/2025; CI adicionado em 24/10/2025 (`.github/workflows/ci.yml`).
- [x] Configurar projetos na Vercel (frontend) e Railway/Render (backend + Postgres) em modo free tier – Playbook documentado em 24/10/2025 (ver `README.md`, `doc/frontend.md`, `doc/backend.md`).
- [x] Criar documentação técnica (ver `doc/ead_arquitetura.md`, `doc/frontend.md`, `doc/backend.md`) e manter atualizações. (23/10/2025)

### Fase 2 – Backend EAD
- [x] Modelar banco (usuários, cursos, matrículas, certificados, logs) com SQLAlchemy/Alembic – migration aplicada em 24/10/2025.
- [ ] Evoluir autenticação com refresh tokens (cookies httpOnly) e hardening (rate limit, bloqueio de IP).
- [x] Entregar fluxo mínimo de login/recuperação de senha (JWT + tokens de reset + email HTML) – API pronta e validada em 24/10/2025.
- [ ] Integrar Stripe (checkout, webhooks) e criar fallback plan para gateway nacional.
- [ ] Implementar serviço de entrega segura (Mux/Bunny + URLs assinadas para materiais em Cloudflare R2).
- [ ] Configurar Celery/Redis (ou background tasks nativas) para emails e processamento assíncrono considerando custo.

### Fase 3 – Frontend Next.js + MUI
- [x] Criar design system MUI (tema, tipografia, tokens) e componentes base (AppBar, Sidebar, Cards) – 24/10/2025 (inclui AppChrome, Hero, cards de dashboard e curso).
- [x] Construir experiência de login/recuperação (modais, página de redefinição, integração API) – fluxo end-to-end concluído em 24/10/2025.
- [/] Integrar design system na homepage/dashboard, conectar dados reais e refinar UX (em andamento – roteamento admin/aluno implementado, investigar erro `toLowerCase` no dashboard do aluno).
- [ ] Implementar páginas públicas (landing migrada, catálogo, loja) consumindo API; manter HTML atual até go-live.
- [ ] Desenvolver área do aluno (dashboard, player, materiais, certificados, histórico de pagamentos).
- [ ] Criar painel administrativo (gestão de cursos, uploads, usuários) com `@mui/x-data-grid`.

### Fase 4 – Conteúdo e Operação
- [ ] Configurar pipeline de upload (admin → storage → transcodificação) com notificações.
- [ ] Implementar certificados PDF (WeasyPrint/ReportLab) e quizzes básicos.
- [ ] Integrar serviço de email baixo custo (AWS SES, Mailersend) para notificações transacionais.
- [ ] Criar fluxos de suporte e FAQ; adicionar canal de feedback in-app.

### Fase 5 – Lançamento e Sustentação
- [ ] Executar testes (unitários, integração, e2e com Playwright) e testes de carga mínimos.
- [ ] Configurar monitoramento (Sentry, UptimeRobot) e logging estruturado.
- [ ] Preparar plano de migração/conteúdo e onboarding de usuários pilotos.
- [ ] Realizar go-live incremental e coletar métricas para ajustes.

## Manutenção da Landing Atual
- [ ] Manter pipeline existente de deploy estático na Vercel funcionando em paralelo até migração total.
- [ ] Atualizar `README.md` com instruções para edições rápidas da landing sem build do monorepo.
- [ ] Avaliar automação simples (GitHub Action) para publicar alterações na landing com preview.

## Tarefas Legadas
- [ ] Implementar sistema de comentários nas novidades - Status: Pendente
- [ ] Adicionar seção de galeria de fotos - Status: Pendente
- [ ] Otimizar imagens para carregamento mais rápido - Status: Pendente
- [ ] Garantir acessibilidade dos diálogos de autenticação (landing + Next.js) - Status: Em andamento

## Tarefas Concluídas
- [x] Criar documentação para agentes (agente.md e backlog.md) - Status: Concluída em 23/10/2025
- [x] Analisar código completo do projeto - Status: Concluída em 23/10/2025
- [x] Atualizar README.md com instruções completas para execução e contribuição - Status: Concluída em 23/10/2025
- [x] Atualizar agente.md com instrução para sempre atualizar documentação ao final - Status: Concluída em 23/10/2025
- [x] Corrigir erro de instalação no Windows (remover script postinstall Unix) - Status: Concluída em 23/10/2025
- [x] Adicionar seção "Como Chegar" com mapa Google, endereço, horários de gira e recomendação de vestimenta - Status: Concluída em 23/10/2025
- [x] Trocar link do WhatsApp para https://api.whatsapp.com/message/5CVUD77PM674E1?autoload=1&app_absent=0 - Status: Concluída em 23/10/2025
- [x] Inverter posição do mapa e texto na seção "Como Chegar" (mapa na esquerda) - Status: Concluída em 23/10/2025
- [x] Remover card "Não haverá gira!" e dar destaque ao card "Gira de Caboclos" na seção de novidades - Status: Concluída em 23/10/2025
- [x] Destacar o card "Gira de Caboclos" com tons de verde e selo de próxima gira - 23/10/2025
- [x] Refinar responsividade geral (carrossel mobile, CTA do hero ajustada, mapa redes) - 23/10/2025
- [x] Implementar rolagem suave para navegação por âncoras - 23/10/2025
- [x] Adicionar botão flutuante "Voltar ao topo" responsivo - 23/10/2025
- [x] Criar documentação de modelagem de banco (`doc/ead_db_model.md`) - 24/10/2025
- [x] Documentar fluxo de autenticação (`doc/ead_auth_flow.md`) - 24/10/2025
- [x] Validar stack Docker (`npm run dev:stack`), aplicar migrações e seed com usuários de exemplo - 24/10/2025
- [x] Integrar login/recuperação no frontend Next.js (diálogos MUI + página de reset) - 24/10/2025
- [x] Ligar a landing estática ao backend FastAPI (auth.js + CORS para 8080) - 24/10/2025
- [x] Configurar CI inicial (lint Next + checagens FastAPI) - 24/10/2025
- [x] Documentar playbook de deploy Vercel + Railway - 24/10/2025

## Débitos Técnicos Abertos
- [ ] [BUG] Erro runtime na área do aluno (`TypeError: Cannot read properties of undefined (reading 'toLowerCase')`) ao acessar `localhost:3000` autenticado.
- [ ] [BUG] `npm run build` não roda se o dev server estiver ativo (trava em `.next/trace`).
- [ ] [BUG] Falta de testes/lint pós-merge: rodar `npm run lint` e testes após cada merge.
- [ ] [BUG] Falta de validação de fluxo de login/logout e navegação admin/aluno: garantir que o fluxo de autenticação e redirecionamento está correto para ambos os papéis.

## Instruções para Agentes

- Use checkboxes para marcar status: [ ] Pendente, [/] Em andamento, [x] Concluída.
- Adicione novas tarefas conforme necessário.
- Inclua data de conclusão ou atualização.
- Mantenha o arquivo organizado por prioridade.# Backlog do Projeto Tia Maria EAD

Este arquivo é utilizado pelos agentes de IA para controlar e atualizar o status das atividades do projeto. Sempre que uma tarefa for iniciada, atualizada ou concluída, marque-a aqui com o status apropriado.

> Branch de trabalho contínuo: `feat(ead)-branch-main-ead-001`. Sempre que for iniciar algo (esteja na `main` ou já na staging), rode `git checkout feat(ead)-branch-main-ead-001 && git pull`, crie uma branch filha e só depois implemente. Cada fase concluída é mergeada de volta nessa base intermediária e só então promovida para `main` quando a plataforma EAD estiver pronta. A `main` segue servindo a landing em produção (agenda atualizada manualmente).

## Fases do Projeto EAD (Pendente)

### Fase 0 – Estratégia e Governança
- [ ] Validar escopo EAD com stakeholders e definir entregas incrementais.
- [ ] Mapear requisitos legais (LGPD, direitos autorais) e registrar políticas internas.
- [ ] Definir métricas de sucesso (retenção, conclusão de curso, conversão) e painéis simples (planilha ou Looker Studio gratuito).
- [ ] Escolher provedores alinhados ao menor custo (Railway vs Render, Stripe vs Pagar.me) e documentar decisão.

### Fase 1 – Arquitetura e Base Técnica
- [x] Organizar monorepo com `apps/landing`, `apps/web (Next.js)`, `apps/api (FastAPI)` preservando deploy atual na Vercel. (23/10/2025)
- [x] Configurar Docker + docker-compose locais e GitHub Actions (lint/test) para web e api. – Compose validado em 24/10/2025; CI adicionado em 24/10/2025 (`.github/workflows/ci.yml`).
- [x] Configurar projetos na Vercel (frontend) e Railway/Render (backend + Postgres) em modo free tier – Playbook documentado em 24/10/2025 (ver `README.md`, `doc/frontend.md`, `doc/backend.md`).
- [x] Criar documentação técnica (ver `doc/ead_arquitetura.md`, `doc/frontend.md`, `doc/backend.md`) e manter atualizações. (23/10/2025)

### Fase 2 – Backend EAD
- [x] Modelar banco (usuários, cursos, matrículas, certificados, logs) com SQLAlchemy/Alembic – migration aplicada em 24/10/2025.
- [ ] Evoluir autenticação com refresh tokens (cookies httpOnly) e hardening (rate limit, bloqueio de IP).
- [x] Entregar fluxo mínimo de login/recuperação de senha (JWT + tokens de reset + email HTML) – API pronta e validada em 24/10/2025.
- [ ] Integrar Stripe (checkout, webhooks) e criar fallback plan para gateway nacional.
- [ ] Implementar serviço de entrega segura (Mux/Bunny + URLs assinadas para materiais em Cloudflare R2).
- [ ] Configurar Celery/Redis (ou background tasks nativas) para emails e processamento assíncrono considerando custo.

### Fase 3 – Frontend Next.js + MUI
- [x] Criar design system MUI (tema, tipografia, tokens) e componentes base (AppBar, Sidebar, Cards) – 24/10/2025 (inclui AppChrome, Hero, cards de dashboard e curso).
- [x] Construir experiência de login/recuperação (modais, página de redefinição, integração API) – fluxo end-to-end concluído em 24/10/2025.
- [/] Integrar design system na homepage/dashboard, conectar dados reais e refinar UX (em andamento).
- [ ] Implementar páginas públicas (landing migrada, catálogo, loja) consumindo API; manter HTML atual até go-live.
- [ ] Desenvolver área do aluno (dashboard, player, materiais, certificados, histórico de pagamentos).
- [ ] Criar painel administrativo (gestão de cursos, uploads, usuários) com `@mui/x-data-grid`.

### Fase 4 – Conteúdo e Operação
- [ ] Configurar pipeline de upload (admin → storage → transcodificação) com notificações.
- [ ] Implementar certificados PDF (WeasyPrint/ReportLab) e quizzes básicos.
- [ ] Integrar serviço de email baixo custo (AWS SES, Mailersend) para notificações transacionais.
- [ ] Criar fluxos de suporte e FAQ; adicionar canal de feedback in-app.

### Fase 5 – Lançamento e Sustentação
- [ ] Executar testes (unitários, integração, e2e com Playwright) e testes de carga mínimos.
- [ ] Configurar monitoramento (Sentry, UptimeRobot) e logging estruturado.
- [ ] Preparar plano de migração/conteúdo e onboarding de usuários pilotos.
- [ ] Realizar go-live incremental e coletar métricas para ajustes.

## Manutenção da Landing Atual
- [ ] Manter pipeline existente de deploy estático na Vercel funcionando em paralelo até migração total.
- [ ] Atualizar `README.md` com instruções para edições rápidas da landing sem build do monorepo.
- [ ] Avaliar automação simples (GitHub Action) para publicar alterações na landing com preview.

## Tarefas Legadas

## Tarefas Concluídas

## Instruções para Agentes
- Adicione novas tarefas conforme necessário.
- Inclua data de conclusão ou atualização.
- Mantenha o arquivo organizado por prioridade.</content>
