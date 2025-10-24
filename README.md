# Terreiro Tia Maria & Cabocla Jupira – Website + Plataforma EAD

Este repositório reúne:

1. **Landing page estática** (HTML + Tailwind) – já em produção na Vercel, fácil de editar.
2. **Plataforma EAD em construção** – monorepo com frontend (Next.js + MUI) e backend (FastAPI) prontos para evolução gradual.

Tudo foi organizado para que até iniciantes consigam rodar, testar e contribuir sem sustos.

---

## 🧰 Pré-requisitos

| Ferramenta | Para quê? | Como verificar |
|------------|-----------|----------------|
| **Node.js 20+** | Scripts, Tailwind e frontend | `node --version` |
| **npm** (vem com Node) | Instalar pacotes | `npm --version` |
| **Docker Desktop** (opcional, mas recomendado) | Subir banco + backend rapidamente | Abra o app e verifique se está rodando |
| **Python 3.12+** (opcional) | Caso queira rodar o backend sem Docker | `python --version` |

> Dica: se ainda não usa Docker, tudo continua funcionando; você só precisará instalar dependências manualmente quando chegar na parte EAD.

---

## 🚀 Primeiros Passos (clonar e preparar)

```bash
git clone https://github.com/leonfpontes/tia_maria_ead.git
cd tia_maria_ead

# Dependências da landing (Tailwind, http-server)
npm install

# Dependências do frontend Next.js
npm install --prefix apps/web
```

Pronto! A partir daqui você escolhe o que quer rodar.

---

## 🌐 Rodar apenas a landing page

Pensado para quem quer editar o site atual rapidamente.

```bash
npm start
```

- Abre `http://localhost:8080`.
- Tailwind é recompilado e servido automaticamente.
- Para parar, use `Ctrl + C` no terminal.

Outros comandos úteis:

- `npm run build:css` – gera o CSS final.
- `npm run watch:css` – recompila o CSS sempre que você salvar o arquivo de entrada.

---

## 📚 Rodar a plataforma EAD (stack completa)

> O jeito mais fácil é usar os scripts prontos. Tudo é orquestrado por Docker (banco + API) e Next.js.

### 1. Subir tudo junto (recomendado)

```bash
npm run dev:stack
```

- Sobe banco PostgreSQL, API FastAPI e frontend Next.js.
- URLs padrão:
  - Frontend: `http://localhost:3000`
  - API: `http://localhost:8000/docs`

Primeira execução? Rode as migrações e o seed (uma vez):

```bash
docker compose run --rm api bash -c "export PYTHONPATH=/app && alembic upgrade head"
docker compose run --rm api bash -c "export PYTHONPATH=/app && python -m app.db.seed"
```

Depois disso, só `npm run dev:stack`. Para manter em background use `docker compose up -d`.

### 2. Subir serviços separados

- **Somente backend (FastAPI + Postgres)**:
  ```bash
  npm run dev:backend
  ```
- **Somente frontend (Next.js + MUI)**:
  ```bash
  npm run dev:frontend
  ```

> Sempre que quiser desligar, use `Ctrl + C`. Para limpar os contêineres do Docker Compose, rode `docker compose down`.

### 3. Rodar o backend sem Docker (opcional)

