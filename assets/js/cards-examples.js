/**
 * EXEMPLOS DE USO - Sistema de Cards
 * Terreiro Tia Maria e Cabocla Jupira
 * 
 * Este arquivo contém exemplos práticos de como criar cards
 * para diferentes situações do terreiro.
 * 
 * ⚠️ ATENÇÃO: Este é apenas um arquivo de exemplos!
 * Para adicionar cards reais, edite o arquivo: assets/js/cards-data.js
 */

// ============================================
// EXEMPLO 1: Calendário Mensal de Giras
// ============================================

const EXEMPLO_CALENDARIO_ABRIL = [
  {
    tipo: 'exu_pombogira',
    data: '2026-04-03',
    titulo: 'Gira de Exu e Pombogira',
    descricao: 'Noite de firmeza com os guardiões da esquerda.',
    horario: 'Portões abrem às 19h30'
  },
  {
    tipo: 'pretos_velhos',
    data: '2026-04-10',
    titulo: 'Gira de Pretos Velhos',
    descricao: 'Noite de sabedoria com nossos vovôs e vovós.',
    horario: 'Portões abrem às 19h30'
  },
  {
    tipo: 'caboclos_boiadeiros',
    data: '2026-04-17',
    titulo: 'Gira de Caboclos',
    descricao: 'Força e proteção dos guerreiros da mata.',
    horario: 'Portões abrem às 19h30'
  },
  {
    tipo: 'gira_neutra',
    data: '2026-04-24',
    titulo: 'Gira de Baianos',
    descricao: 'Noite de alegria com os trabalhadores do sertão.',
    horario: 'Portões abrem às 19h30'
  }
];

// ============================================
// EXEMPLO 2: Eventos Especiais e Rituais
// ============================================

const EXEMPLO_EVENTOS_ESPECIAIS = [
  {
    tipo: 'gira_neutra',
    data: '2026-05-01',
    titulo: 'Ritual de Oxóssi',
    descricao: 'Grande ritual coletivo na força do caçador divino. Presença obrigatória dos médiuns.',
    horario: 'Início às 19h - Pontualidade!',
    badge: 'Ritual'
  },
  {
    tipo: 'evento',
    data: '2026-05-10',
    titulo: 'Feijoada Beneficente',
    descricao: 'Participe da nossa tradicional feijoada. Renda revertida para manutenção da casa.',
    horario: 'Das 12h às 16h',
    badge: 'Evento Social'
  },
  {
    tipo: 'gira_neutra',
    data: '2026-05-15',
    titulo: 'Gira das Crianças',
    descricao: 'Noite especial com os Erês. Tragam balas e doces para as oferendas!',
    horario: 'Portões abrem às 19h30',
    badge: 'Cosme e Damião'
  }
];

// ============================================
// EXEMPLO 3: Cursos e Formações
// ============================================

const EXEMPLO_CURSOS = [
  {
    tipo: 'evento',
    data: '2026-06-07',
    titulo: 'Aulas de Curimba - Turma Nova',
    descricao: 'Aprenda os toques sagrados dos atabaques. Inscrições limitadas a 10 vagas.',
    horario: 'Sábados às 14h',
    badge: 'Curso'
  },
  {
    tipo: 'evento',
    data: '2026-06-14',
    titulo: 'Teologia de Umbanda - TD7',
    descricao: 'Sétima turma do curso de Teologia. Aprofunde seus conhecimentos sobre a religião.',
    horario: 'Terças e Quintas às 20h',
    badge: 'Formação'
  },
  {
    tipo: 'evento',
    data: '2026-06-21',
    titulo: 'Desenvolvimento Mediúnico',
    descricao: 'Curso intensivo para desenvolvimento e aprimoramento da mediunidade.',
    horario: 'Quartas às 19h',
    badge: 'Desenvolvimento'
  }
];

// ============================================
// EXEMPLO 4: Avisos e Comunicados
// ============================================

const EXEMPLO_AVISOS = [
  {
    tipo: 'aviso',
    data: '2026-07-04',
    titulo: 'Não haverá gira!',
    descricao: 'Nesta sexta-feira não teremos trabalhos devido ao feriado. Retornamos na próxima semana.',
    horario: 'Casa fechada',
    badge: 'Feriado',
    icone: '🗓️'
  },
  {
    tipo: 'aviso',
    data: '2026-07-11',
    titulo: 'Festa de Xangô',
    descricao: 'Dia especial em homenagem ao Rei da Justiça. Esperamos todos os filhos da casa!',
    horario: 'Festa às 20h',
    badge: 'Festa',
    icone: '🎉'
  },
  {
    tipo: 'aviso',
    data: '2026-07-18',
    titulo: 'Mutirão de Limpeza',
    descricao: 'Precisamos da ajuda de todos para preparar o terreiro para a festa de Iemanjá.',
    horario: 'Sábado às 9h',
    badge: 'Mutirão',
    icone: '🧹'
  }
];

