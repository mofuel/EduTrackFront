// src/components/DashboardNavbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './DashboardNavbar.css'; // Estilos para este Navbar

export default function DashboardNavbar() {
  const location = useLocation(); // Hook para obtener la ubicación actual

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar-brand">
        <Link to="/dashboard-profesor">Mi Plataforma</Link> {/* O el nombre de tu plataforma */}
      </div>
      <ul className="dashboard-navbar-links">
        <li className={location.pathname === '/dashboard-profesor' ? 'active' : ''}>
          <Link to="/dashboard-profesor">Mi Dashboard</Link>
        </li>
        {/* Aquí puedes añadir enlaces si el profesor tiene una "página de inicio" diferente al landing */}
        {/* Por ahora, asumiremos que "Inicio" puede ser la misma página principal de la app */}
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Inicio</Link> {/* Enlaza a la HomePage principal de tu aplicación */}
        </li>
        {/*
          IMPORTANTE: Si "Usuarios" y "Configuración" son secciones REALES
          dentro del dashboard del profesor, necesitarán sus propias rutas y componentes.
          Por ahora, las pongo como enlaces ficticios o futuras rutas.
          Si el profesor REALMENTE gestiona usuarios, entonces estas rutas
          "/usuarios" y "/configuracion" deberán llevar a sus componentes específicos.
        */}
        <li className={location.pathname === '/usuarios' ? 'active' : ''}>
          <Link to="/usuarios">Usuarios</Link> {/* Ruta para la gestión de usuarios */}
        </li>
        <li className={location.pathname === '/configuracion' ? 'active' : ''}>
          <Link to="/configuracion">Configuración</Link> {/* Ruta para los ajustes */}
        </li>
        {/* Puedes añadir un botón de cerrar sesión aquí si quieres */}
        {/* <li>
          <button className="dashboard-logout-btn" onClick={() => console.log('Cerrar sesión')}>Cerrar Sesión</button>
        </li> */}
      </ul>
    </nav>
  );
}