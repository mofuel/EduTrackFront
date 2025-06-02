import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBars, FaSearch, FaHome, FaFolderOpen, FaEnvelope, FaCalendarAlt, FaUsers, FaCog,
  FaUserCircle, FaBell, FaChalkboardTeacher, FaBookOpen, FaGraduationCap
} from 'react-icons/fa';
import './TeacherDashboard.css';
import logo from '../assets/logo.png'; // Importa tu logo

export default function TeacherDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const user = {
    nombres: 'Profesor',
    apellidos: 'Ejemplo',
    rol: 'Docente',
    email: 'profesor@ejemplo.com'
  };

  const teacherData = {
    totalStudents: '21 324',
    totalIncome: 'S/. 221,324.50',
    classesTaught: '16 703',
    completionRate: '12.8%',
  };

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${isSidebarExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="sidebar-header">
          <Link to="/Inicio" className="sidebar-brand-name">
            {/* Se reemplaza el span con la imagen */}
            <img src={logo} alt="EduTrack Logo" className="brand-logo" />
            <span className="brand-text">EduTrack</span>
          </Link>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {/* Se añade la clase 'search-item' para el icono de búsqueda */}
            <li className="sidebar-item search-item">
              <FaSearch />
              <span className="item-text">Buscar</span>
            </li>
            <li className="sidebar-item active">
              <Link to="/dashboard-profesor">
                <FaHome />
                <span className="item-text">Mi Dashboard</span>
              </Link>
            </li>
            
            <li className="sidebar-item">
              <Link to="/mensajes">
                <FaEnvelope />
                <span className="item-text">Mensajes</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/calendario">
                <FaCalendarAlt />
                <span className="item-text">Calendario</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/usuarios">
                <FaUsers />
                <span className="item-text">Usuarios</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/ajustes">
                <FaCog />
                <span className="item-text">Ajustes</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main-content-area">
        <header className="main-header">
          <div className="header-left">
            <FaBars className="menu-toggle-icon" onClick={handleSidebarToggle} />
          </div>
          <div className="header-right">
            <FaBell className="header-icon" />
            <div className="user-profile">
              <div className="user-info">
                <span>{user.nombres} {user.apellidos}</span>
                <small>{user.rol}</small>
              </div>
              <FaUserCircle className="user-avatar-small" />
            </div>
          </div>
        </header>

        <h1 className="dashboard-page-title">Dashboard</h1>

        <div className="top-stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Alumnos Inscritos</span>
              <span className="stat-value">{teacherData.totalStudents}</span>
              <span className="stat-change positive">+2,031</span>
            </div>
            <div className="stat-icon-container">
              <FaUsers className="stat-icon" />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Ingresos por Cursos</span>
              <span className="stat-value">{teacherData.totalIncome}</span>
              <span className="stat-change negative">- S/. 2,201</span>
            </div>
            <div className="stat-icon-container">
              <FaBookOpen className="stat-icon" />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Clases Impartidas</span>
              <span className="stat-value">{teacherData.classesTaught}</span>
              <span className="stat-change positive">+3,392</span>
            </div>
            <div className="stat-icon-container">
              <FaChalkboardTeacher className="stat-icon" />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Tasa de Finalización</span>
              <span className="stat-value">{teacherData.completionRate}</span>
              <span className="stat-change negative">-1.22%</span>
            </div>
            <div className="stat-icon-container">
              <FaGraduationCap className="stat-icon" />
            </div>
          </div>
        </div>

        <div className="dashboard-cards-grid-content">
          <div className="dashboard-card-item simple-card">
            <div className="card-header-main-content">
              <h2>Usuarios</h2>
              <FaCog className="settings-icon" />
            </div>
            <p>Gestiona y visualiza la información de tus los usuarios registrados.</p>
            <Link to="/Usuarios" className="card-action-btn">Ver Usuarios</Link>
          </div>

          <div className="dashboard-card-item simple-card">
            <div className="card-header-main-content">
              <h2>Cursos Existentes</h2>
              <FaCog className="settings-icon" />
            </div>
            <p>Gestiona los cursos disctados en la plaaforma.</p>
            <Link to="/mis-cursos" className="card-action-btn">Gestionar Cursos</Link>
          </div>

          <div className="dashboard-card-item simple-card">
            <div className="card-header-main-content">
              <h2>Progreso de Alumnos</h2>
              <FaCog className="settings-icon" />
            </div>
            <p>Monitorea el avance de tus estudiantes en cada curso.</p>
            <Link to="/progreso-alumnos" className="card-action-btn">Ver Progreso</Link>
          </div>

          <div className="dashboard-card-item simple-card">
            <div className="card-header-main-content">
              <h2>Calificaciones</h2>
              <FaCog className="settings-icon" />
            </div>
            <p>Registra y consulta las calificaciones de tus cursos.</p>
            <Link to="/calificaciones" className="card-action-btn">Ver Calificaciones</Link>
          </div>

          <div className="dashboard-card-item simple-card">
            <div className="card-header-main-content">
              <h2>Comunicación</h2>
              <FaCog className="settings-icon" />
            </div>
            <p>Envía anuncios y recibe mensajes de tus alumnos.</p>
            <Link to="/comunicacion" className="card-action-btn">Gestionar Comunicación</Link>
          </div>

          <div className="dashboard-card-item simple-card">
            <div className="card-header-main-content">
              <h2>Mi Perfil</h2>
              <FaCog className="settings-icon" />
            </div>
            <p>Actualiza tu información personal y preferencias.</p>
            <Link to="/mi-perfil" className="card-action-btn">Editar Perfil</Link>
          </div>
        </div>
      </main>
    </div>
  );
}