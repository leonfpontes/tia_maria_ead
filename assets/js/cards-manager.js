/**
 * Sistema de Gerenciamento de Cards - Terreiro Tia Maria
 * 
 * Este arquivo contém templates e funções para criar cards de eventos/giras
 * de forma componentizada e reutilizável.
 */

// ============================================
// TEMPLATES DE CARDS
// ============================================

const CARD_TEMPLATES = {
  // Template para avisos (não haverá gira, etc)
  aviso: {
    cardClasses: 'group novidade-card rounded-2xl p-5 shadow-xl transition',
    cardStyle: `
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                  repeating-linear-gradient(45deg, #000000, #000000 20px, #fbbf24 20px, #fbbf24 40px);
      border: 3px solid #fbbf24;
      display: flex;
      flex-direction: column;
    `,
    badgeClasses: 'novidade-card__badge bg-yellow-500 text-black font-bold',
    badgeIcon: '⚠',
    badgeText: 'Aviso',
    dateStyle: 'color: #fbbf24; font-weight: 700;',
    titleStyle: 'color: #fbbf24; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);',
    descStyle: 'color: #ffffff; font-weight: 600; text-shadow: 1px 1px 3px rgba(0,0,0,0.9);',
    detailStyle: `
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(251, 191, 36, 0.9);
      color: #000000;
      font-weight: 700;
    `,
    detailTextColor: '#000000'
  },

  // Template para Gira de Exu e Pombogira
  exu_pombogira: {
    cardClasses: 'group novidade-card novidade-card--destaque-preto-vermelho rounded-2xl p-5 shadow-2xl transition',
    cardStyle: `
      background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), 
                  url('assets/img/Cards/bg_card_esquerda.jpg') !important;
      background-size: cover !important;
      background-position: center !important;
    `,
    badgeClasses: 'novidade-card__badge bg-green-100 text-green-700',
    badgeText: 'Agenda',
    dateStyle: '',
    titleStyle: '',
    descStyle: '',
    detailStyle: '',
    detailTextColor: ''
  },

  // Template para Gira de Pretos Velhos
  pretos_velhos: {
    cardClasses: 'group novidade-card novidade-card--pretos-velhos rounded-2xl p-5 shadow-xl transition',
    cardStyle: `
      background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), 
                  url('assets/img/Cards/bg_card_pretos_velhos.jpg') !important;
      background-size: cover !important;
      background-position: center !important;
    `,
    badgeClasses: 'novidade-card__badge bg-green-100 text-green-700',
    badgeText: 'Agenda',
    dateStyle: '',
    titleStyle: '',
    descStyle: '',
    detailStyle: '',
    detailTextColor: ''
  },

  // Template para Gira de Caboclos e Boiadeiros
  caboclos_boiadeiros: {
    cardClasses: 'group novidade-card novidade-card--destaque-verde-rosa rounded-2xl p-5 shadow-xl transition',
    cardStyle: `
      background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), 
                  url('assets/img/Cards/bg_card_caboclos_boiadeiros.png') !important;
      background-size: cover !important;
      background-position: center !important;
    `,
    badgeClasses: 'novidade-card__badge bg-white text-green-700 font-bold',
    badgeText: 'Agenda',
    dateStyle: 'color: #ffffff;',
    titleStyle: 'color: #ffffff;',
    descStyle: 'color: #ffffff;',
    detailStyle: 'color: #ffffff;',
    detailTextColor: '#ffffff'
  },

  // Template para outras linhas/giras (coringa neutro)
  gira_neutra: {
    cardClasses: 'group novidade-card novidade-card--destaque-verde-rosa rounded-2xl p-5 shadow-xl transition',
    cardStyle: `
      background: linear-gradient(135deg, #10b981 0%, #EC4899 100%);
      box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3), 0 0 0 2px rgba(236, 72, 153, 0.2);
    `,
    badgeClasses: 'novidade-card__badge bg-white text-green-700 font-bold',
    badgeText: 'Agenda',
    dateStyle: 'color: #ffffff;',
    titleStyle: 'color: #ffffff;',
    descStyle: 'color: #ffffff;',
    detailStyle: 'color: #ffffff;',
    detailTextColor: '#ffffff'
  },

  // Template para eventos gerais (não gira)
  evento: {
    cardClasses: 'group novidade-card rounded-2xl p-5 shadow-xl transition',
    cardStyle: `
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border: 2px solid #d1d5db;
    `,
    badgeClasses: 'novidade-card__badge bg-blue-500 text-white font-bold',
    badgeText: 'Evento',
    dateStyle: 'color: #1f2937;',
    titleStyle: 'color: #111827;',
    descStyle: 'color: #374151;',
    detailStyle: 'color: #1f2937;',
    detailTextColor: '#1f2937'
  }
};

// ============================================
// FUNÇÕES DE UTILIDADE
// ============================================

/**
 * Formata uma data no formato brasileiro
 */
