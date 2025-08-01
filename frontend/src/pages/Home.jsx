import '../styles/home.css';
import finanzas from '../assets/imagenes/finanzas.png'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>Control Total de Finanzas</span>
            </div>
            
            <h1 className="hero-title">
              Bienvenido a <span className="brand-highlight">PlaniFi</span>
            </h1>
            
            <p className="hero-description">
              Organiza tus finanzas de forma sencilla e inteligente. Registra tus gastos, 
              define tus presupuestos y mantén el control total de tus finanzas personales 
              con nuestra plataforma profesional.
            </p>
            
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <span>Análisis Detallado</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💰</div>
                <span>Control de Presupuesto</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <span>Acceso Móvil</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <span>Datos Seguros</span>
              </div>
            </div>
            
            <div className="home-buttons">
              <Link to="/registro" className="btn-link">
                <button className="btn btn-primary">
                  <span className="btn-icon">🚀</span>
                  Comenzar Ahora
                </button>
              </Link>
              <Link to="/login" className="btn-link">
                <button className="btn btn-secondary">
                  <span className="btn-icon">👤</span>
                  Ya tengo cuenta
                </button>
              </Link>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="image-container">
              <img 
                src={finanzas} 
                alt="Control de gastos y presupuesto" 
                className="main-image"
              />
              <div className="floating-card card-1">
                <div className="card-icon">💳</div>
                <div className="card-content">
                  <span className="card-title">Gastos</span>
                  <span className="card-value">$1,234</span>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">📈</div>
                <div className="card-content">
                  <span className="card-title">Ahorros</span>
                  <span className="card-value">+15%</span>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <span className="card-title">Meta</span>
                  <span className="card-value">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">1k+</div>
            <div className="stat-label">Usuarios Activos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Satisfacción</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Soporte</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;