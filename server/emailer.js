/**
 * Módulo de Envio de E-mails via Resend
 * 
 * Serviço centralizado para envio de e-mails transacionais.
 * Usa Resend API para garantir alta deliverability.
 */

const { Resend } = require('resend');
const { renderSenhaConfirmacao } = require('./email-templates');

class EmailService {
  constructor() {
    this.resend = null;
    this.enabled = false;
    this.fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    this.fromName = process.env.EMAIL_FROM_NAME || 'Terreiro Tia Maria';
    
    // Inicializar Resend se API key estiver configurada
    if (process.env.RESEND_API_KEY) {
      try {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.enabled = true;
        console.log('✅ EmailService inicializado com Resend');
      } catch (error) {
        console.error('❌ Erro ao inicializar Resend:', error.message);
        this.enabled = false;
      }
    } else {
      console.warn('⚠️  RESEND_API_KEY não configurada - envio de e-mails desabilitado');
    }
  }

  /**
   * Envia e-mail de confirmação de senha para o consulente
   * 
   * @param {Object} params - Parâmetros do e-mail
   * @param {string} params.email - E-mail do destinatário
   * @param {Object} params.senha - Dados da senha
   * @param {number} params.senha.numero - Número da senha
   * @param {string} params.senha.nome - Nome do consulente
   * @param {Object} params.gira - Dados da gira
   * @param {string} params.gira.tipo - Tipo da gira (Caboclos, Pretos Velhos, etc)
   * @param {string} params.gira.data_inicio - Data de início da gira (ISO)
   * @returns {Promise<Object>} Resultado do envio
   */
  async sendSenhaConfirmacao({ email, senha, gira }) {
    if (!this.enabled) {
      console.warn('⚠️  EmailService desabilitado - pulando envio');
      return { success: false, error: 'Service disabled' };
    }

    try {
      // Validar e-mail
      if (!this.isValidEmail(email)) {
        throw new Error('E-mail inválido');
      }

      // Renderizar template HTML
      const html = renderSenhaConfirmacao({ senha, gira });

      // Definir subject com tipo de gira
      const subject = `✅ Senha Confirmada - Gira de ${gira.tipo}`;

      // Enviar e-mail via Resend
      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: email,
        subject: subject,
        html: html,
      });

      // Verificar se houve erro na resposta
      if (result.error) {
        throw new Error(`Resend API error: ${result.error.message || JSON.stringify(result.error)}`);
      }

      if (!result.data?.id) {
        throw new Error('Resend API não retornou Message ID');
      }

      console.log(`✅ E-mail enviado com sucesso para ${email} (ID: ${result.data.id})`);
      
      return {
        success: true,
        messageId: result.data.id,
      };

    } catch (error) {
      console.error(`❌ Erro ao enviar e-mail para ${email}:`, error.message);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Envia e-mail genérico (para uso futuro)
   * 
   * @param {Object} params - Parâmetros do e-mail
   * @param {string} params.to - E-mail do destinatário
   * @param {string} params.subject - Assunto do e-mail
   * @param {string} params.html - Conteúdo HTML do e-mail
   * @returns {Promise<Object>} Resultado do envio
   */
  async send({ to, subject, html }) {
    if (!this.enabled) {
      console.warn('⚠️  EmailService desabilitado - pulando envio');
      return { success: false, error: 'Service disabled' };
    }

    try {
      if (!this.isValidEmail(to)) {
        throw new Error('E-mail inválido');
      }

      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: to,
        subject: subject,
        html: html,
      });

      console.log(`✅ E-mail enviado com sucesso para ${to} (ID: ${result.data?.id})`);
      
      return {
        success: true,
        messageId: result.data?.id,
      };

    } catch (error) {
      console.error(`❌ Erro ao enviar e-mail para ${to}:`, error.message);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Valida formato de e-mail usando regex RFC 5322 simplificado
   * 
   * @param {string} email - E-mail a ser validado
   * @returns {boolean} true se válido
   */
  isValidEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  }
}

// Exportar instância singleton
module.exports = new EmailService();
