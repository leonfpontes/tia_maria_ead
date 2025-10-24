# Guia do Frontend EAD

## Stack
- **Framework**: Next.js 14 (App Router) com React 18.
- **UI**: Material UI (MUI 6) com suporte a App Router via `@mui/material-nextjs`.
- **Estado**: React Query para requisições e cache.
- **Tipagem**: TypeScript estrito.

## Estrutura
```
apps/web
├── Dockerfile
├── package.json
├── next.config.js
├── tsconfig.json
└── src
    ├── app
    │   ├── layout.tsx      # layout raiz com tema MUI
    │   └── page.tsx        # landing EAD (placeholder)
    └── providers
        └── theme-registry.tsx
```

## Boas Práticas
- Centralizar tokens e temas no `theme-registry`.
- Utilizar componentes MUI (Grid2, Typography, etc.) para manter consistência visual com design system.
- Consumir API via React Query com hooks especializados por domínio (`useCourses`, `useProfile`, ...).
- Usar `.env.local` com `NEXT_PUBLIC_API_BASE_URL` para integrações.
- Rodar `npm run lint` antes de abrir PR.

## Execução
- Instalar dependências uma vez: `cd apps/web && npm install`.
- Subir o frontend em modo desenvolvimento pelo atalho do monorepo:
    ```
    npm run dev:frontend
    ```
- Alternativa em contêiner: `docker compose up web`.

## Próximos Passos
- Criar layout principal (AppBar, navegação lateral).
- Implementar fluxo de autenticação com cookies (fetch com credentials).
- Adicionar páginas: catálogo, detalhes do curso, painel do aluno e admin.
