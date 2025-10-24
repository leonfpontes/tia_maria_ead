# Prompt para Agentes de IA - Projeto Tia Maria EAD

## Descrição do Projeto

Este é o projeto "Terreiro Tia Maria e Cabocla Jupira", um site estático desenvolvido para apresentar a casa de Umbanda Sagrada do Terreiro Tia Maria e Cabocla Jupira. O site inclui informações institucionais, novidades sobre giras e estudos, contatos via redes sociais e WhatsApp, e um sistema de autenticação mockado para simular login de usuários.

O projeto utiliza tecnologias modernas como HTML5 semântico, Tailwind CSS para estilização responsiva, e JavaScript vanilla para funcionalidades interativas. É hospedado no Vercel e segue boas práticas de acessibilidade e manutenção.

## Estrutura do Projeto

- `index.html`: Página principal com header sticky, seção hero com gradiente, seções sobre o terreiro, novidades (cards de eventos), redes sociais, footer e modais de login.
- `assets/css/main.css`: Estilos customizados com variáveis CSS para cores inspiradas em Oxóssi e Xangô, texturas sutis e utilitários.
- `assets/css/tailwind.css`: Arquivo compilado do Tailwind CSS.
- `assets/css/tailwind.input.css`: Arquivo de entrada para build do Tailwind.
- `assets/js/auth.js`: Sistema de autenticação mockado com localStorage, modais de login, dropdown de perfil e menu flutuante (FAB).
- `assets/img/`: Imagens como logo, foto de Ray e Tim, ícone do WhatsApp.
- `package.json`: Configurações do projeto Node.js com scripts para build CSS e servidor local.
- `README.md`: Documentação em português explicando estrutura, personalização e padrões.
- `vercel.json`: Configuração para deploy no Vercel.
- `doc/`: Pasta de documentação com este arquivo e backlog.

## Funcionalidades Principais

- **Responsividade**: Design mobile-first com Tailwind.
- **Autenticação Mock**: Login/logout simulado, persistência com localStorage, UI dinâmica (botão de login, dropdown de perfil, FAB).
- **Acessibilidade**: Atributos ARIA, navegação por teclado, textos alternativos.
- **SEO**: Meta tags, estrutura semântica.
- **Performance**: CSS otimizado, imagens leves.

## Padrões de Desenvolvimento

- Linguagem: Português brasileiro para conteúdo e comentários.
- Estilos: Utilizar classes Tailwind no HTML; customizações em `main.css`.
- JavaScript: Código modular, event listeners para interatividade.
- Commits: Mensagens descritivas em português.
- Acessibilidade: Sempre incluir alt texts, labels e roles apropriados.

## Instruções para Agentes de IA

Ao trabalhar neste projeto, siga estas diretrizes:

1. **Entenda o Contexto**: Leia este documento antes de qualquer modificação para compreender o estado atual.
2. **Atualize este Documento**: Sempre que implementar mudanças significativas (novas funcionalidades, correções, refatorações), atualize este arquivo com detalhes das alterações na seção "Histórico de Mudanças".
3. **Mantenha Consistência**: Preserve o tema espiritual, cores e tom respeitoso do projeto.
4. **Teste Mudanças**: Verifique responsividade, acessibilidade e funcionamento em navegadores.
5. **Documente no Backlog**: Registre tarefas no `backlog.md` com status atualizado.
6. **Evite Quebrar Funcionalidades**: O sistema de auth é mockado; não altere sem necessidade.
7. **Atualize a Documentação ao Final**: Ao concluir qualquer tarefa, sempre revise e atualize a documentação relevante (README.md, agente.md, backlog.md) com as mudanças realizadas, datas e detalhes para manter tudo atualizado e acessível.

## Histórico de Mudanças

- [23/10/2025]: Criação inicial da documentação para agentes de IA, incluindo análise completa do código e estrutura do projeto.
- [23/10/2025]: Adicionada seção "Como Chegar" no index.html com mapa Google, endereço, horários de gira e recomendação de vestimenta. Trocado link do WhatsApp para novo URL direto.
- [23/10/2025]: Invertida a posição do mapa e texto na seção "Como Chegar" (mapa agora na esquerda).
- [23/10/2025]: Removido card "Não haverá gira!" e dado destaque ao card "Gira de Caboclos" na seção de novidades (fundo oxossi, borda destacada, badge especial).
- [23/10/2025]: Card "Gira de Caboclos" ganhou destaque completo em tons de verde com selo de próxima gira.
- [23/10/2025]: Layout responsivo refinado (hero centrado, CTAs mobile ajustadas, carrossel de novidades, mapa e redes sociais otimizados para telas pequenas).
- [23/10/2025]: Adicionada rolagem suave para navegação por âncoras.