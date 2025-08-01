// src/pages/Dashboard.jsx
// Muestra el panel principal del usuario con sus presupuestos, permite crear, editar y eliminar presupuestos con modales.


import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import PresupuestoForm from '../pages/PresupuestoForm';
import EditarPresupuesto from '../pages/EditarPresupuesto';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { authTokens } = useContext(AuthContext);
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // Crear modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Editar modal
  const [editPresupuestoId, setEditPresupuestoId] = useState(null);

  const fetchPresupuestos = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/gastos/presupuesto/', {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      const data = await res.json();
      setPresupuestos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener presupuestos', error);
      setLoading(false);
    }
  };

  const handleEliminarPresupuesto = async (id) => {
    const confirmar = confirm('¿Estás seguro de eliminar este presupuesto?');
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:8000/api/gastos/presupuesto/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (res.ok) {
        alert('Presupuesto eliminado correctamente');
        fetchPresupuestos();
        setActiveMenu(null);
      } else {
        alert('Error al eliminar el presupuesto');
      }
    } catch (error) {
      console.error('Error al eliminar presupuesto:', error);
    }
  };

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const openEditModal = (id) => {
    setEditPresupuestoId(id);
    setIsEditModalOpen(true);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const getProgressPercentage = (total, restante) => ((total - restante) / total) * 100;

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  };

  useEffect(() => {
    fetchPresupuestos();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">📊</span>
            Mi Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Gestiona tus presupuestos y controla tus finanzas
          </p>
        </div>
        <button
          className="btn-new-budget"
          onClick={() => setIsFormModalOpen(true)}
        >
          <span className="btn-icon">➕</span>
          Nuevo Presupuesto
        </button>
      </div>

      {/* Modal Nuevo Presupuesto */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)}>
        <PresupuestoForm
          onSuccess={() => {
            setIsFormModalOpen(false);
            fetchPresupuestos();
          }}
        />
      </Modal>

      {/* Modal Editar Presupuesto */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditarPresupuesto
          presupuestoId={editPresupuestoId}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchPresupuestos();
          }}
        />
      </Modal>

      {presupuestos.length > 0 ? (
        <div className="budgets-section">
          <div className="section-header">
            <h2 className="section-title">Mis Presupuestos</h2>
            <span className="budgets-count">
              {presupuestos.length} presupuesto{presupuestos.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="budgets-grid">
            {presupuestos.map((p) => {
              const progressPercentage = getProgressPercentage(p.monto_total, p.monto_restante);
              const statusColor = getStatusColor(progressPercentage);

              return (
                <div key={p.id} className="budget-card">
                  <div className="card-header">
                    <Link to={`/presupuesto/${p.id}`} className="budget-name-link">
                      <h3 className="budget-name">{p.nombre_presupuesto}</h3>
                    </Link>

                    <div className="card-menu" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="menu-trigger"
                        onClick={() => toggleMenu(p.id)}
                      >
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </button>

                      {activeMenu === p.id && (
                        <div className="dropdown-menu">
                          <button
                            className="menu-item edit"
                            onClick={() => {
                              openEditModal(p.id);
                              setActiveMenu(null);
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="menu-item delete"
                            onClick={() => handleEliminarPresupuesto(p.id)}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="date-range">
                      📅 {formatDate(p.fecha_inicio)} - {formatDate(p.fecha_fin)}
                    </div>

                    <div className="budget-amounts">
                      <div><strong>Total:</strong> {formatCurrency(p.monto_total)}</div>
                      <div><strong>Disponible:</strong> {formatCurrency(p.monto_restante)}</div>
                      <div><strong>Gastado:</strong> {formatCurrency(p.monto_total - p.monto_restante)}</div>
                    </div>

                    <div className="progress-section">
                      <div className="progress-header">
                        Progreso: <span className={`progress-percentage ${statusColor}`}>
                          {progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${statusColor}`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h3 className="empty-title">¡Comienza a gestionar tus finanzas!</h3>
          <p>No tienes presupuestos aún. Crea uno para comenzar a controlar tus gastos.</p>
          <button
            className="btn-create-first"
            onClick={() => setIsFormModalOpen(true)}
          >
            🚀 Crear mi primer presupuesto
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
