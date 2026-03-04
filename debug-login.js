/**
 * Script de debug para testar login em produção
 * Executa: DATABASE_URL="postgres://..." node debug-login.js
 */
'use strict';
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

async function testLogin() {
  const databaseUrl = process.env.DATABASE_URL;

  console.log('🔍 DEBUG LOGIN');
  console.log('─'.repeat(50));

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL não configurado!');
    return;
  }

  console.log('✓ DATABASE_URL configurado');

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Testar conexão
    console.log('\n📡 Testando conexão com banco...');
    const testResult = await pool.query('SELECT NOW()');
    console.log('✓ Conectado ao banco:', testResult.rows[0].now);

    // Buscar usuário admin
    console.log('\n👤 Buscando usuário "admin"...');
    const userResult = await pool.query('SELECT id, username, password_hash FROM admins WHERE username = $1', [
      'admin',
    ]);

    if (userResult.rows.length === 0) {
      console.error('❌ Usuário "admin" não encontrado no banco!');
      console.log('   Usuários disponíveis:');
      const allUsers = await pool.query('SELECT id, username FROM admins');
      allUsers.rows.forEach((u) => console.log(`   - ${u.username} (id: ${u.id})`));
      return;
    }

    const admin = userResult.rows[0];
    console.log(`✓ Usuário encontrado (id: ${admin.id})`);
    console.log(`  Hash armazenado: ${admin.password_hash}`);

    // Testar bcrypt
    console.log('\n🔐 Testando bcrypt compare...');
    const password = 'admin123';
    console.log(`  Senha testando: "${password}"`);

    const matches = await bcrypt.compare(password, admin.password_hash);
    console.log(`  Resultado: ${matches ? '✓ MATCH' : '❌ SEM MATCH'}`);

    if (!matches) {
      console.log('\n⚠️  Hash pode estar corrompido ou ser de outra senha!');
      console.log('\n   Para resetar, gere um novo hash com:');
      console.log('   node -e "const bcrypt = require(\'bcryptjs\'); bcrypt.hash(\'admin123\', 10).then(console.log)"');
    }

    // Testar query
    console.log('\n🔍 Simulando query de login...');
    const loginResult = await pool.query('SELECT * FROM admins WHERE username = $1', ['admin']);
    if (loginResult.rows.length > 0) {
      console.log('✓ Query retornou resultado');
      const loginAdmin = loginResult.rows[0];
      const loginMatches = await bcrypt.compare(password, loginAdmin.password_hash);
      console.log(`  Compare resultado: ${loginMatches ? '✓ MATCH' : '❌ SEM MATCH'}`);
    }
  } catch (err) {
    console.error('❌ ERRO:', err.message);
    console.error('   Stack:', err.stack);
  } finally {
    await pool.end();
    console.log('\n✓ Conexão fechada');
  }
}

testLogin().catch(console.error);
