# Guia do Backend EAD

## Stack
- **Framework**: FastAPI 0.112 com Pydantic v2.
- **ORM**: SQLAlchemy 2.0 + sessionmaker.
- **Migrações**: Alembic.
- **Autenticação**: `fastapi-users` (JWT) — a ser configurado.
- **Banco**: PostgreSQL.

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
    │   └── routes/
    │       ├── __init__.py
    │       └── health.py
    ├── core/
    │   └── config.py
    ├── db/
    │   ├── base.py
    │   └── session.py
    ├── models/      # em breve
    └── schemas/     # em breve
```

## Configuração
- Variáveis `.env` (carregadas por Pydantic):
  - `DATABASE_URL`: URL SQLAlchemy (ex: `postgresql+psycopg2://user:pass@host:5432/db`).
  - `SECRET_KEY`: chave aleatória para tokens JWT.
  - `ACCESS_TOKEN_EXPIRE_MINUTES`: (opcional) tempo de expiração.

## Execução Local
- Ambiente Python manual:
  ```
  cd apps/api
  python -m venv .venv && .venv\Scripts\activate
  pip install -r requirements.txt
  uvicorn app.main:app --reload
  ```
- Atalho pelo monorepo (Docker Compose):
  ```
  npm run dev:backend
  ```
- Subir toda a stack (db + api + web): `npm run dev:stack`.

## Migrações
- Criar nova revisão: `alembic revision -m "mensagem"`.
- Aplicar: `alembic upgrade head`.

## Próximos Passos
- Criar modelos iniciais (User, Course, Lesson, Material, Enrollment, Payment).
- Configurar `fastapi-users` com tabelas customizadas e rotas de autenticação.
- Implementar camadas de serviço e repositório.
- Adicionar testes (pytest) e logs estruturados (loguru / structlog).
