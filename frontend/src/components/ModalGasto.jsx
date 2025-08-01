// components/ModalGasto.jsx
import React from 'react';
import Modal from './Modal';

const ModalGasto = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {title}
      </h2>
      {children}
    </Modal>
  );
};

export default ModalGasto;
