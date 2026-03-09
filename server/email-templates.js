/**
 * Renderização de Templates de E-mail
 * 
 * Módulo responsável por renderizar templates HTML para e-mails transacionais.
 * Usa templates inline CSS para compatibilidade com clientes de e-mail.
 */

const fs = require('fs');
const path = require('path');

/**
 * Formata data no formato brasileiro: DD/MM/YYYY às HH:MM
 * 
 * @param {string} isoDate - Data no formato ISO (YYYY-MM-DDTHH:mm:ss.000Z)
 * @returns {string} Data formatada
 */
function formatarDataBrasil(isoDate) {
  const date = new Date(isoDate);
  
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  const hora = String(date.getHours()).padStart(2, '0');
  const minuto = String(date.getMinutes()).padStart(2, '0');
  
  return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
}

/**
 * Formata data curta: DD/MM/YYYY
 * 
 * @param {string} isoDate - Data no formato ISO
 * @returns {string} Data formatada
 */
function formatarDataCurta(isoDate) {
  const date = new Date(isoDate);
  
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata hora: HH:MM
 * 
 * @param {string} isoDate - Data no formato ISO
 * @returns {string} Hora formatada
 */
function formatarHora(isoDate) {
  const date = new Date(isoDate);
  
  const hora = String(date.getHours()).padStart(2, '0');
  const minuto = String(date.getMinutes()).padStart(2, '0');
  
  return `${hora}:${minuto}`;
}

/**
 * Escapa HTML para prevenir XSS
 * 
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
  if (!text) return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Carrega template HTML de arquivo e substitui placeholders
 * 
 * @param {string} templateName - Nome do template (sem extensão)
 * @param {Object} data - Dados para substituição
 * @returns {string} HTML renderizado
 */
function renderTemplate(templateName, data) {
  const templatePath = path.join(__dirname, '..', 'assets', 'emails', `${templateName}.html`);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template não encontrado: ${templateName}`);
  }
  
  let html = fs.readFileSync(templatePath, 'utf8');
  
  // Substituir placeholders
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    html = html.replace(new RegExp(placeholder, 'g'), value);
  }
  
  return html;
}

/**
 * Renderiza e-mail de confirmação de senha
 * 
 * @param {Object} params - Parâmetros do e-mail
 * @param {Object} params.senha - Dados da senha
 * @param {number} params.senha.numero - Número da senha
 * @param {string} params.senha.nome - Nome do consulente
 * @param {Object} params.gira - Dados da gira
 * @param {string} params.gira.tipo - Tipo da gira
 * @param {string} params.gira.data_inicio - Data de início (ISO)
 * @returns {string} HTML do e-mail
 */
function renderSenhaConfirmacao({ senha, gira }) {
  const data = {
    NOME: escapeHtml(senha.nome),
    NUMERO: senha.numero,
    DATA_COMPLETA: formatarDataBrasil(gira.data_inicio),
    DATA_CURTA: formatarDataCurta(gira.data_inicio),
    HORA: formatarHora(gira.data_inicio),
    TIPO_GIRA: escapeHtml(gira.tipo),
    ENDERECO: 'Rua Joaquim Gomes Jardim, 49 - Ferraz de Vasconcelos/SP',
    VESTIMENTA: 'Recomendamos roupas claras e confortáveis (branco, bege ou tons pastéis).',
    ANO_ATUAL: new Date().getFullYear(),
  };
  
  return renderTemplate('senha-confirmacao', data);
}

module.exports = {
  renderSenhaConfirmacao,
  formatarDataBrasil,
  formatarDataCurta,
  formatarHora,
  escapeHtml,
};
