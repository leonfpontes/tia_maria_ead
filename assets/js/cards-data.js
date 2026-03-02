/**
 * Dados dos Cards de Eventos/Giras - Terreiro Tia Maria
 * 
 * Para criar novos cards, adicione objetos ao array CARDS_DADOS seguindo a estrutura:
 * {
 *   tipo: 'tipo_do_card',        // Opções: aviso, exu_pombogira, pretos_velhos, caboclos_boiadeiros, gira_neutra, evento
 *   data: 'YYYY-MM-DD',          // Data no formato ISO
 *   titulo: 'Título do Card',
 *   descricao: 'Descrição do evento',
 *   horario: 'Informação de horário',
 *   badge: 'Texto do Badge',     // Opcional - usa o padrão do template se não informado
 *   icone: '⚠'                   // Opcional - apenas para tipo 'aviso'
 * }
 */

const CARDS_DADOS = [
  // Card de aviso - Não haverá gira
  {
    tipo: 'aviso',
    data: '2026-03-07',
    titulo: 'Não teremos gira!',
    descricao: 'Nesta sexta-feira não haverá trabalhos. Retornamos na próxima semana com a Gira de Exu e Pombogira.',
    horario: 'Casa fechada',
    badge: 'Aviso',
    icone: '⚠'
  },

  // Card de Gira de Exu e Pombogira
  {
    tipo: 'exu_pombogira',
    data: '2026-03-14',
    titulo: 'Gira de Exu e Pombogira',
    descricao: 'Noite de firmeza com os guardiões da esquerda. Venha fortalecer seus caminhos com fé e respeito.',
    horario: 'Portões abrem às 19h30'
  },

  // Card de Gira de Pretos Velhos
  {
    tipo: 'pretos_velhos',
    data: '2026-03-21',
    titulo: 'Gira de Pretos Velhos',
    descricao: 'Noite de sabedoria e cura com nossos vovôs e vovós. Venha receber o axé ancestral.',
    horario: 'Portões abrem às 19h30'
  },

  // Card de Gira de Caboclos e Boiadeiros
  {
    tipo: 'caboclos_boiadeiros',
    data: '2026-03-28',
    titulo: 'Gira de Caboclos e Boiadeiros',
    descricao: 'Noite de força e proteção com os guerreiros da mata. Venha receber as bênçãos dos nossos caboclos.',
    horario: 'Portões abrem às 19h30'
  }
];

// ============================================
// EXEMPLOS DE OUTROS TIPOS DE CARDS
// ============================================

/**
 * Exemplos comentados de como criar outros tipos de cards:
 * 
 * // Card de evento geral (curso, palestra, etc)
 * {
 *   tipo: 'evento',
 *   data: '2026-04-05',
 *   titulo: 'Curso de Teologia de Umbanda',
 *   descricao: 'Inscrições abertas para o curso de Teologia. Venha aprofundar seus conhecimentos.',
 *   horario: 'Inscrições via WhatsApp'
 * }
 * 
 * // Card de gira neutra (outras linhas)
 * {
 *   tipo: 'gira_neutra',
 *   data: '2026-04-12',
 *   titulo: 'Gira de Baianos',
 *   descricao: 'Noite de alegria e bênçãos com os baianos. Venha receber o axé do sertão.',
 *   horario: 'Portões abrem às 19h30'
 * }
 */

// Torna os dados disponíveis globalmente
window.CARDS_DADOS = CARDS_DADOS;
