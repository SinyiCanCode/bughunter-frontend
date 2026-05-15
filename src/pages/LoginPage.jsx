import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';
import { login } from '../api/mockApi.js';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    await login(email, password);
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Entrar</h1>
      <LoginForm onSubmit={handleSubmit} />
      <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#666' }}>
        Demo: <code>maria.silva@exemplo.com</code> / <code>Senha@2026</code>
      </p>
    </div>
  );
}
