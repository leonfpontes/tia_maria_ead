# Modelagem de Banco de Dados – Plataforma EAD

## Tabelas principais

### 1. users
- id (PK, UUID)
- nome
- email (único)
- senha_hash
- tipo (enum: 'admin', 'aluno')
- ativo (bool)
- criado_em (timestamp)
- atualizado_em (timestamp)

### 2. password_reset_tokens
- id (PK, UUID)
- user_id (FK -> users.id)
- token (string, único)
- criado_em (timestamp)
- expira_em (timestamp)
- usado (bool)
- ip_solicitante (string)

### 3. cursos
- id (PK, UUID)
- nome
- descricao
- ativo (bool)
- criado_em (timestamp)

### 4. user_cursos
- id (PK, UUID)
- user_id (FK -> users.id)
- curso_id (FK -> cursos.id)
- liberado_em (timestamp)

### 5. certificados
- id (PK, UUID)
- user_id (FK -> users.id)
- curso_id (FK -> cursos.id)
- url_certificado (string)
- conquistado_em (timestamp)

### 6. login_logs
- id (PK, UUID)
- user_id (FK -> users.id)
- ip (string)
- agente (string)
- sucesso (bool)
- criado_em (timestamp)

## Observações
- Todos os campos de texto devem usar encoding UTF-8.
- Labels e mensagens em pt-BR.
- Tokens de recuperação devem expirar em 2 horas.
- Logs detalham tentativas de login (sucesso/falha).
- Relacionamentos bem definidos para garantir integridade.

---

Esta modelagem cobre todos os requisitos do login, tipos de usuário, recuperação de senha, cursos, certificados e logs, pronta para implementação no backend FastAPI + SQLAlchemy/Alembic.