// src/components/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaBars, FaSearch, FaHome, FaFolderOpen, FaEnvelope, FaCalendarAlt, FaUsers, FaCog,
  FaUserCircle, FaBell, FaPlus, FaFilter, FaSort, FaFileExport
} from 'react-icons/fa';
import logo from '../assets/logo.png';

import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

import '../components/TeacherDashboard.css';
import '../components/UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();

  const user = {
    nombres: 'Profesor',
    apellidos: 'Ejemplo',
    rol: 'Docente',
    email: 'profesor@ejemplo.com'
  };

  // Obtener usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/dash/usuarios');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleAddUser = () => setShowAddUserModal(true);

  const handleEdit = (userId) => {
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setShowEditUserModal(true);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario con ID: ${userId}?`)) {
      try {
        await fetch(`http://localhost:8080/dash/usuarios/eliminar/${userId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        fetchUsers();
        alert('Usuario eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const handleSaveNewUser = async (newUserData) => {
  if (newUserData.password !== newUserData.confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  // Normalizar rol para enviar sin ROLE_ (si existiera)
  if (newUserData.rol && newUserData.rol.toUpperCase().startsWith('ROLE_')) {
    newUserData.rol = newUserData.rol.substring(5); // Quita "ROLE_"
  }

  try {
    const response = await fetch('http://localhost:8080/api/usuarios/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUserData)
    });

    if (response.ok) {
      alert('Usuario registrado correctamente');
      fetchUsers();
      setShowAddUserModal(false);
    } else {
      const errorText = await response.text();
      alert(`Error: ${errorText}`);
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
  }
};



  const handleUpdateUser = async (updatedUserData) => {
    try {
      const response = await fetch(`http://localhost:8080/dash/usuarios/actualizar/${updatedUserData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUserData),
        credentials: 'include'
      });

      if (response.ok) {
        fetchUsers();
        alert('Usuario actualizado correctamente');
        setShowEditUserModal(false);
        setEditingUser(null);
      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside
        className={`dashboard-sidebar ${isSidebarExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="sidebar-header">
          <Link to="/dashboard-profesor" className="sidebar-brand-name">
            <img src={logo} alt="EduTrack Logo" className="brand-logo" />
            <span className="brand-text">EduTrack</span>
          </Link>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="sidebar-item search-item">
              <FaSearch />
              <span className="item-text">Buscar</span>
            </li>
            <li className={`sidebar-item ${isActive('/dashboard-profesor')}`}>
              <Link to="/dashboard-profesor">
                <FaHome />
                <span className="item-text">Mi Dashboard</span>
              </Link>
            </li>
            <li className={`sidebar-item ${isActive('/mis-cursos')}`}>
              <Link to="/mis-cursos">
                <FaFolderOpen />
                <span className="item-text">Mis Cursos</span>
              </Link>
            </li>
            <li className={`sidebar-item ${isActive('/mensajes')}`}>
              <Link to="/mensajes">
                <FaEnvelope />
                <span className="item-text">Mensajes</span>
              </Link>
            </li>
            <li className={`sidebar-item ${isActive('/calendario')}`}>
              <Link to="/calendario">
                <FaCalendarAlt />
                <span className="item-text">Calendario</span>
              </Link>
            </li>
            <li className={`sidebar-item ${isActive('/usuarios')}`}>
              <Link to="/usuarios">
                <FaUsers />
                <span className="item-text">Usuarios</span>
              </Link>
            </li>
            <li className={`sidebar-item ${isActive('/ajustes')}`}>
              <Link to="/ajustes">
                <FaCog />
                <span className="item-text">Ajustes</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

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

        <h1 className="dashboard-page-title">Tabla de Datos de Usuarios</h1>

        <div className="users-page-container">
          <div className="users-actions-bar">
            <button className="btn btn-primary" onClick={handleAddUser}>
              <FaPlus /> Añadir Nuevo Usuario
            </button>
            <div className="action-buttons-group">
              <button className="btn btn-secondary">
                <FaFilter /> Filtrar
              </button>
              <button className="btn btn-secondary">
                <FaSort /> Ordenar
              </button>
              <button className="btn btn-secondary">
                <FaFileExport /> Exportar
              </button>
            </div>
          </div>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>DNI</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nombre}</td>
                      <td>{user.apellido}</td>
                      <td>{user.dni}</td>
                      <td>{user.email}</td>
                      <td>{user.telefono}</td>
                      <td>{user.rol}</td>
                      <td className="actions-cell">
                        <button className="action-btn edit-btn" onClick={() => handleEdit(user.id)}>
                          Editar
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(user.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-users-message">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modales renderizados condicionalmente */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSave={handleSaveNewUser}
        />
      )}

      {showEditUserModal && editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => {
            setShowEditUserModal(false);
            setEditingUser(null);
          }}
          onSave={handleUpdateUser}
        />
      )}

    </div>
  );
}