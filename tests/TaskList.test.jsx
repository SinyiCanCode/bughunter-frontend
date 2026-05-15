import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../src/components/TaskList.jsx';

const mockTasks = [
  { id: '1', title: 'Comprar leite', priority: 'media', status: 'pendente', createdAt: '2026-05-10' },
  { id: '2', title: 'Pagar conta de luz', priority: 'alta', status: 'pendente', createdAt: '2026-05-12' },
  { id: '3', title: 'Ler livro', priority: 'baixa', status: 'concluida', createdAt: '2026-05-08' }
];

describe('TaskList', () => {
  test('exibe estado vazio quando não há tarefas', () => {
    render(<TaskList tasks={[]} onDelete={jest.fn()} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/nenhuma tarefa cadastrada/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar primeira tarefa/i })).toBeInTheDocument();
  });

  test('renderiza todas as tarefas por padrão', () => {
    render(<TaskList tasks={mockTasks} onDelete={jest.fn()} />);

    expect(screen.getByText('Comprar leite')).toBeInTheDocument();
    expect(screen.getByText('Pagar conta de luz')).toBeInTheDocument();
    expect(screen.getByText('Ler livro')).toBeInTheDocument();
  });

  test('filtra por tarefas pendentes', async () => {
    const user = userEvent.setup();
    render(<TaskList tasks={mockTasks} onDelete={jest.fn()} />);

    await user.selectOptions(screen.getByLabelText(/filtrar por status/i), 'pendente');

    expect(screen.getByText('Comprar leite')).toBeInTheDocument();
    expect(screen.getByText('Pagar conta de luz')).toBeInTheDocument();
    expect(screen.queryByText('Ler livro')).not.toBeInTheDocument();
  });

  test('filtra por tarefas concluídas', async () => {
    const user = userEvent.setup();
    render(<TaskList tasks={mockTasks} onDelete={jest.fn()} />);

    await user.selectOptions(screen.getByLabelText(/filtrar por status/i), 'concluida');

    expect(screen.queryByText('Comprar leite')).not.toBeInTheDocument();
    expect(screen.getByText('Ler livro')).toBeInTheDocument();
  });

  test('mostra mensagem quando filtro não retorna resultados', async () => {
    const user = userEvent.setup();
    const onlyDone = [mockTasks[2]];
    render(<TaskList tasks={onlyDone} onDelete={jest.fn()} />);

    await user.selectOptions(screen.getByLabelText(/filtrar por status/i), 'pendente');

    expect(screen.getByTestId('no-results')).toBeInTheDocument();
  });

  test('chama onDelete com o id correto ao clicar em excluir', async () => {
    const user = userEvent.setup();
    const handleDelete = jest.fn();
    render(<TaskList tasks={mockTasks} onDelete={handleDelete} />);

    await user.click(screen.getByRole('button', { name: /excluir comprar leite/i }));

    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  test('trunca títulos muito longos no display', () => {
    const longTitle = 'a'.repeat(100);
    const tasksWithLongTitle = [
      { id: '1', title: longTitle, priority: 'media', status: 'pendente', createdAt: '2026-05-10' }
    ];

    render(<TaskList tasks={tasksWithLongTitle} onDelete={jest.fn()} />);

    const displayed = screen.getByTestId('title-1').textContent;
    expect(displayed.length).toBeLessThan(longTitle.length);
    expect(displayed.endsWith('…')).toBe(true);
  });

  test('ordena por prioridade quando solicitado', async () => {
    const user = userEvent.setup();
    render(<TaskList tasks={mockTasks} onDelete={jest.fn()} />);

    await user.selectOptions(screen.getByLabelText(/ordenar por/i), 'priority');

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Pagar conta de luz'); // alta
    expect(items[1]).toHaveTextContent('Comprar leite');      // media
    expect(items[2]).toHaveTextContent('Ler livro');          // baixa
  });
});
