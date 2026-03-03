'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const initSqlJs = require('sql.js');

const root = path.resolve(__dirname, '..');
const dbPath = process.env.SQLITE_PATH
  ? path.resolve(process.env.SQLITE_PATH)
  : path.join(root, 'local.sqlite');
const migrationPath = path.join(root, 'db', 'migrations', '001_create_tables.sqlite.sql');

const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

async function main() {
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const SQL = await initSqlJs({});

  let db;
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON;');

  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  db.run(migrationSql);

  const checkStmt = db.prepare('SELECT id FROM admins WHERE username = ?');
  checkStmt.bind([adminUser]);
  const exists = checkStmt.step();
  checkStmt.free();

  if (!exists) {
    const hash = bcrypt.hashSync(adminPass, 10);
    db.run('INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)', [adminUser, hash, 'ADMIN']);
    console.log(`Admin criado: ${adminUser}`);
    console.log(`Senha: ${adminPass}`);
  } else {
    console.log(`Admin já existe: ${adminUser}`);
  }

  fs.writeFileSync(dbPath, Buffer.from(db.export()));
  db.close();

  console.log(`SQLite pronto em: ${dbPath}`);
}

main().catch((error) => {
  console.error('Erro no setup SQLite:', error);
  process.exit(1);
});
