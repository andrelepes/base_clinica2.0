// ConfirmationModal.js
import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <p>Tem certeza de que deseja inativar este profissional?</p>
      <button onClick={onClose}>Cancelar</button>
      <button
        onClick={() => {
          onConfirm();
          onClose();
        }}
      >
        Confirmar
      </button>
    </div>
  );
};

export default ConfirmationModal;
