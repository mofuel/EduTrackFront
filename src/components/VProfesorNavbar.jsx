// src/components/DashboardNavbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import EduTrackLogo from '../assets/logo.png';
import './VProfesorNavbar.css';

export default function DashboardNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const nombre = localStorage.getItem('nombre');
    if (nombre) {
      setNombreUsuario(nombre);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    localStorage.removeItem('nombre');
    navigate('/login');
  };

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <nav className="profesor-navbar-modern">
      {/* Logo y nombre */}
      <div className="navbar-brand-modern">
        <Link to="/">
          <img src={EduTrackLogo} alt="EduTrack Logo" className="navbar-logo-image" />
          EduTrack
        </Link>
      </div>

      {/* Botón menú móvil */}
      <div className="navbar-toggle-modern" onClick={handleMobileNavToggle}>
        <FaBars />
      </div>

      {/* Enlaces de navegación */}
      <ul className={`navbar-links-modern ${isMobileNavOpen ? 'open' : ''}`}>
        <li><Link to="/profesor/vista-cursos" onClick={() => setIsMobileNavOpen(false)}>Cursos</Link></li>
        <li><Link to="#" onClick={() => setIsMobileNavOpen(false)}>Mensajes</Link></li>
        <li><Link to="/perfil" onClick={() => setIsMobileNavOpen(false)}>Mi Perfil</Link></li>
      </ul>

      {/* Usuario y notificaciones */}
      <div className="navbar-user-section-modern">
        <FaBell className="navbar-icon-modern" />

        {token ? (
          <Dropdown align="end" className="user-dropdown-modern">
            <Dropdown.Toggle variant="outline-light" id="dropdown-user">
              <span className="user-name-text">Hola, {nombreUsuario}</span>
              <FaUserCircle className="user-avatar-nav-modern ms-2" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/perfil">Perfil</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button variant="outline-light" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
