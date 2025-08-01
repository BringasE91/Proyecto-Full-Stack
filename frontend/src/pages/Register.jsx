import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (form.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!form.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Por favor ingresa un correo electrónico válido';
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/registro/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Mostrar mensaje de éxito
        setErrors({ success: '¡Registro exitoso! Redirigiendo...' });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Manejar errores del servidor
        const serverErrors = {};
        if (data.email) serverErrors.email = Array.isArray(data.email) ? data.email[0] : data.email;
        if (data.username) serverErrors.username = Array.isArray(data.username) ? data.username[0] : data.username;
        if (data.password) serverErrors.password = Array.isArray(data.password) ? data.password[0] : data.password;
        if (data.detail) serverErrors.general = data.detail;
        
        setErrors(serverErrors);
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión. Por favor intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-header">
          <div className="register-icon">
            <span>👤</span>
          </div>
          <h2>Crear Cuenta</h2>
          <p>Únete a GastoControl y toma control de tus finanzas</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="error-message general-error">
              <span className="error-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          {errors.success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {errors.success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <div className="input-container">
              <span className="input-icon">👤</span>
              <input
                id="username"
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={form.username}
                onChange={e => handleInputChange('username', e.target.value)}
                className={errors.username ? 'error' : ''}
                required
              />
            </div>
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-container">
              <span className="input-icon">📧</span>
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                required
              />
            </div>
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={e => handleInputChange('password', e.target.value)}
                className={errors.password ? 'error' : ''}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Creando cuenta...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Crear cuenta
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="login-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;