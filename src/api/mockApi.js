/**
 * Camada de dados em memória — simula o backend pro app demo.
 *
 * Em projeto real, seria fetch/axios contra a API.
 * Aqui, dados ficam em sessionStorage pra persistir entre rotas
 * mas sumir entre testes Cypress (que limpa storage no beforeEach).
 */

const STORAGE_KEYS = {
  USERS: 'taskflow:users',
  TASKS: 'taskflow:tasks',
  SESSION: 'taskflow:session',
};

// Usuários hardcoded pra demo. Em real, viria do backend.
const SEED_USERS = [
  {
    id: '1',
    name: 'Maria',
    email: 'maria.silva@exemplo.com',
    password: 'Senha@2026',
  },
];

function load(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

// ---------- API simulada ----------

export async function login(email, password) {
  const users = load(STORAGE_KEYS.USERS, SEED_USERS);
  const normalizedInput = normalizeEmail(email);
  const user = users.find(
    (u) => normalizeEmail(u.email) === normalizedInput && u.password === password
  );

  if (!user) {
    throw new Error('Email ou senha incorretos');
  }

  const session = { userId: user.id, name: user.name };
  save(STORAGE_KEYS.SESSION, session);
  return session;
}

export function logout() {
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function getSession() {
  return load(STORAGE_KEYS.SESSION, null);
}

export function listTasks() {
  const session = getSession();
  if (!session) return [];
  const tasks = load(STORAGE_KEYS.TASKS, {});
  return tasks[session.userId] || [];
}

export function createTask({ title, description = '', priority = 'media' }) {
  const session = getSession();
  if (!session) throw new Error('Não autenticado');

  const tasks = load(STORAGE_KEYS.TASKS, {});
  const userTasks = tasks[session.userId] || [];

  const newTask = {
    id: `task-${Date.now()}`,
    title: title.trim(),
    description: description.trim(),
    priority,
    status: 'pendente',
    createdAt: new Date().toISOString(),
  };

  tasks[session.userId] = [...userTasks, newTask];
  save(STORAGE_KEYS.TASKS, tasks);
  return newTask;
}

export function updateTask(taskId, fields) {
  const session = getSession();
  if (!session) throw new Error('Não autenticado');

  const tasks = load(STORAGE_KEYS.TASKS, {});
  const userTasks = tasks[session.userId] || [];
  const updated = userTasks.map((t) =>
    t.id === taskId ? { ...t, ...fields } : t
  );

  tasks[session.userId] = updated;
  save(STORAGE_KEYS.TASKS, tasks);
  return updated.find((t) => t.id === taskId);
}

export function deleteTask(taskId) {
  const session = getSession();
  if (!session) throw new Error('Não autenticado');

  const tasks = load(STORAGE_KEYS.TASKS, {});
  const userTasks = tasks[session.userId] || [];
  tasks[session.userId] = userTasks.filter((t) => t.id !== taskId);
  save(STORAGE_KEYS.TASKS, tasks);
}

export function resetDemo() {
  sessionStorage.removeItem(STORAGE_KEYS.USERS);
  sessionStorage.removeItem(STORAGE_KEYS.TASKS);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
}
