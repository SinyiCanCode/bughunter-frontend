// ESLint 9 flat config.
// Sem "root: true" (deprecated em flat config — comportamento default agora).
// Sem ".eslintrc" — tudo aqui.
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';

export default [
  // Ignora pastas que não devem ser linted
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      'dist/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
    ],
  },

  // Config base recomendada do ESLint
  js.configs.recommended,

  // Config geral para JS/JSX
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',  // não precisa import React em React 17+
      'react/prop-types': 'off',          // sem prop-types neste projeto
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Override pra arquivos de teste Jest
  {
    files: ['tests/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // Override pra arquivos Cypress
  {
    files: ['cypress/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
];
