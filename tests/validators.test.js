import {
  isValidEmail,
  normalizeEmail,
  evaluatePassword,
  sanitizeInput,
  truncate
} from '../src/utils/validators.js';

describe('isValidEmail', () => {
  describe('emails válidos', () => {
    test.each([
      ['maria.silva@exemplo.com'],
      ['user+tag@dominio.com.br'],
      ['a@b.co'],
      ['nome_sobrenome@empresa.org']
    ])('aceita %s', (email) => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  describe('emails inválidos', () => {
    test.each([
      ['joao@email'],         // sem TLD — BUG-001
      ['joao@'],
      ['@email.com'],
      ['joao email.com'],
      [''],
      ['   '],
      ['sem-arroba.com']
    ])('rejeita %s', (email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  describe('tipos inválidos', () => {
    test('rejeita null', () => expect(isValidEmail(null)).toBe(false));
    test('rejeita undefined', () => expect(isValidEmail(undefined)).toBe(false));
    test('rejeita número', () => expect(isValidEmail(123)).toBe(false));
    test('rejeita objeto', () => expect(isValidEmail({})).toBe(false));
  });

  test('rejeita email com mais de 254 caracteres', () => {
    const longEmail = 'a'.repeat(250) + '@b.co';
    expect(isValidEmail(longEmail)).toBe(false);
  });
});

describe('normalizeEmail', () => {
  test('converte para minúsculas', () => {
    expect(normalizeEmail('Maria.Silva@Exemplo.COM')).toBe('maria.silva@exemplo.com');
  });

  test('remove espaços em branco nas pontas', () => {
    expect(normalizeEmail('  user@dominio.com  ')).toBe('user@dominio.com');
  });

  test('retorna string vazia para entrada inválida', () => {
    expect(normalizeEmail(null)).toBe('');
    expect(normalizeEmail(undefined)).toBe('');
    expect(normalizeEmail(123)).toBe('');
  });
});

describe('evaluatePassword', () => {
  test('senha menor que 8 caracteres é inválida', () => {
    const result = evaluatePassword('abc1');
    expect(result.valid).toBe(false);
    expect(result.label).toBe('fraca');
  });

  test('senha com apenas letras minúsculas é fraca', () => {
    const result = evaluatePassword('abcdefgh');
    expect(result.valid).toBe(false);
  });

  test('senha forte (4 critérios) é válida', () => {
    const result = evaluatePassword('Senha@2026');
    expect(result.valid).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(3);
  });

  test('senha de 12+ caracteres ganha ponto extra', () => {
    const result = evaluatePassword('SenhaForte@2026!');
    expect(result.label).toBe('muito forte');
  });

  test('retorna inválido para entrada não-string', () => {
    expect(evaluatePassword(null).valid).toBe(false);
    expect(evaluatePassword(12345678).valid).toBe(false);
  });
});

describe('sanitizeInput', () => {
  test('remove tags HTML', () => {
    expect(sanitizeInput('<b>texto</b>')).toBe('texto');
  });

  test('remove script malicioso', () => {
    expect(sanitizeInput('Olá <script>alert("xss")</script> mundo')).toBe('Olá  mundo');
  });

  test('preserva texto sem HTML', () => {
    expect(sanitizeInput('Comprar leite e pão')).toBe('Comprar leite e pão');
  });

  test('retorna string vazia para entrada inválida', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
  });
});

describe('truncate', () => {
  test('não trunca string menor que o limite', () => {
    expect(truncate('curto', 10)).toBe('curto');
  });

  test('trunca string maior que o limite e adiciona reticências', () => {
    expect(truncate('texto muito longo aqui', 10)).toBe('texto mui…');
  });

  test('respeita exatamente o limite', () => {
    expect(truncate('abcdefghij', 10)).toBe('abcdefghij');
  });

  test('retorna vazio para limite zero ou negativo', () => {
    expect(truncate('qualquer', 0)).toBe('');
    expect(truncate('qualquer', -5)).toBe('');
  });

  test('retorna string vazia para entrada inválida', () => {
    expect(truncate(null, 10)).toBe('');
    expect(truncate(undefined, 10)).toBe('');
  });
});
