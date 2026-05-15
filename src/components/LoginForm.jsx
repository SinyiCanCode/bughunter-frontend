import { useState } from 'react';
import { isValidEmail, normalizeEmail } from '../utils/validators.js';

/**
 * Formulário de login com validação inline.
 * Demonstra padrões corretos que evitam BUG-001 e BUG-002.
 */
export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Formato de email inválido';
    }
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      // Normaliza email antes de enviar — evita BUG-002
      await onSubmit({ email: normalizeEmail(email), password });
    } catch (err) {
      setErrors({ form: err.message || 'Email ou senha incorretos' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Formulário de login" noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          data-cy="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          data-cy="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <span id="password-error" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      {errors.form && (
        <div role="alert" data-testid="form-error" data-cy="form-error">
          {errors.form}
        </div>
      )}

      <button type="submit" data-cy="submit" disabled={submitting}>
        {submitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
