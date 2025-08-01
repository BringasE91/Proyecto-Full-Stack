// src/pages/PresupuestoDetalle.jsx
// Muestra los detalles de un presupuesto seleccionado: estadísticas, lista de gastos, y gráfico. Permite registrar nuevos gastos mediante un modal.

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GastoList from '../components/GastoList';
import GastoForm from './GastoForm';
import Chart from '../components/Chart';
import '../styles/PresupuestoDetalle.css';
import ModalGasto from '../components/ModalGasto';

const PresupuestoDetalle = () => {
  const { id } = useParams();
  const [presupuesto, setPresupuesto] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [showGastoForm, setShowGastoForm] = useState(false);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchPresupuesto = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/gastos/presupuesto/${id}/`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        const data = await res.json();
        setPresupuesto(data);
      } catch (error) {
        console.error("Error al obtener presupuesto", error);
      }
    };

    const fetchResumen = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/gastos/presupuesto/${id}/resumen/`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        const data = await res.json();
        setResumen(data);
      } catch (error) {
        console.error("Error al obtener resumen", error);
      }
    };

    fetchPresupuesto();
    fetchResumen();
  }, [id]);

  const handleCloseModal = () => {
    setShowGastoForm(false);
  };

  const handleGastoAdded = () => {
    setShowGastoForm(false);
    window.location.reload();
  };

  if (!presupuesto || !resumen) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando datos del presupuesto...</p>
        </div>
      </div>
    );
  }

  const porcentajeGastado = ((resumen.gastado / resumen.presupuesto_total) * 100).toFixed(1);

  return (
    <div className="presupuesto-detalle-container">
      {/* Header Section */}
      <div className="presupuesto-header">
        <div className="header-content">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Presupuestos</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{presupuesto.nombre_presupuesto}</span>
          </div>

          <h1 className="presupuesto-title">{presupuesto.nombre_presupuesto}</h1>

          <div className="presupuesto-meta">
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span className="meta-text">
                Del {new Date(presupuesto.fecha_inicio).toLocaleDateString()} al {new Date(presupuesto.fecha_fin).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <button 
          className="btn-add-gasto"
          onClick={() => setShowGastoForm(true)}
        >
          <span className="btn-icon">➕</span>
          Agregar Gasto
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="left-column">
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-label">Presupuesto Total</div>
                <div className="stat-value">S/ {presupuesto.monto_total}</div>
              </div>
            </div>

            <div className="stat-card gastado">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-label">Gastado</div>
                <div className="stat-value">S/ {resumen.gastado}</div>
                <div className="stat-percentage">{porcentajeGastado}%</div>
              </div>
            </div>

            <div className="stat-card restante">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-label">Restante</div>
                <div className="stat-value">S/ {resumen.restante}</div>
                <div className="stat-percentage">{(100 - porcentajeGastado).toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="expenses-section">
            <div className="section-header">
              <h3 className="section-title">
                <span className="title-icon">📋</span>
                Gastos Registrados
              </h3>
            </div>
            <div className="expenses-container">
              <GastoList presupuestoId={id} />
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">
                <span className="title-icon">📈</span>
                Distribución del Presupuesto
              </h3>
            </div>
            <div className="chart-content">
              <Chart 
                total={resumen.presupuesto_total} 
                gastado={resumen.gastado} 
                restante={resumen.restante} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* ModalGasto Reutilizable */}
      <ModalGasto
        isOpen={showGastoForm}
        onClose={handleCloseModal}
        title="Registrar Nuevo Gasto"
      >
        <GastoForm
          presupuestoId={id}
          onGastoAdded={handleGastoAdded}
        />
      </ModalGasto>
    </div>
  );
};

export default PresupuestoDetalle;
