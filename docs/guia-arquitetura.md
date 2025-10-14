# Guia de arquitetura da informação

Este documento descreve a base estrutural do projeto para facilitar sua evolução.

## Estrutura HTML

- `index.html` concentra o layout da home e deve ser organizado em seções semânticas (`<header>`, `<main>`, `<section>`, `<footer>`).
- Utilize hierarquia de títulos progressiva (H1 para o título principal, H2 para seções e assim por diante).
- Sempre que adicionar novos componentes, agrupe-os dentro de seções que possuam identificadores claros (`id="giras"`, `id="agenda"`, etc.) para facilitar ancoragem e navegação.

## CSS

- Tailwind CSS é carregado via CDN para prototipagem rápida.
- Estilos complementares ficam em `assets/css/main.css`. Evite criar folhas múltiplas; mantenha tokens reutilizáveis (cores, gradientes, texturas) centralizados neste arquivo.
- Prefira classes utilitárias do Tailwind sempre que possível. Use CSS customizado apenas quando não houver equivalente direto ou para tokens globais.

## JavaScript

- `assets/js/main.js` deve permanecer enxuto, com responsabilidades de acessibilidade e pequenos comportamentos.
- Scripts adicionais devem ser registrados utilizando o atributo `defer` ou ao final do `body` para evitar bloquear o carregamento.
- Ao criar novos módulos, avalie se vale a pena organizar o código em IIFEs ou módulos ES6 para evitar variáveis globais.

## Acessibilidade e responsividade

- Mantenha atributos `aria-` atualizados, principalmente em componentes interativos (menus, modais, carrosséis).
- Preserve a navegação por teclado (foco visível, controle por `Enter`/`Espaço`).
- Verifique pontos de quebra (`sm`, `md`, `lg`, `xl`) antes de adicionar classes utilitárias que possam conflitar.

## Versionamento de conteúdo

- Sempre que incluir novos documentos de referência, adicione-os ao diretório `docs/`.
- Atualize a seção "Estrutura de pastas" do `README.md` quando inserir novos diretórios relevantes.

Com estas diretrizes, o projeto se mantém alinhado a boas práticas e facilita a colaboração da comunidade.
