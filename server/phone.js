'use strict';

const VALID_DDD = new Set([
  11,12,13,14,15,16,17,18,19,
  21,22,24,27,28,
  31,32,33,34,35,37,38,
  41,42,43,44,45,46,47,48,49,
  51,53,54,55,
  61,62,63,64,65,66,67,68,69,
  71,73,74,75,77,79,
  81,82,83,84,85,86,87,88,89,
  91,92,93,94,95,96,97,98,99
]);

/**
 * Formats a phone number for display: E.164 to +55 (XX) XXXXX-XXXX or +55 (XX) XXXX-XXXX
 * @param {string} phone - E.164 format e.g. +5511999990000
 * @returns {string} formatted string or input if invalid
 */
function formatPhoneDisplay(phone) {
  if (!phone) return '–';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('55')) {
    return `+55 (${digits.slice(2,4)}) ${digits.slice(4,9)}-${digits.slice(9)}`;
  }
  if (digits.length === 12 && digits.startsWith('55')) {
    return `+55 (${digits.slice(2,4)}) ${digits.slice(4,9)}-${digits.slice(9)}`;
  }
  if (digits.length === 11) {
    return `+55 (${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+55 (${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
  }
  return phone;
}

/**
 * Normalizes a Brazilian or international phone number to E.164 format.
 * @param {string} raw
 * @returns {string} E.164 string e.g. +5511999990000
 * @throws {Error} if invalid
 */
function normalizePhone(raw) {
  if (!raw || typeof raw !== 'string') throw new Error('Telefone inválido.');

  const trimmed = raw.trim();

  // Preserve leading + if present
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  if (hasPlus) {
    // International: must have at least 7 digits after the +
    if (digits.length < 7) throw new Error('Telefone internacional muito curto.');
    return `+${digits}`;
  }

  if (digits.length === 11) {
    const ddd = parseInt(digits.substring(0, 2), 10);
    if (!VALID_DDD.has(ddd)) throw new Error(`DDD inválido: ${ddd}.`);
    return `+55${digits}`;
  }

  if (digits.length === 10) {
    const ddd = parseInt(digits.substring(0, 2), 10);
    if (!VALID_DDD.has(ddd)) throw new Error(`DDD inválido: ${ddd}.`);
    return `+55${digits}`;
  }

  // Allow 13-digit strings that already include country code 55
  if (digits.length === 13 && digits.startsWith('55')) {
    const ddd = parseInt(digits.substring(2, 4), 10);
    if (!VALID_DDD.has(ddd)) throw new Error(`DDD inválido: ${ddd}.`);
    return `+${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('55')) {
    const ddd = parseInt(digits.substring(2, 4), 10);
    if (!VALID_DDD.has(ddd)) throw new Error(`DDD inválido: ${ddd}.`);
    return `+${digits}`;
  }

  throw new Error('Telefone inválido. Use formato com DDD: (11) 99999-9999 ou +55 11 99999-9999.');
}

module.exports = { normalizePhone, formatPhoneDisplay };
