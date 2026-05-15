export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      data-cy="confirm-dialog"
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
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: 8, maxWidth: 400 }}>
        <p>{message}</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="button" data-cy="cancel-delete" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" data-cy="confirm-delete" onClick={onConfirm}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
