'use strict';
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const isSqliteMode = process.env.DB_DRIVER === 'sqlite';

let pool;
let sqliteContextPromise;

function pgToSqliteSql(text) {
  return text
    .replace(/\$\d+/g, '?')
    .replace(/\bILIKE\b/g, 'LIKE')
    .replace(/::text/g, '')
    .replace(/::timestamptz/g, '')
    .replace(/NOW\(\)/g, 'CURRENT_TIMESTAMP');
}

function normalizeParams(params = []) {
  return params.map((value) => {
    if (value === undefined) return null;
    if (value instanceof Date) return value.toISOString();
    return value;
  });
}

async function getSqliteContext() {
  if (!sqliteContextPromise) {
    sqliteContextPromise = (async () => {
      const initSqlJs = require('sql.js');
      const SQL = await initSqlJs({});
      const filePath = path.resolve(process.env.SQLITE_PATH || './local.sqlite');

      let db;
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        db = new SQL.Database(fileBuffer);
      } else {
        db = new SQL.Database();
      }

      db.run('PRAGMA foreign_keys = ON;');
      return { SQL, db, filePath };
    })();
  }

  return sqliteContextPromise;
}

function persistSqliteDb(ctx) {
  const exported = ctx.db.export();
  fs.writeFileSync(ctx.filePath, Buffer.from(exported));
}

async function runSqlite(text, params = []) {
  const ctx = await getSqliteContext();
  const database = ctx.db;
  const convertedSql = pgToSqliteSql(text);
  const normalizedParams = normalizeParams(params);
  const trimmed = convertedSql.trim();
  const upper = trimmed.toUpperCase();

  if (upper === 'BEGIN' || upper === 'COMMIT' || upper === 'ROLLBACK') {
    database.exec(upper);
    if (upper === 'COMMIT') persistSqliteDb(ctx);
    return { rows: [], rowCount: 0 };
  }

  if (upper.startsWith('SELECT PG_ADVISORY_XACT_LOCK')) {
    return { rows: [{ pg_advisory_xact_lock: 1 }], rowCount: 1 };
  }

  if (upper.startsWith('SELECT')) {
    const statement = database.prepare(convertedSql);
    statement.bind(normalizedParams);
    const rows = [];
    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
    statement.free();
    return { rows, rowCount: rows.length };
  }

  if (upper.includes('RETURNING')) {
    const statement = database.prepare(convertedSql);
    statement.bind(normalizedParams);
    const rows = [];
    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
    statement.free();
    persistSqliteDb(ctx);
    return { rows, rowCount: rows.length };
  }

  database.run(convertedSql, normalizedParams);
  persistSqliteDb(ctx);
  return { rows: [], rowCount: 0 };
}

function getPool() {
  if (!pool) {
    const sslConfig = { rejectUnauthorized: false };
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: sslConfig });
  }
  return pool;
}

async function query(text, params) {
  if (isSqliteMode) {
    return runSqlite(text, params);
  }
  return getPool().query(text, params);
}

async function getClient() {
  if (isSqliteMode) {
    return {
      query,
      release: () => {},
    };
  }
  return getPool().connect();
}

module.exports = {
  query,
  getClient,
  isSqliteMode,
};
