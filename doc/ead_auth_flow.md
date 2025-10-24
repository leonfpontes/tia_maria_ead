# Fluxo de Autenticação – Plataforma EAD

## 1. Login
- A home (`/`) exibe botão “Fazer login” ou abre automaticamente o diálogo quando a URL contém `?login=1` (ex.: rota `/login`).
- `LoginDialog` (MUI) coleta e-mail/senha e envia `POST /auth/login`.
- Backend valida credenciais, registra `login_logs`, responde com `{ token, nome, email, tipo }`.
- Frontend persiste `tia-maria-auth` e `tia-maria-token` no `localStorage`, fecha o modal e exibe estado de usuário (boas-vindas + CTA dashboard + botão “Sair”).
- Tipos suportados: `admin`, `aluno` (seed inclui ambos).

## 2. Recuperação de Senha
- Link “Recuperar acesso” dentro do login abre `ForgotPasswordDialog` (ou `/?forgot=1`).
- `POST /auth/request-password-reset` gera token (2h, uso único), salva IP e retorna mensagem sempre amigável.
- Backend envia e-mail HTML; sem SMTP configurado ele loga o link (`[email-dev] ... /reset-password?token=`) no console.
- Frontend exibe alerta de sucesso ou erro.

## 3. Redefinição de Senha
- Usuário acessa `/reset-password?token=...` via link recebido.
- Página valida presença do token, força senhas iguais (mínimo 8 caracteres) e envia `POST /auth/reset-password`.
- Backend marca token como usado, atualiza `senha_hash` e responde mensagem.
- Frontend mostra alerta verde e redireciona para `/` após alguns segundos.

## 4. Logout
- Botão “Sair” remove dados do `localStorage` e volta ao estado visitante.
- (Próximo passo: invalidar token server-side em lista de revogação, se necessário).

## 5. Segurança
- JWT assinado (`HS256`), expira em 24h (configurável).
- Bcrypt (`passlib`) para senhas; nunca armazenar senhas planas.
- Tokens de recuperação expiram em 2h (`expira_em`) e registram IP do solicitante.
- Logs de login diferenciam sucesso/falha para auditoria.
- Seed cria dados de teste: `admin@tiamariaead.com`/`admin123`, `aluno@tiamariaead.com`/`aluno123`.

## 6. Stack de UI
- `LoginDialog` / `ForgotPasswordDialog`: `Dialog`, `TextField`, `Button`, `Alert`, `Link`.
- Página de reset: `Container`, `Card`, `Typography`, `TextField`, `Alert`, `Button`.
- Home autenticada: `Paper`, `Stack`, `Typography`, `Button` (CTA dashboard + logout).

## 7. Landing Estática
- `assets/js/auth.js` chama `POST /auth/login` diretamente; a origem padrão (`http://localhost:8080`) já está liberada no `CORSMiddleware`.
- Produção deve definir o host da API com `window.__TIA_MARIA_API_BASE__` ou `data-api-base` no `<html>`.
- O script mantém compatibilidade com o `localStorage` legado (`auth`) e salva a sessão moderna em `tia-maria-auth`/`tia-maria-token`.
- Erros de CORS ou rede aparecem no console; repetir `docker compose up --build -d api` após alterar origens.
- Quando o usuário estiver autenticado, os menus "Catálogo EAD" (`data-ead-base`, padrão `/catalogo`) e "Área do Aluno" (`data-aluno-base`, padrão `/dashboard`) geram links para o app Next.js anexando o JWT via query string (`?token=...`). Se o perfil for admin, o menu troca automaticamente para "Área Administrativa" e usa `data-admin-base` (padrão `/admin`). O app consome o token na primeira carga, persiste novamente em `localStorage` e remove o parâmetro da barra de endereço.

---

Fluxo validado com Docker Compose (`npm run dev:stack`) e seed inicial. Ajustes futuros incluem refresh tokens, contexto global de usuário e menu de perfil completo na AppBar.