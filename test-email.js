#!/usr/bin/env node
/**
 * Script de Teste - Sistema de E-mail
 * 
 * Testa o envio de e-mail de confirmação de senha.
 * Execute: node test-email.js
 */

require('dotenv').config();
const emailService = require('./server/emailer');

async function testEmail() {
  console.log('🧪 Testando Sistema de E-mail...\n');

  // Verificar configuração
  console.log('📋 Configuração:');
  console.log(`   RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ Não encontrada'}`);
  console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM || 'onboarding@resend.dev'}`);
  console.log(`   EMAIL_FROM_NAME: ${process.env.EMAIL_FROM_NAME || 'Terreiro Tia Maria'}\n`);

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY não configurada no .env');
    process.exit(1);
  }

  // Dados de teste
  const testData = {
    email: 'leonfpontes@gmail.com',
    senha: {
      numero: 13,
      nome: 'Leonardo Pontes',
    },
    gira: {
      tipo: 'Caboclos e Boiadeiros',
      data_inicio: '2026-03-15T19:30:00.000Z',
    },
  };

  console.log('📧 Enviando e-mail de teste...');
  console.log(`   Para: ${testData.email}`);
  console.log(`   Senha: #${testData.senha.numero}`);
  console.log(`   Gira: ${testData.gira.tipo}\n`);

  try {
    const result = await emailService.sendSenhaConfirmacao(testData);

    if (result.success) {
      console.log('✅ E-mail enviado com sucesso!');
      console.log(`   Message ID: ${result.messageId}`);
      console.log(`\n📬 Verifique sua caixa de entrada em: ${testData.email}`);
      console.log('💡 Dashboard do Resend: https://resend.com/emails\n');
    } else {
      console.error('❌ Erro ao enviar e-mail:');
      console.error(`   ${result.error}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro inesperado:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }

  console.log('✅ Teste concluído!\n');
}

// Executar teste
testEmail().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
