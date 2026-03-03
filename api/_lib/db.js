'use strict';
const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    const sslConfig = process.env.NODE_ENV === 'production'
      ? { ssl: true }
      : { ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false } };
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ...sslConfig });
  }
  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

async function getClient() {
  return getPool().connect();
}

module.exports = { query, getClient };