// ============================================
// EXEMPLO 5: Outras Linhas de Trabalho
// ============================================

const EXEMPLO_OUTRAS_LINHAS = [
  {
    tipo: 'gira_neutra',
    data: '2026-08-01',
    titulo: 'Gira de Malandros',
    descricao: 'Noite com a malandragem sagrada. Venha receber proteção e astúcia.',
    horario: 'Portões abrem às 19h30'
  },
  {
    tipo: 'gira_neutra',
    data: '2026-08-08',
    titulo: 'Gira de Marinheiros',
    descricao: 'Navegar é preciso! Noite com os trabalhadores do mar.',
    horario: 'Portões abrem às 19h30'
  },
  {
    tipo: 'gira_neutra',
    data: '2026-08-15',
    titulo: 'Gira Mista',
    descricao: 'Todas as linhas trabalhando juntas. Noite de muita força e diversidade.',
    horario: 'Portões abrem às 19h30'
  },
  {
    tipo: 'gira_neutra',
    data: '2026-08-22',
    titulo: 'Gira de Ciganos',
    descricao: 'Noite especial com os povos ciganos. Música, dança e muitas bênçãos.',
    horario: 'Portões abrem às 19h30'
  }
];

// ============================================
// EXEMPLO 6: Campanhas e Ações Sociais
// ============================================

const EXEMPLO_CAMPANHAS = [
  {
    tipo: 'evento',
    data: '2026-09-01',
    titulo: 'Campanha do Agasalho',
    descricao: 'Doe roupas e cobertores. Juntos podemos aquecer quem mais precisa.',
    horario: 'Doações até 30/09',
    badge: 'Campanha'
  },
  {
    tipo: 'evento',
    data: '2026-10-12',
    titulo: 'Dia das Crianças - Doação de Brinquedos',
    descricao: 'Participe doando brinquedos para alegrar o Dia das Crianças na comunidade.',
    horario: 'Entrega no dia 12/10',
    badge: 'Ação Social'
  },
  {
    tipo: 'evento',
    data: '2026-12-01',
    titulo: 'Natal Solidário',
    descricao: 'Campanha de arrecadação de alimentos para cestas de Natal.',
    horario: 'Arrecadações até 20/12',
    badge: 'Natal'
  }
];

// ============================================
// EXEMPLO 7: Vivências e Workshops
// ============================================

const EXEMPLO_VIVENCIAS = [
  {
    tipo: 'evento',
    data: '2026-09-20',
    titulo: 'Vivência de Pombogiras',
    descricao: 'Workshop exclusivo sobre a força feminina da esquerda. Apenas para mulheres.',
    horario: 'Sábado das 14h às 18h',
    badge: 'Vivência'
  },
  {
    tipo: 'evento',
    data: '2026-10-05',
    titulo: 'Roda de Conversa sobre Umbanda',
    descricao: 'Tire suas dúvidas sobre a religião num bate-papo aberto e acolhedor.',
    horario: 'Quinta às 20h',
    badge: 'Roda de Conversa'
  },
  {
    tipo: 'evento',
    data: '2026-11-10',
    titulo: 'Workshop de Ervas e Banhos',
    descricao: 'Aprenda sobre as ervas sagradas e como preparar banhos litúrgicos.',
    horario: 'Domingo às 15h',
    badge: 'Workshop'
  }
];

// ============================================
// COMO USAR ESTES EXEMPLOS
// ============================================

/**
 * Para usar qualquer um destes exemplos:
 * 
 * 1. Copie o(s) objeto(s) que deseja usar
 * 2. Cole no arquivo assets/js/cards-data.js dentro do array CARDS_DADOS
 * 3. Ajuste as datas, textos e informações conforme necessário
 * 4. Salve o arquivo e recarregue a página
 * 
 * Dica: Você pode misturar diferentes tipos de cards!
 * Por exemplo: giras, eventos e avisos no mesmo mês.
 */

// ============================================
// TEMPLATE EM BRANCO PARA COPIAR
// ============================================

const TEMPLATE_CARD = {
  tipo: '',              // aviso | exu_pombogira | pretos_velhos | caboclos_boiadeiros | gira_neutra | evento
  data: '',              // YYYY-MM-DD
  titulo: '',            // Título do card
  descricao: '',         // Descrição do evento
  horario: '',           // Horário ou informação adicional
  badge: '',             // Opcional - texto customizado do badge
  icone: ''              // Opcional - apenas para tipo 'aviso'
};
