# Guia do Backend EAD

## Stack
- **Framework**: FastAPI 0.112 + Pydantic v2 (settings).
- **ORM**: SQLAlchemy 2.0 com sessionmaker.
- **Migrações**: Alembic (versões em `alembic/versions`).
- **Autenticação**: JWT manual com `python-jose` + senhas `passlib[bcrypt]`.
- **Banco**: PostgreSQL (compose local ou instância externa).

## Estrutura
```
apps/api
├── Dockerfile
├── requirements.txt
├── alembic.ini
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
└── app/
  ├── main.py
  ├── api/
  │   ├── __init__.py
  │   ├── auth.py
  │   ├── auth_password_reset.py
  │   └── routes/
  │       ├── __init__.py
  │       └── health.py
  ├── core/
  │   ├── config.py
  │   ├── email.py
  │   └── security.py
  ├── db/
  │   ├── base.py
  │   └── session.py
  ├── models/
  │   ├── certificado.py
  │   ├── curso.py
  │   ├── login_log.py
  │   ├── password_reset_token.py
  │   ├── user.py
  │   └── user_curso.py
  └── schemas/
  ├── auth.py
  ├── dashboard.py
  └── user.py
```

## Configuração
- Variáveis `.env` (Pydantic Settings):
  - `DATABASE_URL`: URL SQLAlchemy (`postgresql+psycopg2://user:pass@host:5432/db`). Default cobre o compose (`tiamaria/tiamaria@db`).
  - `SECRET_KEY`: chave para tokens JWT (default `changeme`, troque em produção).
  - `ACCESS_TOKEN_EXPIRE_MINUTES`: expiração do JWT (default 1440 min).
  - `FRONTEND_BASE_URL`: usado para montar o link de redefinição enviado por e-mail (default `http://localhost:3000`).
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`: credenciais SMTP; se não configurado, o serviço loga o link no console container (`[email-dev]`).
  - `CORS_ORIGINS`: lista JSON com origens liberadas para o `CORSMiddleware` (ex.: `'["https://site.com","https://app.vercel.app"]'`). Caso não setado, libera `http://localhost:3000` e `http://localhost:8080` por padrão.

## Segurança e Autenticação
- Hash de senha com `passlib[bcrypt]`; comparação e geração centralizadas em `core/security.py`.
- JWT assinado com `python-jose[cryptography]` (payload inclui `sub` e `tipo`, expira em 24h por padrão).
- Modelos disponíveis: usuários (admin/aluno), cursos, matrículas (`user_curso`), certificados, logs de login, tokens de recuperação (validade 2h, uso único).
- Rotas expostas:
  - `POST /auth/login`: valida credenciais, registra log, retorna token e dados básicos.
  - `POST /auth/register`: cria usuário (auxiliar para MVP).
  - `POST /auth/request-password-reset`: gera token, registra IP e dispara e-mail.
  - `POST /auth/reset-password`: aplica nova senha e invalida token.
  - `GET /health`: verificação simples de disponibilidade.
  - `GET /dashboard/me`: (placeholder) retorna cursos/certificados do usuário autenticado.

## Execução Local
- Ambiente Python manual:
  ```bash
  cd apps/api
  python -m venv .venv && .venv\Scripts\activate
  pip install -r requirements.txt
  export PYTHONPATH=/app  # se necessário
  uvicorn app.main:app --reload
  ```
- Docker Compose (recomendado):
  ```bash
  npm run dev:backend      # API + Postgres
  npm run dev:stack        # API + Postgres + Next.js
  ```
- Para rodar detached: `docker compose up -d`. Logs em `docker compose logs -f api`.
- Alterações em CORS exigem redeploy da API (`docker compose up --build -d api`) para garantir que o middleware leia o novo ambiente.

## Migrações e Seed
- Criar revisão: `alembic revision -m "mensagem"` (executar dentro de `apps/api`).
- Aplicar localmente: `alembic upgrade head`.
- Com Docker Compose:
  ```bash
  docker compose run --rm api bash -c "export PYTHONPATH=/app && alembic upgrade head"
  docker compose run --rm api bash -c "export PYTHONPATH=/app && python -m app.db.seed"
  ```
- Seed padrão cria usuários `admin@tiamariaead.com` (`admin123`), `aluno@tiamariaead.com` (`aluno123`), curso “Fundamentos da Umbanda” e certificado vinculado.

## Deploy (Railway ou Render)
- **Railway (recomendado para MVP)**
  - Crie um novo projeto, selecione “Deploy From GitHub” e aponte para `apps/api` ou use `railway init` localmente.
  - O template Python usa Nixpacks automaticamente. Ajuste `Start Command` para `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
  - Anexe um banco PostgreSQL gratuito; Railway exporta `DATABASE_URL`. Configure `SECRET_KEY`, `FRONTEND_BASE_URL`, `CORS_ORIGINS` (JSON) e qualquer credencial SMTP.
  - Migrações/seed rodando direto do painel ou CLI: `railway run alembic upgrade head` e `railway run python -m app.db.seed`.
  - Logs: `railway logs` ou painel; monitore consumo mensal de créditos.
- **Render (alternativa)**
  - Crie um `Web Service` apontando para `apps/api` com `Environment = Python`.
  - `Build Command`: `pip install -r apps/api/requirements.txt`. `Start Command`: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
  - Adicione um banco PostgreSQL (seção `Add Database`) e copie a URI para `DATABASE_URL`.
  - Configure `SECRET_KEY`, `FRONTEND_BASE_URL`, `CORS_ORIGINS` e SMTP.
  - Rodar migrações via shell: `render exec` ou job temporário.

## Lifespan e inicialização
- `app.main` usa um `lifespan` assíncrono (async contextmanager) preparado para futuros hooks.
- O container espera o startup completar; logs ficam disponíveis via `docker compose logs -f api`.

## Próximos Passos
- Expandir domínio (módulos/aulas, pagamentos, relatórios) com novas migrations.
- Introduzir refresh tokens/httpOnly cookies e bloqueio de conta por tentativas falhas.
- Adicionar testes automatizados (pytest) cobrindo rotas e utilitários.
- Automatizar tasks na inicialização (rodar migrations/seed) ou via scripts Make/Invoke.
- Configurar logging estruturado e observabilidade (Sentry/UptimeRobot).
