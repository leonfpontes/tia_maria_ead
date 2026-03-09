# Terreiro Tia Maria e Cabocla Jupira

Projeto estático que apresenta a home institucional do Terreiro Tia Maria e Cabocla Jupira. O objetivo é disponibilizar uma base organizada segundo boas práticas do W3C, com documentação de apoio para evolução do site. Desenvolvido para ser simples, acessível e fácil de executar, mesmo para desenvolvedores juniores.

## Visão Geral

- **Tecnologias**: HTML5 semântico, Tailwind CSS (compilado), CSS modular e JavaScript vanilla.
- **Idioma**: Conteúdo principal em português (pt-BR).
- **Foco**: Acessibilidade, responsividade, fácil manutenção e automação de tarefas.
- **Deploy**: Hospedado no Vercel para produção.
- **Responsividade**: Cobertura mobile revisada nas rotas públicas e administrativas (`/`, `/senhas`, `/admin`, `/admin/porta`, `/admin/listadesenhas`), incluindo estados de login e interfaces de operação.

## Pré-requisitos

- **Node.js**: Versão 20.x ou superior (verifique com `node --version`).
- **NPM**: Incluído com Node.js (verifique com `npm --version`).
- **Navegador**: Qualquer navegador moderno (Chrome, Firefox, Edge, etc.).

## Instalação

1. Clone ou baixe o repositório:
   ```bash
   git clone https://github.com/leonfpontes/tia_maria_ead.git
   cd tia_maria_ead
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```
   Isso instala as dependências de desenvolvimento (como Tailwind CLI e http-server).

## Execução

Para executar o projeto localmente:

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   - Isso compila automaticamente o CSS do Tailwind (se necessário) e inicia um servidor HTTP na porta 8080.
   - Abra o navegador e acesse `http://localhost:8080`.

2. **Alternativa simples**: Abra o arquivo `index.html` diretamente no navegador (funciona, mas sem servidor, alguns recursos podem ser limitados).

3. **Parar o servidor**: Pressione `Ctrl + C` no terminal.

## Teste local da API com SQLite (modo simples)

Se quiser testar o fluxo de senhas/admin localmente sem Neon/Postgres:

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie o banco SQLite e usuário admin local:
   ```bash
   npm run setup:sqlite
   ```
   - Usuário padrão: `admin`
   - Senha padrão: `admin123`

3. Rode a API local da Vercel em modo desenvolvimento:
   ```bash
   set DB_DRIVER=sqlite
   set SQLITE_PATH=./local.sqlite
   set JWT_SECRET=dev-secret-local
   npm run dev:api
   ```
   > No PowerShell, use `$env:DB_DRIVER="sqlite"`, `$env:SQLITE_PATH="./local.sqlite"`, `$env:JWT_SECRET="dev-secret-local"`.

4. Abra no navegador:
   - `http://localhost:3000/admin`
   - `http://localhost:3000/senhas.html`

## Desenvolvimento

### Build do CSS
O Tailwind CSS é compilado automaticamente ao executar `npm start`. Se precisar buildar manualmente:
```bash
npm run build:css
```
Isso gera `assets/css/tailwind.css` a partir de `assets/css/tailwind.input.css`.

### Modo de Observação (Watch)
Para desenvolvimento contínuo, monitore mudanças no CSS:
```bash
npm run watch:css
```
Isso recompila automaticamente o CSS sempre que `tailwind.input.css` for alterado.

### Estrutura de Pastas

```
.
├── index.html                 # Página principal do site
├── package.json               # Configurações do projeto Node.js
├── README.md                  # Esta documentação
├── vercel.json                # Configuração para deploy no Vercel
├── assets/
│   ├── css/
│   │   ├── main.css           # Estilos customizados e variáveis CSS
│   │   ├── tailwind.css       # CSS compilado do Tailwind (gerado)
│   │   └── tailwind.input.css # Entrada para build do Tailwind
│   ├── img/                   # Imagens do projeto (logo, fotos, etc.)
│   └── js/
│       └── auth.js            # Lógica de autenticação mockada
└── doc/
    ├── agente.md              # Prompt para agentes de IA
    └── backlog.md             # Controle de tarefas e status
```

## Personalização

- **Cores e tokens**: Centralizados em `assets/css/main.css` nas variáveis CSS (`:root`). Inspire-se em Oxóssi (verdes) e Xangô (marrons).
- **Componentes Tailwind**: Use classes utilitárias diretamente no HTML (`index.html`).
- **JavaScript**: Ajuste comportamentos em `assets/js/auth.js` (autenticação mockada com localStorage).
- **Conteúdo**: Edite textos e imagens em `index.html` e `assets/img/`.

