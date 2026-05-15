/// <reference types="cypress" />

/**
 * Suite E2E do CRUD de tarefas.
 *
 * Princípio: cada teste é independente. Estado é construído via UI
 * dentro do próprio teste (não depende de teste anterior).
 * sessionStorage é limpo no beforeEach pra garantir isolamento.
 */

describe('CRUD de Tarefas', () => {
  beforeEach(() => {
    // Limpa estado entre testes — independência total
    cy.window().then((win) => win.sessionStorage.clear());
    cy.login('maria.silva@exemplo.com', 'Senha@2026');
  });

  it('exibe estado vazio quando usuário não tem tarefas', () => {
    cy.get('[data-cy=empty-state]').should('be.visible');
    cy.contains(/nenhuma tarefa cadastrada/i).should('be.visible');
    cy.contains(/criar primeira tarefa/i).should('be.visible');
  });

  it('cria nova tarefa com dados válidos', () => {
    cy.get('[data-cy=new-task]').click();
    cy.get('[data-cy=task-title]').type('Comprar leite');
    cy.get('[data-cy=task-description]').type('Mercado da esquina');
    cy.get('[data-cy=task-priority]').select('media');
    cy.get('[data-cy=task-save]').click();

    cy.contains('Comprar leite').should('be.visible');
    cy.contains(/tarefa criada/i).should('be.visible');
  });

  it('bloqueia criação de tarefa com título vazio', () => {
    cy.get('[data-cy=new-task]').click();
    cy.get('[data-cy=task-save]').click();

    cy.contains(/título é obrigatório/i).should('be.visible');
  });

  it('exibe contador de caracteres ao digitar título longo (regressão BUG-003)', () => {
    cy.get('[data-cy=new-task]').click();
    const titulo = 'a'.repeat(95);
    cy.get('[data-cy=task-title]').type(titulo);

    cy.get('[data-cy=title-counter]').should('contain', '95/100');
  });

  it('edita tarefa existente', () => {
    // Cria a tarefa primeiro (self-contained)
    cy.get('[data-cy=new-task]').click();
    cy.get('[data-cy=task-title]').type('Tarefa original');
    cy.get('[data-cy=task-save]').click();
    cy.contains('Tarefa original').should('be.visible');

    // Edita
    cy.contains('Tarefa original')
      .parents('[data-cy^=task-]')
      .within(() => {
        cy.get('[data-cy=edit]').click();
      });

    cy.get('[data-cy=task-title]').clear().type('Tarefa editada');
    cy.get('[data-cy=task-status]').select('concluida');
    cy.get('[data-cy=task-save]').click();

    cy.contains('Tarefa editada').should('be.visible');
    cy.contains(/tarefa atualizada/i).should('be.visible');
  });

  it('confirma exclusão antes de remover', () => {
    cy.get('[data-cy=new-task]').click();
    cy.get('[data-cy=task-title]').type('Para excluir');
    cy.get('[data-cy=task-save]').click();
    cy.contains('Para excluir').should('be.visible');

    cy.contains('Para excluir')
      .parents('[data-cy^=task-]')
      .within(() => {
        cy.get('[data-cy=delete]').click();
      });

    cy.get('[data-cy=confirm-dialog]').should('be.visible');
    cy.contains(/tem certeza/i).should('be.visible');

    cy.get('[data-cy=confirm-delete]').click();

    cy.contains('Para excluir').should('not.exist');
    cy.contains(/tarefa excluída/i).should('be.visible');
  });

  it('cancela exclusão preserva tarefa na lista', () => {
    cy.get('[data-cy=new-task]').click();
    cy.get('[data-cy=task-title]').type('Não excluir');
    cy.get('[data-cy=task-save]').click();

    cy.contains('Não excluir')
      .parents('[data-cy^=task-]')
      .within(() => {
        cy.get('[data-cy=delete]').click();
      });

    cy.get('[data-cy=cancel-delete]').click();

    cy.contains('Não excluir').should('be.visible');
  });

  it('filtra tarefas por status', () => {
    // Cria 2 tarefas e marca 1 como concluída
    cy.get('[data-cy=new-task]').click();
    cy.get('[data-cy=task-title]').type('Pendente');
    cy.get('[data-cy=task-save]').click();

    cy.get('[data-cy=new-task]').click();
    cy.get('[data-cy=task-title]').type('Será concluída');
    cy.get('[data-cy=task-save]').click();

    cy.contains('Será concluída')
      .parents('[data-cy^=task-]')
      .within(() => cy.get('[data-cy=edit]').click());
    cy.get('[data-cy=task-status]').select('concluida');
    cy.get('[data-cy=task-save]').click();

    // Filtra concluídas — deve mostrar só "Será concluída"
    cy.get('[data-cy=filter-status]').select('concluida');
    cy.get('[data-cy^=task-]').should('have.length', 1);
    cy.get('[data-cy^=task-]').first().should('contain', 'Será concluída');
  });

  it('ordena tarefas por prioridade', () => {
    cy.get('[data-cy=new-task]').click();
    cy.get('[data-cy=task-title]').type('Baixa');
    cy.get('[data-cy=task-priority]').select('baixa');
    cy.get('[data-cy=task-save]').click();

    cy.get('[data-cy=new-task]').click();
    cy.get('[data-cy=task-title]').type('Alta');
    cy.get('[data-cy=task-priority]').select('alta');
    cy.get('[data-cy=task-save]').click();

    cy.get('[data-cy=sort-by]').select('priority');

    cy.get('[data-cy^=task-]').first().should('contain', 'Alta');
  });
});
