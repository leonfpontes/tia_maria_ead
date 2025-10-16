# Terreiro Tia Maria e Cabocla Jupira — Estrutura inicial

Projeto estático que apresenta a home institucional do Terreiro Tia Maria e Cabocla Jupira. O objetivo é disponibilizar uma base organizada segundo boas práticas do W3C, com documentação de apoio para evolução do site.

## Visão geral

- Tecnologias: HTML5 semântico, Tailwind CSS via CDN, CSS modular e JavaScript vanilla.
- Idioma: Conteúdo principal em português (pt-BR).
- Foco: Acessibilidade, responsividade e fácil manutenção.

## Estrutura de pastas

```
.
└─ assets/
   ├─ css/
   │  ├─ main.css           # Tokens e estilos complementares ao Tailwind
   │  ├─ tailwind.css       # Saída gerada do Tailwind
   │  └─ tailwind.input.css # Fonte para o build do Tailwind
   ├─ img/                  # Imagens do projeto
   └─ js/
      └─ auth.js           # Lógica de autenticação mock (modal / FAB)

index.html                 # Home do site
```

## Como visualizar

1. Abra o arquivo `index.html` diretamente no navegador, ou
2. Sirva o diretório com um servidor HTTP simples.

Exemplo utilizando o Python 3:

```bash
python -m http.server 5173
```

Acesse `http://localhost:5173` e visualize a home.

## Personalização

- Cores e tokens: Centralizados em `assets/css/main.css` nas variáveis CSS (`:root`).
- Componentes Tailwind: Classes utilitárias diretamente no HTML (`index.html`).
- JavaScript: Ajuste comportamentos em `assets/js/auth.js`.

## Padrões de contribuição

- Prefira HTML semântico (`<main>`, `<section>`, `<nav>`, etc.).
- Mantenha textos alternativos e atributos `aria` atualizados para acessibilidade.
- Documente alterações relevantes em arquivos dentro de `docs/` (se aplicável).
- Utilize indentação consistente e siga as convenções presentes nos arquivos existentes.

## Licença

Projeto aberto para uso comunitário. Ajuste conforme as necessidades do terreiro mantendo os créditos culturais originais.

