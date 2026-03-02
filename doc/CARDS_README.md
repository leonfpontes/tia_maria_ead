# Sistema de Cards Componentizados - Terreiro Tia Maria

## 📋 Visão Geral

Este sistema permite criar e gerenciar cards de eventos e giras de forma componentizada e reutilizável. Não é mais necessário editar HTML manualmente - basta adicionar ou editar objetos JavaScript em `assets/js/cards-data.js`.

## 🎨 Tipos de Cards Disponíveis

### 1. **aviso** - Card de Avisos
- Fundo com listras preto/amarelo em diagonal
- Badge amarelo com ícone de alerta ⚠
- Ideal para: Avisos de "Não haverá gira", comunicados importantes

### 2. **exu_pombogira** - Gira de Exu e Pombogira
- Fundo com imagem `bg_card_esquerda.jpg`
- Cores vermelho e preto
- Badge verde "Agenda"

### 3. **pretos_velhos** - Gira de Pretos Velhos
- Fundo com imagem `bg_card_pretos_velhos.jpg`
- Cores branco e preto
- Badge verde "Agenda"

### 4. **caboclos_boiadeiros** - Gira de Caboclos e Boiadeiros
- Fundo com imagem `bg_card_caboclos_boiadeiros.png`
- Cores verde e rosa com texto branco
- Badge branco com texto verde

### 5. **gira_neutra** - Giras de Outras Linhas
- Fundo degradê azul escuro
- Ideal para: Baianos, Malandros, Marinheiros, Crianças, etc.
- Badge branco com texto cinza

### 6. **evento** - Eventos Gerais (Não Gira)
- Fundo cinza claro com borda
- Ideal para: Cursos, palestras, workshops, campanhas
- Badge azul "Evento"

## 📝 Como Adicionar um Novo Card

### Passo 1: Abra o arquivo `assets/js/cards-data.js`

### Passo 2: Adicione um novo objeto ao array `CARDS_DADOS`

```javascript
{
  tipo: 'tipo_do_card',        // Escolha um dos 6 tipos acima
  data: 'YYYY-MM-DD',          // Data no formato ISO (2026-04-15)
  titulo: 'Título do Card',    // Título principal
  descricao: 'Descrição',      // Texto descritivo
  horario: 'Horário ou info',  // Ex: "Portões abrem às 19h30"
  badge: 'Texto customizado',  // Opcional
  icone: '⚠'                   // Opcional - apenas para tipo 'aviso'
}
```

## 🎯 Exemplos Práticos

### Exemplo 1: Gira de Baianos
```javascript
{
  tipo: 'gira_neutra',
  data: '2026-04-05',
  titulo: 'Gira de Baianos',
  descricao: 'Noite de alegria e bênçãos com os baianos. Venha receber o axé do sertão.',
  horario: 'Portões abrem às 19h30'
}
```

### Exemplo 2: Curso de Teologia
```javascript
{
  tipo: 'evento',
  data: '2026-04-12',
  titulo: 'Curso de Teologia de Umbanda',
  descricao: 'Inscrições abertas! Aprofunde seus conhecimentos sobre a religião de Umbanda.',
  horario: 'Inscrições via WhatsApp',
  badge: 'Curso'
}
```

### Exemplo 3: Ritual Coletivo
```javascript
{
  tipo: 'gira_neutra',
  data: '2026-04-19',
  titulo: 'Ritual Coletivo na Força de Oxóssi',
  descricao: 'Grande ritual coletivo na força do grande caçador. Esperamos todos os filhos da casa.',
  horario: 'Início às 19h - Pontualidade',
  badge: 'Ritual'
}
```

### Exemplo 4: Aviso Customizado
```javascript
{
  tipo: 'aviso',
  data: '2026-04-26',
  titulo: 'Recesso de Feriado',
  descricao: 'Durante o feriado não haverá atividades. Retornamos na próxima semana.',
  horario: 'Retorno em 03/05',
  badge: 'Feriado',
  icone: '🗓️'
}
```

## 🔄 Como Editar Cards Existentes

1. Abra `assets/js/cards-data.js`
2. Localize o card que deseja editar no array `CARDS_DADOS`
3. Modifique os valores desejados (data, título, descrição, etc.)
4. Salve o arquivo
5. Recarregue a página

## 🗑️ Como Remover um Card

1. Abra `assets/js/cards-data.js`
2. Localize o card no array `CARDS_DADOS`
3. Delete o objeto completo (incluindo as vírgulas corretas)
4. Salve o arquivo
5. Recarregue a página

## ⚙️ Arquivos do Sistema

```
assets/js/
├── cards-manager.js  → Lógica e templates dos cards (NÃO EDITAR)
├── cards-data.js     → Dados dos cards (EDITE AQUI!)
```

## 🎨 Customização Avançada

### Criar um Template Personalizado

Se precisar de um tipo de card totalmente novo, edite `assets/js/cards-manager.js`:

```javascript
// Adicione ao objeto CARD_TEMPLATES
meu_card_customizado: {
  cardClasses: 'classes do Tailwind',
  cardStyle: 'estilos inline CSS',
  badgeClasses: 'classes do badge',
  badgeText: 'Texto padrão',
  dateStyle: 'estilo da data',
  titleStyle: 'estilo do título',
  descStyle: 'estilo da descrição',
  detailStyle: 'estilo do horário',
  detailTextColor: 'cor do texto'
}
```

Depois use em `cards-data.js`:
```javascript
{
  tipo: 'meu_card_customizado',
  // ... resto das propriedades
}
```

## 🔍 Troubleshooting

### Cards não aparecem?
- Verifique o console do navegador (F12) por erros
- Confirme que os scripts estão carregando:
  - `assets/js/cards-manager.js`
  - `assets/js/cards-data.js`
- Verifique se o container `novidades-cards-container` existe no HTML

### Cards com aparência errada?
- Verifique se o `tipo` corresponde exatamente a um dos 6 tipos disponíveis
- Confirme que as imagens de fundo existem em `assets/img/Cards/`
- Verifique se não há erros de sintaxe no JavaScript (vírgulas, aspas, etc.)

### Data não formata corretamente?
- Use sempre o formato ISO: `YYYY-MM-DD`
- Exemplo: `2026-04-15` (não `15/04/2026`)

## 📱 Contato

Dúvidas sobre o sistema?
- WhatsApp: [Link do WhatsApp]
- Email: terreirotiamariaecaboclajupira@outlook.com

---

**Última atualização:** 02/03/2026  
**Versão do Sistema:** 1.0
