# Terreiro Tia Maria e Cabocla Jupira — Estrutura inicial

Projeto estático que apresenta a home institucional do Terreiro Tia Maria e Cabocla Jupira. O objetivo é disponibilizar uma base organizada segundo boas práticas do W3C, com documentação de apoio para evolução do site.

## Visão geral

- **Tecnologias:** HTML5 semântico, Tailwind CSS via CDN, CSS customizado modular e JavaScript vanilla.
- **Idiomas:** Conteúdo principal em português (pt-BR).
- **Foco:** Acessibilidade, responsividade e fácil manutenção.

## Estrutura de pastas

```
.
├── assets/
│   ├── css/
│   │   └── main.css         # Tokens e estilos complementares ao Tailwind
│   ├── img/                 # Pasta reservada para imagens do projeto
│   └── js/
│       └── main.js          # Interações básicas (menu mobile e ano dinâmico)
├── docs/
│   ├── guia-arquitetura.md  # Convenções de código e organização
│   └── diretrizes-conteudo.md # Recomendações para textos e acessibilidade
└── index.html               # Home do site
```

> **Observação:** A hierarquia segue o padrão sugerido pelo W3C para projetos estáticos, separando recursos em diretórios específicos.

## Como visualizar

1. Faça o download/clonagem do repositório.
2. Abra o arquivo `index.html` diretamente no navegador de preferência ou sirva o diretório com um servidor HTTP simples.

Exemplo utilizando o Python 3:

```bash
python -m http.server 5173
```

Acesse `http://localhost:5173` e visualize a home.

## Personalização

- **Cores e tokens:** Centralizados em `assets/css/main.css` nas variáveis CSS (`:root`).
- **Componentes Tailwind:** Utilizam classes utilitárias diretamente no HTML.
- **JavaScript:** Ajuste comportamentos ou adicione novas interações em `assets/js/main.js`.

## Padrões de contribuição

- Prefira HTML semântico (`<main>`, `<section>`, `<nav>`, etc.).
- Mantenha textos alternativos e atributos `aria` atualizados para preservar a acessibilidade.
- Documente alterações relevantes em novos arquivos dentro de `docs/` conforme necessário.
- Utilize indentação de dois espaços para HTML e seguir convenções presentes nos arquivos existentes.

## Licença

Projeto aberto para uso comunitário. Ajuste conforme as necessidades do terreiro mantendo os créditos culturais originais.
