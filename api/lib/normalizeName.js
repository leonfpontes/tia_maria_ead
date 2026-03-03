'use strict';

/**
 * Normalizes a name: trim, collapse spaces, uppercase, remove accents.
 * @param {string} raw
 * @returns {string}
 */
function normalizeName(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

module.exports = { normalizeName };
