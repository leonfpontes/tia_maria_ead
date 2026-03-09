#!/usr/bin/env node
/**
 * Script de Teste Detalhado - Resend API
 * 
 * Testa a API do Resend diretamente para diagnosticar problemas
 */

require('dotenv').config();
const { Resend } = require('resend');

async function testResendDirect() {
  console.log('🔍 Teste Detalhado da API Resend\n');

  // Verificar API Key
  console.log('📋 Verificando configuração:');
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY não encontrada no .env');
    process.exit(1);
  }
  
  console.log(`   API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`   Comprimento: ${apiKey.length} caracteres\n`);

  // Inicializar Resend
  console.log('🔧 Inicializando Resend...');
  const resend = new Resend(apiKey);
  console.log('✅ Cliente Resend criado\n');

  // Enviar e-mail de teste
  console.log('📧 Enviando e-mail de teste...');
  
  const emailData = {
    from: 'Terreiro Tia Maria <onboarding@resend.dev>',
    to: 'leonfpontes@gmail.com',
    subject: '🧪 Teste Direto - Resend API',
    html: '<h1>🎉 Teste de E-mail</h1><p>Se você recebeu este e-mail, a integração com Resend está funcionando perfeitamente!</p>',
  };

  console.log('📤 Dados do e-mail:');
  console.log(JSON.stringify(emailData, null, 2));
  console.log('');

  try {
    console.log('⏳ Chamando resend.emails.send()...');
    const result = await resend.emails.send(emailData);
    
    console.log('📥 Resposta completa da API:');
    console.log(JSON.stringify(result, null, 2));
    console.log('');

    if (result.data?.id) {
      console.log('✅ E-mail enviado com sucesso!');
      console.log(`   Message ID: ${result.data.id}`);
      console.log(`   Para: ${emailData.to}`);
      console.log('\n💡 Verifique:');
      console.log('   1. Caixa de entrada: leo.cuml@gmail.com');
      console.log('   2. Dashboard Resend: https://resend.com/emails');
      console.log(`   3. Busque pelo ID: ${result.data.id}\n`);
    } else {
      console.error('⚠️  E-mail pode ter sido enviado mas ID não foi retornado');
      console.error('   Resposta:', result);
    }

  } catch (error) {
    console.error('\n❌ ERRO ao enviar e-mail:');
    console.error('   Tipo:', error.constructor.name);
    console.error('   Mensagem:', error.message);
    
    if (error.response) {
      console.error('   Status HTTP:', error.response.status);
      console.error('   Dados:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.statusCode) {
      console.error('   Status Code:', error.statusCode);
    }
    
    console.error('\n📚 Stack trace:');
    console.error(error.stack);
    
    process.exit(1);
  }

  console.log('✅ Teste concluído!\n');
}

testResendDirect().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
