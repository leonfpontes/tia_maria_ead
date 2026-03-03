'use strict';
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const isSqliteMode = process.env.DB_DRIVER === 'sqlite';

let pool;
let sqliteContextPromise;

function normalizeParams(params = []) {
  return params.map((value) => {
    if (value === undefined) return null;
    if (value instanceof Date) return value.toISOString();
    return value;
  });
}

function convertPgQueryToSqlite(text, params = []) {
  const normalizedParams = normalizeParams(params);
  const orderedParams = [];
  let hasPgPlaceholders = false;

  const sql = text
    .replace(/\$(\d+)/g, (_, index) => {
      hasPgPlaceholders = true;
      const paramIndex = Number(index) - 1;
      orderedParams.push(paramIndex >= 0 ? normalizedParams[paramIndex] : null);
      return '?';
    })
    .replace(/\bILIKE\b/g, 'LIKE')
    .replace(/::text/g, '')
    .replace(/::timestamptz/g, '')
    .replace(/NOW\(\)/g, 'CURRENT_TIMESTAMP');

  return {
    sql,
    params: hasPgPlaceholders ? orderedParams : normalizedParams,
  };
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

function normalizeSqliteRowTimestamps(row) {
  const normalized = { ...row };
  const sqliteDateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

  for (const [key, value] of Object.entries(normalized)) {
    if (typeof value === 'string' && sqliteDateTimePattern.test(value)) {
      normalized[key] = `${value.replace(' ', 'T')}.000Z`;
    }
  }

  return normalized;
}

async function runSqlite(text, params = []) {
  const ctx = await getSqliteContext();
  const database = ctx.db;
  const converted = convertPgQueryToSqlite(text, params);
  const convertedSql = converted.sql;
  const convertedParams = converted.params;
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
    statement.bind(convertedParams);
    const rows = [];
    while (statement.step()) {
      rows.push(normalizeSqliteRowTimestamps(statement.getAsObject()));
    }
    statement.free();
    return { rows, rowCount: rows.length };
  }

  if (upper.includes('RETURNING')) {
    const statement = database.prepare(convertedSql);
    statement.bind(convertedParams);
    statement.step();
    const resultObj = normalizeSqliteRowTimestamps(statement.getAsObject());
    statement.free();
    persistSqliteDb(ctx);
    return { rows: [resultObj], rowCount: 1 };
  }

  database.run(convertedSql, convertedParams);
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
