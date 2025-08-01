import '../styles/navbar.css';
import logo from '../assets/imagenes/logo.png'
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';


const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu}>
            <img className="logo-icon" src={logo}></img>
            <span className="logo-text">PlaniFi</span>
          </Link>
        </div>
        
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link" onClick={closeMenu}>
                <span className="link-icon">📊</span>
                Dashboard
              </Link>
              <div className="user-info">
                <span className="user-name">Hola, {user.username || 'Usuario'}</span>
                <button className="logout-btn" onClick={() => { logoutUser(); closeMenu(); }}>
                  <span className="btn-icon">🚪</span>
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/registro" className="navbar-link" onClick={closeMenu}>
                <span className="link-icon">👤</span>
                Registrarse
              </Link>
              <Link to="/login" className="navbar-link login-link" onClick={closeMenu}>
                <span className="link-icon">🔑</span>
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;