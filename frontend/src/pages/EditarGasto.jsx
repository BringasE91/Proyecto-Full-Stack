// src/pages/EditarGasto.jsx
// Componente que permite editar un gasto específico. Carga los datos, muestra un formulario en modal y envía la actualización al backend.

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ModalGasto from '../components/ModalGasto';

const EditarGasto = () => {
  const { presupuestoId, gastoId } = useParams();
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchGasto = async () => {
      const res = await fetch(`http://localhost:8000/api/gastos/presupuesto/${presupuestoId}/gastos/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      const data = await res.json();
      const gasto = data.find((g) => g.id === parseInt(gastoId));
      if (gasto) setForm(gasto);
    };
    fetchGasto();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/api/gastos/presupuesto/${presupuestoId}/gastos/${gastoId}/editar/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authTokens.access}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert('Gasto actualizado');
      navigate(-1); // o a donde quieras ir
    } else {
      const error = await res.json();
      alert(JSON.stringify(error));
    }
  };

  return (
    <ModalGasto
      isOpen={isOpen}
      onClose={() => navigate(-1)}
      title="Editar Gasto"
    >
      {form && (
        <form onSubmit={handleSubmit}>
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <label>Monto:</label>
          <input
            type="number"
            name="monto"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
          />

          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />

          <button type="submit">Guardar Cambios</button>
        </form>
      )}
    </ModalGasto>
  );
};

export default EditarGasto;
