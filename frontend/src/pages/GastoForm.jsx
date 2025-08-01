// src/components/GastoForm.jsx
// Componente de formulario para agregar un gasto a un presupuesto específico mediante una solicitud POST al backend.

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const GastoForm = ({ presupuestoId, onGastoAdded }) => {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const { authTokens } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      descripcion,
      monto: parseFloat(monto),
      fecha
    };

    try {
      const response = await fetch(`http://localhost:8000/api/gastos/presupuesto/${presupuestoId}/gastos/nuevo/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Gasto registrado");
        setDescripcion('');
        setMonto('');
        setFecha('');
        if (onGastoAdded) onGastoAdded();
      } else {
        const errorData = await response.json();
        alert(JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error al registrar gasto", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Descripción:</label>
      <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />

      <label>Monto (S/):</label>
      <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} required />

      <label>Fecha:</label>
      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

      <button type="submit">Agregar gasto</button>
    </form>
  );
};

export default GastoForm;