```bash
cd apps/api
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> Lembre de exportar `DATABASE_URL` e `SECRET_KEY` ou criar um arquivo `.env` (veja `doc/backend.md`).

---

## 🗂️ Estrutura de Pastas

```
.
├── index.html              # Landing page atual
├── package.json            # Scripts e dependências da landing + automações
├── docker-compose.yml      # Stack EAD (db, api, web)
├── apps/
│   ├── api/                # Backend FastAPI + Alembic
│   └── web/                # Frontend Next.js + MUI
├── assets/                 # CSS/JS/imagens da landing
├── doc/
│   ├── agente.md           # Guia para agentes/colaboradores
│   ├── backlog.md          # Roadmap e status
│   ├── backend.md          # Passo a passo do backend EAD
│   ├── frontend.md         # Passo a passo do frontend EAD
│   └── ead_arquitetura.md  # Plano completo da plataforma EAD
└── ...
```

---

## ✅ Integração Contínua

- Workflow GitHub Actions em `.github/workflows/ci.yml` roda em push/PR para `main`, `develop` e branches `feat/*`.
- Job **Frontend Lint** usa Node 20, instala dependências e executa `npm run lint --prefix apps/web`.
- Job **Backend Checks** usa Python 3.12, instala requisitos da API, roda `python -m compileall` para garantir sintaxe e finaliza com `pytest`.
- Ajuste ou adicione novas verificações conforme surgirem testes ou ferramentas extras (ex.: Ruff, MyPy, Playwright).

---

## ☁️ Deploy (Vercel + Railway)

- **Vercel (Next.js em `apps/web`)**:
  - Crie um projeto apontando para este repositório e defina `Root Directory` como `apps/web`.
  - Configure `Install Command`: `npm ci` e `Build Command`: `npm run build` (defaults do Next).
  - Defina variáveis `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL` e, se necessário, `NODE_OPTIONS=--max_old_space_size=4096`.
- **Railway (FastAPI em `apps/api`)**:
  - Crie um serviço Python e conecte o repositório; Railway detecta o `Dockerfile` ou use Nixpacks.
  - `Start Command`: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
  - Anexe banco PostgreSQL gratuito; Railway injeta `DATABASE_URL`. Complete com `SECRET_KEY` e `FRONTEND_BASE_URL`.
  - Rode migrações/seed com `railway run alembic upgrade head` e `railway run python -m app.db.seed`.
- Instruções detalhadas nos guias `doc/frontend.md` e `doc/backend.md`.

---

## 🔐 Usuários e Fluxo de Login

- Seed padrão cria:
  - Admin: `admin@tiamariaead.com` / senha `admin123`
  - Aluno: `aluno@tiamariaead.com` / senha `aluno123`
- A home do Next.js abre diálogos MUI para login e recuperação.
- Tokens JWT ficam no `localStorage` (`tia-maria-auth` e `tia-maria-token`).
- `/?login=1` ou `/?forgot=1` na URL forçam abertura dos diálogos (útil para testes).
- Redefinição de senha disponível em `/reset-password?token=...` (link enviado pelo endpoint de reset).
- A landing estática (`index.html`) chama `POST /auth/login` da API real; se a API estiver em outro domínio, configure a base antes de carregar `assets/js/auth.js`.

## 🔄 Landing + API (CORS e Base URL)

- A landing consome o backend definido em `data-api-base` no elemento `<html>` (default `http://localhost:8000`).
- Produção pode configurar `window.__TIA_MARIA_API_BASE__ = "https://api.seudominio";` antes de importar `assets/js/auth.js`.
- `app/main.py` usa `CORSMiddleware`; exports adicionais podem ser feitos via env `CORS_ORIGINS='["https://site.com","https://app.vercel.app"]'`.
- Quando surgir erro `CORS`, execute `docker compose up --build -d api` para aplicar mudanças na API.
- Logs relevantes aparecem com `docker compose logs -f api` para depurar respostas `401/500`.

---

## 🎨 Personalizar a Landing Page

- **Cores e tokens**: `assets/css/main.css` (variáveis CSS inspiradas em Oxóssi e Xangô).
- **Layout**: edite `index.html` usando classes Tailwind.
- **JS**: `assets/js/auth.js` integra com o FastAPI (`POST /auth/login`) e mantém compatibilidade com o legado.
- **Imagens**: troque arquivos em `assets/img/`.

---

## 🧑‍💻 Fluxo de Contribuição

1. Se estiver na `main` (ou mesmo já na `feat(ead)-branch-main-ead-001`), troque/permaneça na branch intermediária e atualize: `git checkout feat(ead)-branch-main-ead-001 && git pull`.
2. Crie uma branch filha a partir dela para cada entrega: `git checkout -b feat/descricao`.
3. Implementou? Rode os comandos necessários, atualize documentação e volte para a base: `git checkout feat(ead)-branch-main-ead-001`.
4. Ao meu comando (ou decisão de integração), faça `git merge feat/descricao`, resolva conflitos e apenas então suba o estágio consolidado.
5. Commits em português, mensagens claras: `git commit -m "feat: adiciona player de vídeo"`.
6. PRs e pushes sempre miram `feat(ead)-branch-main-ead-001`. A `main` só recebe a plataforma quando concluirmos todas as fases EAD.

### Boas práticas importantes

- **Acessibilidade sempre**: cabeçalhos semânticos, `alt` nas imagens, foco visível.
- **Responsividade testada**: mobile first.
- **Logs e documentação**: descreva mudanças relevantes para facilitar o trabalho do próximo dev.

---

## 📖 Documentação complementar

- [doc/ead_arquitetura.md](doc/ead_arquitetura.md) – visão geral da arquitetura e decisões de custo.
- [doc/backend.md](doc/backend.md) – referência rápida do backend.
- [doc/frontend.md](doc/frontend.md) – guia do frontend Next.js/MUI.
- [doc/ead_db_model.md](doc/ead_db_model.md) – modelagem das tabelas de usuários, cursos, certificados e logs.
- [doc/ead_auth_flow.md](doc/ead_auth_flow.md) – fluxos de login, recuperação de senha e segurança.
- [doc/backlog.md](doc/backlog.md) – lista de tarefas atualizada.

> Nota: `main` permanece dedicada à landing em produção (agenda e comunicados). Atualizações rápidas da agenda continuam sendo aplicadas diretamente na `main` até a migração final da plataforma EAD.

---

## 🤝 Suporte

- **Issues**: abra no GitHub para bugs ou ideias.
- **Contato direto**: `terreirotiamariaecaboclajupira@outlook.com`.

Projeto aberto para a comunidade, com respeito à tradição da Umbanda. Faça bom uso e compartilhe melhorias 🙌.

