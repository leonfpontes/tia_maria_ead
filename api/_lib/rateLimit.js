'use strict';

/**
 * Checks rate limit using the rate_limits table.
 * @param {object} db - db module with query()
 * @param {string} chave - identifier (e.g. IP address)
 * @param {string} endpoint - endpoint name
 * @param {number} maxRequests - max allowed requests in window
 * @param {number} windowSeconds - time window in seconds
 * @returns {Promise<{allowed: boolean, remaining: number}>}
 */
async function checkRateLimit(db, chave, endpoint, maxRequests, windowSeconds) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowSeconds * 1000);

  // Clean stale windows and upsert in one round-trip using a CTE
  const result = await db.query(
    `INSERT INTO rate_limits (chave, endpoint, contagem, janela_inicio)
     VALUES ($1, $2, 1, NOW())
     ON CONFLICT (chave, endpoint) DO UPDATE
       SET contagem = CASE
             WHEN rate_limits.janela_inicio < $3 THEN 1
             ELSE rate_limits.contagem + 1
           END,
           janela_inicio = CASE
             WHEN rate_limits.janela_inicio < $3 THEN NOW()
             ELSE rate_limits.janela_inicio
           END
     RETURNING contagem`,
    [chave, endpoint, windowStart]
  );

  const contagem = result.rows[0].contagem;
  const allowed = contagem <= maxRequests;
  const remaining = Math.max(0, maxRequests - contagem);

  return { allowed, remaining };
}

module.exports = { checkRateLimit };
