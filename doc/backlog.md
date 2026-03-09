# Backlog do Projeto Tia Maria EAD

Este arquivo é utilizado pelos agentes de IA para controlar e atualizar o status das atividades do projeto. Sempre que uma tarefa for iniciada, atualizada ou concluída, marque-a aqui com o status apropriado.

## Fases do Projeto EAD (Pendente)

### Fase 0 – Estratégia e Governança
- [ ] Validar escopo EAD com stakeholders e definir entregas incrementais.
- [ ] Mapear requisitos legais (LGPD, direitos autorais) e registrar políticas internas.
- [ ] Definir métricas de sucesso (retenção, conclusão de curso, conversão) e painéis simples (planilha ou Looker Studio gratuito).
- [ ] Escolher provedores alinhados ao menor custo (Railway vs Render, Stripe vs Pagar.me) e documentar decisão.

### Fase 1 – Arquitetura e Base Técnica
- [ ] Organizar monorepo com `apps/landing`, `apps/web (Next.js)`, `apps/api (FastAPI)` preservando deploy atual na Vercel.
- [ ] Configurar Docker + docker-compose locais e GitHub Actions (lint/test) para web e api.
- [ ] Configurar projetos na Vercel (frontend) e Railway/Render (backend + Postgres) em modo free tier.
- [ ] Criar documentação técnica (ver `doc/ead_arquitetura.md`) e manter atualizações.

### Fase 2 – Backend EAD
- [ ] Modelar banco (usuários, cursos, módulos, aulas, matrículas, pagamentos, materiais) com SQLAlchemy/Alembic.
- [ ] Implementar autenticação com `fastapi-users`, JWT e refresh tokens (cookies httpOnly).
- [ ] Integrar Stripe (checkout, webhooks) e criar fallback plan para gateway nacional.
- [ ] Implementar serviço de entrega segura (Mux/Bunny + URLs assinadas para materiais em Cloudflare R2).
- [ ] Configurar Celery/Redis (ou background tasks nativas) para emails e processamento assíncrono considerando custo.

### Fase 3 – Frontend Next.js + MUI
- [ ] Criar design system MUI (tema, tipografia, tokens) e componentes base (AppBar, Sidebar, Cards).
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
- [ ] Melhorar acessibilidade do modal de login - Status: Em andamento

## Tarefas Concluídas
- [x] Corrigir contador de senhas para desconsiderar status `CANCELADA` e recompor disponibilidade após cancelamento no backoffice - Status: Concluída em 09/03/2026
- [x] Hotfix de data inválida nos cards da home (`NaN undefined ...`) com normalização do campo `data` na API pública e fallback robusto no formatter de data do frontend - Status: Concluída em 09/03/2026
- [x] Refinar estilo do botão `Senha de Atendimento` por tipo de card na home, com variações visuais contextualizadas e contraste adequado sem alterar o destino `/senhas` - Status: Concluída em 09/03/2026
- [x] Refinar responsividade do botão `Senha de Atendimento` nos cards da home com rótulo curto em mobile (`Senha`) e rótulo completo em desktop (`Senha de Atendimento`) mantendo link para `/senhas` - Status: Concluída em 09/03/2026
- [x] Ajustar cards da home para exibir giras em janela D-1 (ontem em diante) e incluir botão `Senha de Atendimento` com destino `/senhas` nos cards de gira, mantendo exclusão no card de aviso e responsividade do bloco de ações - Status: Concluída em 09/03/2026
- [x] Integrar cadastro de giras do `/admin` com cards automáticos da home usando templates componentizados existentes (novo `tipo_card`, API pública `/api/public/giras/cards`, select fixo de tipo no admin e render dinâmico na `index.html`) - Status: Concluída em 09/03/2026
- [x] Implementar fila por ordem de chegada com prioridade preferencial (check-in na porta, ordenação backend, ação de check-in em `/admin/porta` e `Lista de Senhas`, checkbox preferencial em `/senhas`, atualização de e-mail de confirmação) - Status: Concluída em 09/03/2026
- [x] Corrigir timezone de atendimento (UTC-3) no modo local via normalização de timestamps SQLite para ISO UTC no backend - Status: Concluída em 03/03/2026
- [x] Corrigir responsividade mobile das rotas de operação (`/admin`, `/admin/porta`, `/senhas`) e ajustar encoding UTF-8 para nomes com acentuação no ambiente local - Status: Concluída em 03/03/2026
- [x] Adicionar modo de teste local com SQLite (adapter em `server/db.js`, migration SQLite, script `setup:sqlite` e instruções no README) - Status: Concluída em 03/03/2026
- [x] Melhorar navegação de topo com toggle visual entre `Admin` e `Porta` (estado ativo/inativo, alinhamento e textos centralizados) em `admin/index.html` e `admin/porta.html` - Status: Concluída em 03/03/2026
- [x] Alinhar paleta de cores do header da página admin com a paleta do header da landing (`index.html`) - Status: Concluída em 03/03/2026
- [x] Substituir modal de Nova/Editar Gira por drawer lateral no admin, mantendo os mesmos campos e salvamento - Status: Concluída em 03/03/2026
- [x] Melhorar usabilidade da aba `Config Senhas` no admin (badge antes de `Gira: ...` e campos empilhados verticalmente) - Status: Concluída em 03/03/2026
- [x] Ajustar largura da aba `Config Senhas` para ocupar 1/3 da página em telas grandes, mantendo full width no mobile - Status: Concluída em 03/03/2026
- [x] Substituir a aba `Config Senhas` por drawer lateral acionado por ícone de senha na lista de giras, mantendo ações de salvar/liberar/encerrar - Status: Concluída em 03/03/2026
- [x] Atualizar cards de novidades para recesso e agenda de janeiro/2026 (Ritual Coletivo Oxóssi 28/01 e Gira de Caboclos 30/01) - Status: Concluída em 21/12/2025
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

## Instruções para Agentes

- Use checkboxes para marcar status: [ ] Pendente, [/] Em andamento, [x] Concluída.
- Adicione novas tarefas conforme necessário.
- Inclua data de conclusão ou atualização.
- Mantenha o arquivo organizado por prioridade.</content>
<parameter name="filePath">e:\Estudos\Projetos_Dev\Tia Maria\tia_maria_ead\doc\agente.md