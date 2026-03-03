#!/usr/bin/env node
/**
 * Script de diagnóstico - Testa conexão com banco de dados
 * Uso: node test-connection.js
 */

require('dotenv').config();

async function test() {
  console.log('🔍 Diagnóstico de Conexão\n');
  
  // Verificar variáveis de ambiente
  console.log('1️⃣ Variáveis de Ambiente:');
  console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ NÃO CONFIGURADA');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurada' : '❌ NÃO CONFIGURADA');
  console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
  
  if (!process.env.DATABASE_URL) {
    console.log('\n⚠️  DATABASE_URL não está configurada!');
    console.log('   Certifique-se de:');
    console.log('   1. Copiar DATABASE_URL do Neon');
    console.log('   2. Configurar em Vercel → Settings → Environment Variables');
    console.log('   3. Fazer redeploy\n');
    return;
  }

  // Testar conexão com banco
  console.log('\n2️⃣ Testando Conexão com Banco de Dados...');
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    console.log('   ✅ Conexão com banco: SUCESSO');

    // Verificar se tabelas existem
    const result = await client.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admins')`
    );
    
    if (result.rows[0].exists) {
      console.log('   ✅ Tabela "admins": EXISTE');
    } else {
      console.log('   ❌ Tabela "admins": NÃO ENCONTRADA');
      console.log('      Execute a migration: psql -f db/migrations/001_create_tables.sql');
    }

    // Contar usuários
    const adminsResult = await client.query('SELECT COUNT(*) FROM admins');
    const count = adminsResult.rows[0].count;
    console.log(`   ℹ️  Usuários admin no banco: ${count}`);

    if (count === 0) {
      console.log('   ⚠️  Nenhum admin criado! Execute:');
      console.log(`      node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10))"`);
      console.log('      Copie o hash e execute no Neon SQL Editor:');
      console.log(`      INSERT INTO admins (username, password_hash, role) VALUES ('admin', '[HASH_AQUI]', 'ADMIN');`);
    }

    client.release();
    await pool.end();

  } catch (err) {
    console.log('   ❌ Erro ao conectar:', err.message);
    console.log('\n   Possíveis soluções:');
    console.log('   1. Verifique se DATABASE_URL está correta');
    console.log('   2. Verifique firewall/IP allowlist no Neon');
    console.log('   3. Verifique se o banco ainda existe');
  }

  // Verificar dependências
  console.log('\n3️⃣ Dependências Instaladas:');
  try {
    require('pg');
    console.log('   ✅ pg');
  } catch {
    console.log('   ❌ pg');
  }
  
  try {
    require('bcryptjs');
    console.log('   ✅ bcryptjs');
  } catch {
    console.log('   ❌ bcryptjs');
  }

  try {
    require('jsonwebtoken');
    console.log('   ✅ jsonwebtoken');
  } catch {
    console.log('   ❌ jsonwebtoken');
  }

  console.log('\n✅ Diagnóstico concluído!\n');
}

test().catch(console.error);
