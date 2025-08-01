import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'El formato del correo no es válido';
    }
    
    if (!form.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const success = await loginUser(form.email, form.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: 'Credenciales incorrectas. Intenta nuevamente.' });
      }
    } catch (error) {
      setErrors({ general: 'Error al iniciar sesión. Intenta más tarde.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <div className="login-icon">
            <span>🔐</span>
          </div>
          <h2 className="login-title">Bienvenido de nuevo</h2>
          <p className="login-subtitle">Ingresa a tu cuenta de GastoControl</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message general-error">
              <span className="error-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span className="label-icon">📧</span>
              Correo electrónico
            </label>
            <div className="input-container">
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className={`form-input ${errors.email ? 'error' : ''}`}
                required
              />
              <div className="input-icon">
                <span>👤</span>
              </div>
            </div>
            {errors.email && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <span className="label-icon">🔒</span>
              Contraseña
            </label>
            <div className="input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                value={form.password}
                onChange={e => handleInputChange('password', e.target.value)}
                className={`form-input ${errors.password ? 'error' : ''}`}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span>{showPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
            {errors.password && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {errors.password}
              </div>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" className="checkbox" />
              <span className="checkmark"></span>
              <span className="checkbox-label">Recordarme</span>
            </label>
            <a href="#" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Iniciar sesión
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="divider">
            <span>o</span>
          </div>

          <div className="signup-prompt">
            <p>
              ¿No tienes una cuenta? 
              <Link to="/registro" className="signup-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="background-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};

export default Login;