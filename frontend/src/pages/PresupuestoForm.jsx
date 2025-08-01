// pages/PresupuestoForm.jsx
// src/pages/PresupuestoForm.jsx
// Formulario para crear un nuevo presupuesto. Envía los datos al backend y redirige o ejecuta un callback al éxito.

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PresupuestoForm = ({ onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [monto, setMonto] = useState('');
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nombre_presupuesto: nombre,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      monto_total: parseFloat(monto)
    };

    try {
      const response = await fetch('http://localhost:8000/api/gastos/presupuesto/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/dashboard');
        }
      } else {
        const errorData = await response.json();
        alert(JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Error al crear presupuesto', error);
    }
  };

  return (
    <div>
      <h2>Nuevo Presupuesto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

        <label>Fecha inicio:</label>
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />

        <label>Fecha fin:</label>
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} required />

        <label>Monto total:</label>
        <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} required />

        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default PresupuestoForm;
