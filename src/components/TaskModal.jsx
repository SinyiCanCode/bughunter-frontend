import { useEffect, useState } from 'react';

const TITLE_MAX = 100;

/**
 * Modal de criação/edição de tarefa.
 * Reusa pra ambos: se recebe `task`, é edição; senão, criação.
 */
export default function TaskModal({ task, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [status, setStatus] = useState('pendente');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
    }
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) {
      setError('Título é obrigatório');
      return;
    }
    if (title.length > TITLE_MAX) {
      setError(`Título deve ter no máximo ${TITLE_MAX} caracteres`);
      return;
    }
    onSave({ title: title.trim(), description: description.trim(), priority, status });
  };

  return (
    <div
      data-cy="task-modal"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 8,
          minWidth: 320,
          maxWidth: 500,
        }}
      >
        <h2>{task ? 'Editar tarefa' : 'Nova tarefa'}</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="task-title-input">Título</label>
          <input
            id="task-title-input"
            data-cy="task-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            maxLength={TITLE_MAX}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          <div data-cy="title-counter" style={{ fontSize: '0.8rem', color: '#666' }}>
            {title.length}/{TITLE_MAX}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="task-desc-input">Descrição</label>
          <textarea
            id="task-desc-input"
            data-cy="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="task-priority-select">Prioridade</label>
          <select
            id="task-priority-select"
            data-cy="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>

        {task && (
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="task-status-select">Status</label>
            <select
              id="task-status-select"
              data-cy="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pendente">Pendente</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>
        )}

        {error && (
          <div role="alert" data-cy="task-error" style={{ color: '#c00', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" data-cy="task-save" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
