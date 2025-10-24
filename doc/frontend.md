# Guia do Frontend EAD

## Stack
- **Framework**: Next.js 14 (App Router) com React 18.
- **UI**: Material UI 6 + `@mui/material-nextjs` para integração com App Router.
- **Estado**: React Query disponível (a ser conectado aos endpoints).
- **Tipagem**: TypeScript com config gerenciada pelo Next.js.

## Estrutura
```
apps/web
├── Dockerfile
├── package.json
├── next.config.js
├── tsconfig.json
└── src
    ├── app
        │   ├── layout.tsx              # tema global e baseline CSS
    │   ├── page.tsx                # home híbrida (dashboard/landing) com novo layout
        │   ├── login.tsx               # redireciona para ?login=1 (mantém compatibilidade)
        │   ├── forgot-password.tsx     # redireciona para ?forgot=1
        │   └── reset-password.tsx      # página de redefinição via token
        ├── components
    │   ├── auth
    │   │   ├── LoginDialog.tsx
    │   │   └── ForgotPasswordDialog.tsx
    │   └── layout
    │       ├── AppChrome.tsx        # shell autenticado com AppBar + Drawer responsivo
    │       ├── navigation/NavLinks.tsx
    │       ├── hero/HeroSection.tsx
    │       └── dash/{CourseCard,SectionTitle,StatCard}.tsx
        └── providers
                └── theme-registry.tsx
├── public/.gitkeep             # garante pasta estática durante o build
```

## Boas Práticas
- Tema global e Emotion cache configurados em `theme-registry`; evite criar provedores locais redundantes.
- Prefira componentes MUI (`Grid2`, `Stack`, `Typography`) para garantir consistência visual e responsiva.
- Centralize chamadas de API em hooks React Query (ex.: `useDashboardMe`) quando conectar com backend.
- Utilize `.env.local` para definir `NEXT_PUBLIC_API_BASE_URL` em ambientes não-docker.
- Sempre rode `npm run lint` (raiz do monorepo) antes de abrir PR.

## Autenticação no Frontend
- A home (`app/page.tsx`) controla os diálogos de login/recuperação e persiste o usuário em `localStorage` (`tia-maria-auth`, `tia-maria-token`).
- Parâmetros `?login=1` e `?forgot=1` forçam abertura dos diálogos; são removidos via `router.replace`.
- `LoginDialog` valida campos obrigatórios, chama `/auth/login` e emite `onSuccess` com nome/email/tipo do usuário.
- `ForgotPasswordDialog` envia `/auth/request-password-reset` e exibe alertas de sucesso/erro.
- Página `reset-password` lê o token da query string, valida senhas, chama `/auth/reset-password` e redireciona para `/`.
- A landing estática (`index.html`) reutiliza o mesmo endpoint `POST /auth/login` via `assets/js/auth.js`, respeitando `window.__TIA_MARIA_API_BASE__` ou o atributo `data-api-base` do `<html>`.

## Execução
- Instalar dependências uma vez:
    ```bash
    npm install --prefix apps/web
    ```
- Subir o frontend em modo desenvolvimento via monorepo:
    ```bash
    npm run dev:frontend
    ```
- Com stack completa (recomendado para testes end-to-end): `npm run dev:stack`.
- Build de produção: `npm run build --prefix apps/web` (Docker usa esse comando automaticamente).

## Integração com o Backend
- `NEXT_PUBLIC_API_BASE_URL` deve apontar para o host da API (compose já injeta `http://localhost:8000`).
- O token JWT é enviado manualmente nas próximas requisições (em breve via React Query + interceptors).
- Após seeds, utilize `admin@tiamariaead.com` (`admin123`) ou `aluno@tiamariaead.com` (`aluno123`).
- Para disparar e-mails de teste, verifique os logs do container `api` (fallback imprime o link).
- Ao testar a landing com a API real, garanta que o backend permita a origem (`http://localhost:8080` por padrão) ou defina `CORS_ORIGINS` conforme necessidade.

## Deploy na Vercel
- Crie um projeto novo na Vercel e selecione este repositório.
- Em “Project Settings → General → Root Directory”, aponte para `apps/web`.
- Use as variáveis de build padrão (`Install Command`: `npm ci`, `Build Command`: `npm run build`, `Output Directory`: `.vercel/output`).
- Configure variáveis de ambiente: 
    - `NEXT_PUBLIC_API_BASE_URL` → domínio público da API.
    - `NEXT_PUBLIC_SITE_URL` → URL final exibida nos e-mails/links.
    - (Opcional) `NODE_OPTIONS=--max_old_space_size=4096` para builds maiores.
- Habilite previews automáticos para PRs e restrinja deploys para `main` quando estabilizar o MVP.

## Próximos Passos
- Conectar React Query às rotas `/auth/login`, `/dashboard/me`, etc., com invalidation adequada.
- Exibir cursos/certificados reais na home/dashboard usando os novos cards.
- Evoluir fluxo de contexto de usuário (sincronizar `localStorage`, refresh tokens, logout global).
- Adicionar testes (React Testing Library/Playwright) para fluxos críticos de autenticação e navegação logada.
