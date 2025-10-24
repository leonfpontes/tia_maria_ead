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

# Dependências da landing page (uma única vez)


# Dependências do frontend Next.js (uma única vez)

npm install
cd ../..
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

## 🎨 Personalizar a Landing Page

- **Cores e tokens**: `assets/css/main.css` (variáveis CSS inspiradas em Oxóssi e Xangô).
- **Layout**: edite `index.html` usando classes Tailwind.
- **JS**: `assets/js/auth.js` cuida do login mockado (localStorage).
- **Imagens**: troque arquivos em `assets/img/`.

---

## 🧑‍💻 Fluxo de Contribuição

1. Crie uma branch: `git checkout -b minha-feature`.
2. Faça suas alterações (landing, frontend ou backend).
3. Rode os comandos de desenvolvimento referentes à parte que mexeu.
4. Atualize a documentação (`doc/agente.md`, `doc/backlog.md`, `doc/frontend.md`, `doc/backend.md`) quando necessário.
5. Commits em português, mensagens claras: `git commit -m "feat: adiciona player de vídeo"`.
6. Push e abra o PR.

### Boas práticas importantes

- **Acessibilidade sempre**: cabeçalhos semânticos, `alt` nas imagens, foco visível.
- **Responsividade testada**: mobile first.
- **Logs e documentação**: descreva mudanças relevantes para facilitar o trabalho do próximo dev.

---

## 📖 Documentação complementar

- [doc/ead_arquitetura.md](doc/ead_arquitetura.md) – visão geral da arquitetura e decisões de custo.
- [doc/backend.md](doc/backend.md) – referência rápida do backend.
- [doc/frontend.md](doc/frontend.md) – guia do frontend Next.js/MUI.
- [doc/backlog.md](doc/backlog.md) – lista de tarefas atualizada.

---

## 🤝 Suporte

- **Issues**: abra no GitHub para bugs ou ideias.
- **Contato direto**: `terreirotiamariaecaboclajupira@outlook.com`.

Projeto aberto para a comunidade, com respeito à tradição da Umbanda. Faça bom uso e compartilhe melhorias 🙌.

