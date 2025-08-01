// src/pages/EditarPresupuesto.jsx
// Componente para editar un presupuesto existente. Obtiene datos por ID, muestra el formulario y envía los cambios al backend.

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const EditarPresupuesto = ({ presupuestoId, onClose, onSuccess }) => {
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nombre_presupuesto: '',
    fecha_inicio: '',
    fecha_fin: '',
    monto_total: '',
  });

  const fetchPresupuesto = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/gastos/presupuesto/${presupuestoId}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      const data = await res.json();
      setFormData({
        nombre_presupuesto: data.nombre_presupuesto,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        monto_total: data.monto_total,
      });
    } catch (err) {
      alert('Error al cargar el presupuesto.');
    }
  };

  useEffect(() => {
    if (presupuestoId) fetchPresupuesto();
  }, [presupuestoId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/gastos/presupuesto/${presupuestoId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Presupuesto actualizado con éxito.');
        if (onSuccess) onSuccess();
      } else {
        const error = await res.json();
        alert(JSON.stringify(error));
      }
    } catch (error) {
      alert('Error al actualizar el presupuesto.');
    }
  };

  return (
    <div>
      <h2>Editar Presupuesto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre_presupuesto"
          value={formData.nombre_presupuesto}
          onChange={handleChange}
        />

        <label>Fecha inicio:</label>
        <input
          type="date"
          name="fecha_inicio"
          value={formData.fecha_inicio}
          onChange={handleChange}
        />

        <label>Fecha fin:</label>
        <input
          type="date"
          name="fecha_fin"
          value={formData.fecha_fin}
          onChange={handleChange}
        />

        <label>Monto total:</label>
        <input
          type="number"
          step="0.01"
          name="monto_total"
          value={formData.monto_total}
          onChange={handleChange}
        />

        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditarPresupuesto;
