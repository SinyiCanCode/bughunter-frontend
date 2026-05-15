# Bug Hunter — Frontend

Suite de testes automatizados sobre uma aplicação React. Cobre a **pirâmide de teste** com Jest + React Testing Library para componentes e Cypress para fluxos E2E. CI configurado com GitHub Actions.

---

## Stack

- **React 18** + Vite
- **Jest** + **React Testing Library** — testes unitários e de componentes
- **Cypress 13** — testes end-to-end
- **GitHub Actions** — CI/CD

---

## Estrutura

```
bughunter-frontend/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   └── TaskList.jsx
│   └── utils/
│       └── validators.js
├── tests/
│   ├── validators.test.js
│   ├── LoginForm.test.jsx
│   └── TaskList.test.jsx
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js
│   │   └── tasks.cy.js
│   └── support/
│       └── commands.js
└── .github/workflows/
    └── ci.yml
```

---

## Como rodar

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
npm install
```

### Testes unitários (Jest)

```bash
npm test                 # roda todos
npm test -- --coverage   # com cobertura
npm test -- --watch      # modo watch
```

### Testes E2E (Cypress)

```bash
npm run dev              # inicia app em :5173
npm run cypress:open     # modo interativo
npm run cypress:run      # headless (usado no CI)
```

---

## O que está sendo testado

### Testes unitários
- **validators.js** — validação de email, força de senha, sanitização
- **LoginForm.jsx** — renderização, validação inline, submit, estados de erro
- **TaskList.jsx** — render condicional, filtros, ordenação

### Testes E2E
- **login.cy.js** — fluxo completo de autenticação (sucesso e falha)
- **tasks.cy.js** — CRUD de tarefas, estado vazio, confirmação de exclusão

---

## Pipeline de CI

A cada push ou PR para `main`, o GitHub Actions executa:

1. Lint do código (ESLint)
2. Testes Jest com relatório de cobertura
3. Build de produção
4. Testes Cypress em modo headless

Status: [![CI](https://github.com/SinyiCanCode/bughunter-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/SinyiCanCode/bughunter-frontend/actions)

---

## Cobertura atual

| Métrica | Valor |
|---|---|
| Statements | ~92% |
| Branches | ~88% |
| Functions | ~95% |
| Lines | ~92% |

---

## Troubleshooting

### `ERESOLVE could not resolve` ao rodar `npm install`
Conflito de peer dependencies. Soluções:
1. Apague `node_modules` e `package-lock.json` e rode `npm install` novamente.
2. Se persistir, use `npm install --legacy-peer-deps` como mitigação temporária.
3. Causa raiz: versão de uma dep está incompatível. Verifique se Vite e `@vitejs/plugin-react` estão alinhados (Vite 5 ↔ plugin 4, Vite 6 ↔ plugin 5).

### ESLint reclamando de flat config
Este projeto usa **ESLint 9 com flat config** (`eslint.config.js`), não o legado `.eslintrc`. Implicações:
- Não use `--ext` no comando — rode apenas `eslint .`
- Não use `root: true` no config
- Globais do Jest/Cypress são declarados no próprio `eslint.config.js`

### `Dependencies lock file is not found` no CI
O CI usa `npm ci` que exige `package-lock.json` commitado. Se aparecer esse erro:
```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "chore: add package-lock.json"
```

### `Parsing error: Unexpected token <`
ESLint não está conseguindo parsear JSX. Causa: parser padrão (espresso) não entende JSX. Solução já aplicada neste projeto: `@babel/eslint-parser` configurado no `eslint.config.js`.
