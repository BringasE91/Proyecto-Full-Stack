// components/Modal.jsx
import React from 'react';
import '../styles/Modal.css'; // luego creas estilos básicos aquí

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖️</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
