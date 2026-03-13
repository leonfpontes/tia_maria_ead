'use strict';
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const dbPath = path.join(__dirname, '..', 'local.sqlite');

async function main() {
  const SQL = await initSqlJs({});
  const db = new SQL.Database(fs.readFileSync(dbPath));
  db.run('PRAGMA foreign_keys = ON;');

  // Criar gira de teste
  const hoje = new Date();
  hoje.setHours(19, 30, 0, 0);
  const isoData = hoje.toISOString().replace('T', ' ').slice(0, 19);

  try {
    db.run(
      `INSERT INTO giras (id, titulo, linha, data_inicio, status, tipo_card)
       VALUES (99, 'Gira de Caboclos - Teste', 'Caboclos', ?, 'PUBLICADA', 'CABOCLOS_BOIADEIROS')`,
      [isoData]
    );
  } catch (e) {
    if (!e.message.includes('UNIQUE')) console.log('Gira já existe, atualizando...');
    db.run(`UPDATE giras SET status = 'PUBLICADA' WHERE id = 99`);
  }

  try {
    db.run(
      `INSERT INTO controles_senha (gira_id, total_senhas, liberacao_inicio, status)
       VALUES (99, 30, ?, 'ABERTO')`,
      [isoData]
    );
  } catch (e) { /* já existe */ }

  // 8 senhas de teste
  const pessoas = [
    { nome: 'Maria da Conceição',   tel: '+5511999001001', email: 'maria@teste.com',   pref: 0 },
    { nome: 'José Antônio Silva',   tel: '+5511999002002', email: 'jose@teste.com',    pref: 1 },
    { nome: 'Ana Paula Santos',     tel: '+5511999003003', email: 'ana@teste.com',     pref: 0 },
    { nome: 'Carlos Eduardo Lima',  tel: '+5511999004004', email: 'carlos@teste.com',  pref: 0 },
    { nome: 'Francisca Oliveira',   tel: '+5511999005005', email: 'fran@teste.com',    pref: 1 },
    { nome: 'Pedro Henrique Costa', tel: '+5511999006006', email: 'pedro@teste.com',   pref: 0 },
    { nome: 'Luciana Ferreira',     tel: '+5511999007007', email: 'lu@teste.com',      pref: 0 },
    { nome: 'Roberto Nascimento',   tel: '+5511999008008', email: 'roberto@teste.com', pref: 0 },
  ];

  // Limpar senhas anteriores da gira de teste
  db.run(`DELETE FROM senhas WHERE gira_id = 99`);

  for (let i = 0; i < pessoas.length; i++) {
    const p = pessoas[i];
    const num = i + 1;
    const norm = p.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    db.run(
      `INSERT INTO senhas (gira_id, numero, nome, telefone, nome_normalizado, email, is_preferencial, status)
       VALUES (99, ?, ?, ?, ?, ?, ?, 'ATIVA')`,
      [num, p.nome, p.tel, norm, p.email, p.pref]
    );
  }

  // Check-in de 5 pessoas (as demais aguardam)
  db.run(`UPDATE senhas SET chegada_em = datetime('now', '-25 minutes') WHERE gira_id = 99 AND numero = 1`);
  db.run(`UPDATE senhas SET chegada_em = datetime('now', '-20 minutes') WHERE gira_id = 99 AND numero = 2`);
  db.run(`UPDATE senhas SET chegada_em = datetime('now', '-15 minutes') WHERE gira_id = 99 AND numero = 3`);
  db.run(`UPDATE senhas SET chegada_em = datetime('now', '-10 minutes') WHERE gira_id = 99 AND numero = 5`);
  db.run(`UPDATE senhas SET chegada_em = datetime('now', '-5 minutes')  WHERE gira_id = 99 AND numero = 6`);

  // #02 José - ATENDIDA COM info de médium/cambone/obs (ícone ℹ️ verde)
  db.run(`UPDATE senhas SET
    status = 'ATENDIDA',
    atendida_em = datetime('now', '-12 minutes'),
    atendida_por_admin_id = 1,
    medium_nome = 'Pai João de Aruanda',
    cambone_nome = 'Irmã Cristina',
    observacao = 'Consulente emocionada, orientada a retornar na próxima gira.'
    WHERE gira_id = 99 AND numero = 2`);

  // #03 Ana Paula - ATENDIDA SEM info (ícone ℹ️ apagado, para testar preenchimento)
  db.run(`UPDATE senhas SET
    status = 'ATENDIDA',
    atendida_em = datetime('now', '-8 minutes'),
    atendida_por_admin_id = 1
    WHERE gira_id = 99 AND numero = 3`);

  // #04 Carlos - NO_SHOW
  db.run(`UPDATE senhas SET status = 'NO_SHOW' WHERE gira_id = 99 AND numero = 4`);

  fs.writeFileSync(dbPath, Buffer.from(db.export()));
  db.close();

  console.log('\n✅ Dados de teste populados!');
  console.log('═══════════════════════════════════════════════');
  console.log('Gira: "Gira de Caboclos - Teste" (id=99)');
  console.log('═══════════════════════════════════════════════');
  console.log('  #01 Maria da Conceição    — ATIVA, check-in feito (próxima na fila)');
  console.log('  #02 José Antônio ⭐ Pref  — ATENDIDA, COM info médium/cambone/obs');
  console.log('  #03 Ana Paula Santos      — ATENDIDA, SEM info (testar ícone ℹ️)');
  console.log('  #04 Carlos Eduardo        — NO_SHOW');
  console.log('  #05 Francisca ⭐ Pref     — ATIVA, check-in feito');
  console.log('  #06 Pedro Henrique        — ATIVA, check-in feito');
  console.log('  #07 Luciana Ferreira      — ATIVA, aguardando check-in');
  console.log('  #08 Roberto Nascimento    — ATIVA, aguardando check-in');
  console.log('═══════════════════════════════════════════════');
  console.log('\nCenários de teste:');
  console.log('  1. Clicar ℹ️ no #02 → drawer com dados preenchidos (editar/ver)');
  console.log('  2. Clicar ℹ️ no #03 → drawer vazio (preencher e salvar)');
  console.log('  3. Clicar "✓ Atendida" no #01 → drawer abre automaticamente');
  console.log('  4. Walk-in → testar botão "➕ Incluir Walk-in"');
}

main().catch(e => { console.error(e); process.exit(1); });
