import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../src/components/LoginForm.jsx';

describe('LoginForm', () => {
  test('renderiza campos de email e senha', () => {
    render(<LoginForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  test('exibe erro quando email está vazio', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
  });

  test('exibe erro quando email tem formato inválido', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'joao@email');
    await user.type(screen.getByLabelText(/senha/i), 'Senha@2026');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(screen.getByText(/formato de email inválido/i)).toBeInTheDocument();
  });

  test('normaliza email para minúsculas antes de submeter', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockResolvedValue();
    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'Maria.Silva@Exemplo.COM');
    await user.type(screen.getByLabelText(/senha/i), 'Senha@2026');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'maria.silva@exemplo.com',
        password: 'Senha@2026'
      });
    });
  });

  test('exibe mensagem de erro de backend ao falhar', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockRejectedValue(new Error('Email ou senha incorretos'));
    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'user@exemplo.com');
    await user.type(screen.getByLabelText(/senha/i), 'senhaErrada');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByTestId('form-error')).toHaveTextContent('Email ou senha incorretos');
    });
  });

  test('desabilita botão durante submissão', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn(() => new Promise(() => {})); // nunca resolve
    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'user@exemplo.com');
    await user.type(screen.getByLabelText(/senha/i), 'Senha@2026');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent(/entrando/i);
  });

  test('marca campos inválidos com aria-invalid para acessibilidade', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/senha/i)).toHaveAttribute('aria-invalid', 'true');
  });
});
