/**
 * Utilitários de validação compartilhados.
 *
 * Funções puras, fáceis de testar isoladamente.
 */

/**
 * Valida formato de email conforme RFC 5322 simplificada.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return regex.test(trimmed);
}

/**
 * Normaliza email para armazenamento e comparação:
 * remove espaços e converte para minúsculas.
 *
 * Importante para evitar bugs como BUG-002 (login case-sensitive).
 * @param {string} email
 * @returns {string}
 */
export function normalizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Avalia força da senha em 4 níveis: fraca, média, forte, muito forte.
 * Critérios: tamanho, maiúsculas, minúsculas, número, caractere especial.
 * @param {string} password
 * @returns {{score: number, label: string, valid: boolean}}
 */
export function evaluatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return { score: 0, label: 'fraca', valid: false };
  }

  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  const labels = ['fraca', 'fraca', 'média', 'forte', 'muito forte', 'muito forte'];
  return {
    score,
    label: labels[score],
    valid: score >= 3
  };
}

/**
 * Sanitiza string removendo tags HTML básicas.
 * Defesa em profundidade — não substitui escape no render.
 * @param {string} input
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Trunca string respeitando limite e adicionando reticências.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength) {
  if (typeof text !== 'string') return '';
  if (maxLength <= 0) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}
