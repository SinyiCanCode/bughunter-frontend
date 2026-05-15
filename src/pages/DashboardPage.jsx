import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  logout,
  getSession,
} from '../api/mockApi.js';
import { useToast } from '../components/ToastProvider.jsx';
import TaskModal from '../components/TaskModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

export default function DashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('createdAt');
  const [editing, setEditing] = useState(null); // null | 'new' | task
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const session = getSession();

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
    setTasks(listTasks());
  }, [session, navigate]);

  const refresh = () => {
    setTasks(listTasks());
  };

  const handleNew = () => setEditing('new');

  const handleSave = (data) => {
    if (editing === 'new') {
      createTask(data);
      toast.show('Tarefa criada');
    } else {
      updateTask(editing.id, data);
      toast.show('Tarefa atualizada');
    }
    setEditing(null);
    refresh();
  };

  const handleConfirmDelete = () => {
    deleteTask(confirmingDelete.id);
    toast.show('Tarefa excluída');
    setConfirmingDelete(null);
    refresh();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filtered = tasks.filter((t) => filter === 'todas' || t.status === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'priority') {
      const order = { alta: 0, media: 1, baixa: 2 };
      return order[a.priority] - order[b.priority];
    }
    return 0;
  });

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Olá, {session?.name || 'usuário'}</h1>

        <div style={{ position: 'relative' }}>
          <button data-cy="user-menu" onClick={() => setMenuOpen((v) => !v)}>
            Menu
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                background: 'white',
                border: '1px solid #ddd',
                padding: '0.5rem',
                zIndex: 10,
              }}
            >
              <button data-cy="logout" onClick={handleLogout}>
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      {tasks.length === 0 ? (
        <div data-cy="empty-state" style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p>Nenhuma tarefa cadastrada</p>
          <button data-cy="new-task" onClick={handleNew}>
            Criar primeira tarefa
          </button>
        </div>
      ) : (
        <>
          <div role="toolbar" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <button data-cy="new-task" onClick={handleNew}>
              Nova tarefa
            </button>
            <label>
              Filtrar:
              <select
                data-cy="filter-status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="todas">Todas</option>
                <option value="pendente">Pendentes</option>
                <option value="concluida">Concluídas</option>
              </select>
            </label>
            <label>
              Ordenar:
              <select data-cy="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="createdAt">Data</option>
                <option value="priority">Prioridade</option>
              </select>
            </label>
          </div>

          <ul aria-label="Lista de tarefas" style={{ listStyle: 'none', padding: 0 }}>
            {sorted.map((task) => (
              <li
                key={task.id}
                data-cy={`task-${task.id}`}
                style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong>{task.title}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    <span data-cy={`priority-${task.id}`}>{task.priority}</span>
                    {' · '}
                    <span data-cy={`status-${task.id}`}>{task.status}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button data-cy="edit" onClick={() => setEditing(task)}>
                    Editar
                  </button>
                  <button data-cy="delete" onClick={() => setConfirmingDelete(task)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {editing && (
        <TaskModal
          task={editing === 'new' ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {confirmingDelete && (
        <ConfirmDialog
          message={`Tem certeza que deseja excluir "${confirmingDelete.title}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmingDelete(null)}
        />
      )}
    </div>
  );
}
