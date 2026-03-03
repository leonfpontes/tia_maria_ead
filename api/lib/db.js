'use strict';
const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    // SSL config: Neon requer rejectUnauthorized: false
    const sslConfig = { rejectUnauthorized: false };
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: sslConfig });
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
