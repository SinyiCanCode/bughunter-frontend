/// <reference types="cypress" />

describe('Fluxo de Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('exibe formulário de login na renderização inicial', () => {
    cy.contains('Entrar').should('be.visible');
    cy.get('[data-cy=email]').should('be.visible');
    cy.get('[data-cy=password]').should('be.visible');
  });

  it('autentica com credenciais válidas e redireciona para dashboard', () => {
    cy.get('[data-cy=email]').type('maria.silva@exemplo.com');
    cy.get('[data-cy=password]').type('Senha@2026');
    cy.get('[data-cy=submit]').click();

    cy.url().should('include', '/dashboard');
    cy.contains(/olá, maria/i).should('be.visible');
  });

  it('rejeita login com email inexistente', () => {
    cy.get('[data-cy=email]').type('naoexiste@exemplo.com');
    cy.get('[data-cy=password]').type('qualquer123');
    cy.get('[data-cy=submit]').click();

    cy.contains(/email ou senha incorretos/i).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('rejeita login com senha incorreta', () => {
    cy.get('[data-cy=email]').type('maria.silva@exemplo.com');
    cy.get('[data-cy=password]').type('senhaErrada');
    cy.get('[data-cy=submit]').click();

    cy.contains(/email ou senha incorretos/i).should('be.visible');
  });

  it('exibe validação inline para email vazio', () => {
    cy.get('[data-cy=password]').type('Senha@2026');
    cy.get('[data-cy=submit]').click();

    cy.contains(/email é obrigatório/i).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('exibe validação inline para formato de email inválido', () => {
    cy.get('[data-cy=email]').type('joao@email');
    cy.get('[data-cy=password]').type('Senha@2026');
    cy.get('[data-cy=submit]').click();

    cy.contains(/formato de email inválido/i).should('be.visible');
  });

  it('aceita login com email em variações de maiúsculas (regressão BUG-002)', () => {
    cy.get('[data-cy=email]').type('Maria.Silva@Exemplo.COM');
    cy.get('[data-cy=password]').type('Senha@2026');
    cy.get('[data-cy=submit]').click();

    cy.url().should('include', '/dashboard');
  });

  it('permite logout e redireciona para login', () => {
    cy.login('maria.silva@exemplo.com', 'Senha@2026');
    cy.url().should('include', '/dashboard');

    cy.get('[data-cy=user-menu]').click();
    cy.get('[data-cy=logout]').click();

    cy.url().should('include', '/login');
  });

  it('bloqueia acesso ao dashboard quando não autenticado', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});