## Como Contribuir

1. **Fork** o repositório e crie uma branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```

2. Faça suas mudanças seguindo os padrões:
   - Use HTML semântico (`<main>`, `<section>`, `<nav>`, etc.).
   - Mantenha acessibilidade: textos alternativos (`alt`), atributos `aria` e navegação por teclado.
   - Teste responsividade em dispositivos móveis e desktop.
   - Atualize a documentação em `doc/` se necessário (veja `doc/agente.md` para instruções).

3. Teste suas mudanças:
   - Execute `npm start` e verifique no navegador.
   - Certifique-se de que o login/logout mockado funciona.
   - Valide acessibilidade com ferramentas como Lighthouse.

4. Commit suas mudanças:
   ```bash
   git add .
   git commit -m "Descrição clara da mudança"
   ```

5. Push e abra um Pull Request:
   ```bash
   git push origin minha-feature
   ```

### Padrões de Código
- **Indentação**: Use 2 espaços.
- **Linguagem**: Português para comentários e commits.
- **Acessibilidade**: Sempre priorize.
- **Documentação**: Atualize `doc/agente.md` e `doc/backlog.md` para mudanças significativas.

## Scripts Disponíveis

- `npm start`: Inicia servidor local e compila CSS.
- `npm run build:css`: Compila CSS do Tailwind.
- `npm run watch:css`: Monitora mudanças no CSS e recompila.
- `npm run build`: Alias para `build:css`.

## Suporte

- **Issues**: Abra uma issue no GitHub para bugs ou sugestões.
- **Contato**: Via redes sociais no site ou e-mail em `terreirotiamariaecaboclajupira@outlook.com`.

## Licença

Projeto aberto para uso comunitário. Ajuste conforme as necessidades do terreiro, mantendo os créditos culturais originais e respeitando a religião de Umbanda.


## Sistema de Senhas

Sistema de senhas de atendimento para as giras, permitindo que os filhos de fé retirem senhas online antes da gira.

### Variáveis de Ambiente Necessárias

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL de conexão PostgreSQL (ex: `postgres://user:pass@host/db`) |
| `JWT_SECRET` | Segredo para assinar tokens JWT (use string longa e aleatória) |
| `SEED_SECRET` | Segredo para criar o primeiro admin via API |

### Executar Migrations

```bash
psql $DATABASE_URL < db/migrations/001_create_tables.sql
psql $DATABASE_URL < db/migrations/002_add_email_to_senhas.sql
psql $DATABASE_URL < db/migrations/003_add_fila_campos.sql
psql $DATABASE_URL < db/migrations/004_add_tipo_card_to_giras.sql
```

### Criar Primeiro Admin

```bash
curl -X POST https://seu-dominio.com/api/admin/admins/seed \
  -H "Authorization: Bearer $SEED_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SenhaSegura123!","role":"ADMIN"}'
```

### Rotas da API

#### Públicas
- `GET /api/public/agenda` – Próxima gira com controle de senhas
- `GET /api/public/giras/cards` – Cards de giras publicadas para renderização automática na home (janela `D-1`: ontem em diante, no fuso `America/Sao_Paulo`)
- `POST /api/public/giras/:id/senhas` – Retirar senha (body: `{nome, telefone, email, is_preferencial}`)

#### Admin (requer Bearer token)
- `POST /api/admin/login` – Login (`{username, password}`)
- `GET /api/admin/giras` – Listar giras com métricas por gira (`emitidas`, `atendidas`, `no_show`, `walk_in`, `preferenciais`) para uso no dashboard do `/admin`
- `POST /api/admin/giras` – Criar gira
- `GET/PUT/DELETE /api/admin/giras/:id` – Gerenciar gira
- `GET/PUT /api/admin/controles/:giraId` – Gerenciar controle de senhas
- `GET /api/admin/giras/:id/senhas` – Listar senhas (suporta `?busca=` e `?format=csv`)
- `PATCH /api/admin/senhas/:id/status` – Atualizar status da senha
- `POST /api/admin/admins/seed` – Criar primeiro admin (requer `SEED_SECRET`)

### Páginas

- `/senhas` – Página pública para retirada de senhas
- `/admin` – Painel administrativo de giras (com filtros por nome/período e ocultação de giras antigas), cards de big numbers e gráfico de barras em timeline da distribuição de senhas por gira no recorte atual
- `/admin/listadesenhas` – Lista de senhas por gira (acesso via botão de ação na tabela de giras em `/admin`)
- `/admin/porta` – Painel mobile para operador de porta

Na home, os cards de gira exibem o CTA `Senha de Atendimento` apontando para `/senhas` (cards de aviso não exibem este botão).