function formatarData(dataISO) {
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  if (typeof dataISO === 'string') {
    const isoPrefix = dataISO.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoPrefix) {
      const ano = isoPrefix[1];
      const mes = Number(isoPrefix[2]);
      const dia = Number(isoPrefix[3]);
      return `${dia} ${meses[mes - 1]} ${ano}`;
    }
  }

  const parsed = new Date(dataISO);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getUTCDate()} ${meses[parsed.getUTCMonth()]} ${parsed.getUTCFullYear()}`;
  }

  return 'Data a confirmar';
}

/**
 * Gera SVG do ícone de relógio
 */
function gerarIconeRelogio() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 8v5l3 2"></path>
      <circle cx="12" cy="12" r="9"></circle>
    </svg>
  `;
}

/**
 * Gera SVG do ícone de alerta
 */
function gerarIconeAlerta() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width: 16px; height: 16px;">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  `;
}

/**
 * Gera botões de ação do card
 */
function gerarBotoesAcoes(config) {
  const exibirBotaoSenha = ['exu_pombogira', 'pretos_velhos', 'caboclos_boiadeiros', 'gira_neutra'].includes(config.tipo);

  return `
    <div class="novidade-card__actions gap-2">
      <a href="https://api.whatsapp.com/message/5CVUD77PM674E1?autoload=1&app_absent=0" target="_blank" class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 transition z-10">
        <img src="assets/img/whatsapp.png" alt="WhatsApp" class="w-5 h-5" />
      </a>
      <a href="https://www.instagram.com/terreirotiamariaecaboclajupira/" target="_blank" class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 transition z-10">
        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="2" fill="none"/>
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="2" fill="none"/>
          <circle cx="17" cy="7" r="1.2" fill="currentColor"/>
        </svg>
      </a>
      ${exibirBotaoSenha ? '<a href="/senhas" class="senha-cta inline-flex items-center justify-center px-3 h-8 rounded-full bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold transition z-10 border border-white/70" aria-label="Ir para a pagina de retirada de senha de atendimento"><span class="senha-cta__label-full">Senha de Atendimento</span><span class="senha-cta__label-short">Senha</span></a>' : ''}
    </div>
  `;
}

// ============================================
// FUNÇÃO PRINCIPAL DE CRIAÇÃO DE CARD
// ============================================

/**
 * Cria um card baseado nos parâmetros fornecidos
 * 
 * @param {Object} config - Configuração do card
 * @param {string} config.tipo - Tipo do card (aviso, exu_pombogira, pretos_velhos, caboclos_boiadeiros, gira_neutra, evento)
 * @param {string} config.data - Data no formato YYYY-MM-DD
 * @param {string} config.titulo - Título do card
 * @param {string} config.descricao - Descrição do evento
 * @param {string} config.horario - Horário (ex: "Portões abrem às 19h30")
 * @param {string} [config.badge] - Texto personalizado para o badge (opcional)
 * @param {string} [config.icone] - Ícone personalizado para o badge (opcional, apenas para tipo aviso)
 * @returns {string} HTML do card
 */
function criarCard(config) {
  const template = CARD_TEMPLATES[config.tipo];
  
  if (!template) {
    console.error(`Tipo de card "${config.tipo}" não encontrado!`);
    return '';
  }

  const badgeTexto = config.badge || template.badgeText;
  const badgeIcone = config.icone || template.badgeIcon || '';
  const dataFormatada = formatarData(config.data);
  
  // Determina qual ícone usar no detalhe
  const iconeDetalhe = config.tipo === 'aviso' ? gerarIconeAlerta() : gerarIconeRelogio();

  return `
    <article class="${template.cardClasses}" data-card-type="${config.tipo}" style="${template.cardStyle.replace(/\s+/g, ' ').trim()}">
      <div class="novidade-card__glow" aria-hidden="true"></div>
      <div class="relative flex items-center gap-2 text-xs font-semibold">
        <span class="${template.badgeClasses}">${badgeIcone ? badgeIcone + ' ' : ''}${badgeTexto}</span>
        <time datetime="${config.data}" style="${template.dateStyle}">${dataFormatada}</time>
      </div>
      <h3 class="relative mt-3 font-bold ${config.tipo === 'aviso' ? 'text-xl' : 'text-lg'}" style="${template.titleStyle}">${config.titulo}</h3>
      <p class="relative mt-2 text-sm" style="${template.descStyle}">${config.descricao}</p>
      <div class="novidade-card__detail ${config.tipo === 'aviso' ? 'mt-auto' : ''}" style="${template.detailStyle}">
        ${iconeDetalhe}
        <span>${config.horario}</span>
      </div>
      ${gerarBotoesAcoes(config)}
    </article>
  `;
}

// ============================================
// FUNÇÃO DE RENDERIZAÇÃO
// ============================================

/**
 * Renderiza uma lista de cards no container especificado
 * 
 * @param {Array} cards - Array de configurações de cards
 * @param {string} containerId - ID do elemento container
 */
function renderizarCards(cards, containerId = 'novidades-cards-container') {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container "${containerId}" não encontrado!`);
    return;
  }

  const cardsHTML = cards.map(config => criarCard(config)).join('');
  container.innerHTML = cardsHTML;
}

// ============================================
// EXPORTAR FUNÇÕES
// ============================================

// Torna as funções disponíveis globalmente
window.CardsManager = {
  criarCard,
  renderizarCards,
  CARD_TEMPLATES
};
