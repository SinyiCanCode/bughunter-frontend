import { useState } from 'react';
import { truncate } from '../utils/validators.js';

const TITLE_DISPLAY_LIMIT = 60;

/**
 * Lista de tarefas com filtro por status e ordenação.
 */
export default function TaskList({ tasks = [], onDelete }) {
  const [filter, setFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('createdAt');

  const filtered = tasks.filter((t) => {
    if (filter === 'todas') return true;
    return t.status === filter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'priority') {
      const order = { alta: 0, media: 1, baixa: 2 };
      return order[a.priority] - order[b.priority];
    }
    return 0;
  });

  if (tasks.length === 0) {
    return (
      <div data-testid="empty-state">
        <p>Nenhuma tarefa cadastrada</p>
        <button>Criar primeira tarefa</button>
      </div>
    );
  }

  return (
    <div>
      <div role="toolbar" aria-label="Filtros">
        <label>
          Filtrar:
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar por status">
            <option value="todas">Todas</option>
            <option value="pendente">Pendentes</option>
            <option value="concluida">Concluídas</option>
          </select>
        </label>

        <label>
          Ordenar:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Ordenar por">
            <option value="createdAt">Data de criação</option>
            <option value="priority">Prioridade</option>
          </select>
        </label>
      </div>

      <ul aria-label="Lista de tarefas">
        {sorted.map((task) => (
          <li key={task.id} data-testid={`task-${task.id}`}>
            <span data-testid={`title-${task.id}`}>
              {truncate(task.title, TITLE_DISPLAY_LIMIT)}
            </span>
            <span data-testid={`priority-${task.id}`}>{task.priority}</span>
            <span data-testid={`status-${task.id}`}>{task.status}</span>
            <button onClick={() => onDelete(task.id)} aria-label={`Excluir ${task.title}`}>
              Excluir
            </button>
          </li>
        ))}
      </ul>

      {sorted.length === 0 && (
        <p data-testid="no-results">Nenhuma tarefa corresponde ao filtro.</p>
      )}
    </div>
  );
}
