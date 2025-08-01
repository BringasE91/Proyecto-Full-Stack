
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import PresupuestoForm from './pages/PresupuestoForm';
import PresupuestoDetalle from './pages/PresupuestoDetalle';
import EditarPresupuesto from './pages/EditarPresupuesto';
import EditarGasto from './pages/EditarGasto'; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevo-presupuesto"
          element={
            <ProtectedRoute>
              <PresupuestoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/presupuesto/:id"
          element={
            <ProtectedRoute>
              <PresupuestoDetalle />
            </ProtectedRoute>
          }
        />
        <Route path="/presupuesto/:id/editar" element={<EditarPresupuesto />} />
        <Route path="/presupuesto/:presupuestoId/gastos/:gastoId/editar" element={<EditarGasto />} />
      </Routes>
    </>
  );
}

export default App;
