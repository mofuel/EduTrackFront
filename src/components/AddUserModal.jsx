// src/components/AddUserModal.jsx
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';


export default function AddUserModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',    // <--- ¡CAMBIO AQUÍ!
    apellido: '',  // <--- ¡CAMBIO AQUÍ!
    dni: '',
    email: '',
    telefono: '',
    rol: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    // `formData` ahora contiene 'nombre' y 'apellido'
    onSave(formData);
  };

  return (
    <div className="user-management-modal-overlay">
      <div className="user-management-modal-content">
        <div className="user-management-modal-header">
          <h2>Agregar Nuevo Usuario</h2>
          <button className="user-management-modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="user-management-modal-form">
          <div className="form-group-row-modal">
            <div className="form-group-modal">
              <label htmlFor="nombre">Nombres</label> {/* <--- ¡CAMBIO AQUÍ en htmlFor! */}
              <input
                type="text"
                id="nombre"    
                name="nombre"  
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-modal">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group-row-modal">
            <div className="form-group-modal">
              <label htmlFor="apellido">Apellidos</label> {/* <--- ¡CAMBIO AQUÍ en htmlFor! */}
              <input
                type="text"
                id="apellido"    
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-modal">
              <label htmlFor="rol">Rol</label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona tu rol</option>
                <option value="estudiante">Estudiante</option>
                <option value="admin">Administrador</option>
                <option value="docente">Docente</option>
              </select>
            </div>
          </div>

          <div className="form-group-row-modal">
            <div className="form-group-modal">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-modal">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group-row-modal">
            <div className="form-group-modal">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-modal">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="user-management-modal-actions">
            <button type="submit" className="btn btn-add-user">Registrar</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}