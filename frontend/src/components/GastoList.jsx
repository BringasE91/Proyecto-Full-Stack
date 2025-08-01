// src/components/GastoList.jsx
// Muestra una lista de gastos para un presupuesto.
// Permite editar, eliminar y ver el total gastado.
// Usa token JWT para obtener los datos desde la API.

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/GastoList.css';

const GastoList = ({ presupuestoId }) => {
  const { authTokens } = useContext(AuthContext);
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchGastos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`http://localhost:8000/api/gastos/presupuesto/${presupuestoId}/gastos/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Error al cargar los gastos');
      }
      
      const data = await res.json();
      setGastos(data);
    } catch (error) {
      console.error('Error al obtener los gastos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (gastoId) => {
    const confirm = window.confirm('¿Estás seguro de eliminar este gasto?');
    if (!confirm) return;

    try {
      setDeletingId(gastoId);
      
      const res = await fetch(`http://localhost:8000/api/gastos/presupuesto/${presupuestoId}/gastos/${gastoId}/eliminar/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (res.status === 204) {
        // Actualizar la lista sin hacer otra petición
        setGastos(gastos.filter(gasto => gasto.id !== gastoId));
        // Opcional: mostrar notificación de éxito
      } else {
        throw new Error('No se pudo eliminar el gasto');
      }
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
      setError('Error al eliminar el gasto');
    } finally {
      setDeletingId(null);
    }
  };

  const formatearFecha = (fecha) => {
    const opciones = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(monto);
  };

  const calcularTotal = () => {
    return gastos.reduce((total, gasto) => total + parseFloat(gasto.monto), 0);
  };

  const getCategoriaIcon = (categoria) => {
    const iconos = {
      'Alimentación': '🍽️',
      'Transporte': '🚗',
      'Entretenimiento': '🎮',
      'Salud': '⚕️',
      'Educación': '📚',
      'Servicios': '💡',
      'Ropa': '👕',
      'Otros': '📦'
    };
    return iconos[categoria] || '💰';
  };

  useEffect(() => {
    fetchGastos();
  }, [presupuestoId]);

  if (loading) {
    return (
      <div className="gasto-list-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando gastos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gasto-list-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={fetchGastos}>
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gasto-list-container">
      <div className="gasto-header">
        <h3 className="gasto-title">
          <span className="title-icon">💸</span>
          Lista de Gastos
        </h3>
        {gastos.length > 0 && (
          <div className="total-badge">
            <span className="total-label">Total:</span>
            <span className="total-amount">{formatearMonto(calcularTotal())}</span>
          </div>
        )}
      </div>

      {gastos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h4>No hay gastos registrados</h4>
          <p>Comienza agregando tu primer gasto para llevar el control de tus finanzas.</p>
        </div>
      ) : (
        <div className="gastos-grid">
          {gastos.map((gasto) => (
            <div key={gasto.id} className="gasto-card">
              <div className="gasto-header-card">
                <div className="gasto-info">
                  <div className="categoria-icon">
                    {getCategoriaIcon(gasto.categoria)}
                  </div>
                  <div className="gasto-details">
                    <h4 className="gasto-descripcion">{gasto.descripcion}</h4>
                    <p className="gasto-categoria">{gasto.categoria || 'Sin categoría'}</p>
                  </div>
                </div>
                <div className="gasto-monto">
                  {formatearMonto(gasto.monto)}
                </div>
              </div>
              
              <div className="gasto-meta">
                <div className="gasto-fecha">
                  <span className="fecha-icon">📅</span>
                  {formatearFecha(gasto.fecha)}
                </div>
                
                <div className="gasto-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => navigate(`/presupuesto/${presupuestoId}/gastos/${gasto.id}/editar`)}
                    title="Editar gasto"
                  >
                    <span className="btn-icon">✏️</span>
                    Editar
                  </button>
                  
                  <button
                    className="btn btn-delete"
                    onClick={() => handleEliminar(gasto.id)}
                    disabled={deletingId === gasto.id}
                    title="Eliminar gasto"
                  >
                    <span className="btn-icon">
                      {deletingId === gasto.id ? '⏳' : '🗑️'}
                    </span>
                    {deletingId === gasto.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GastoList;