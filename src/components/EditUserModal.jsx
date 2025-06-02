// src/components/EditUserModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

// Ya NO importamos UserFormModal.css, los estilos estarán en UserManagement.css
// import '../components/UserFormModal.css';

export default function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: user.id,
    nombre: user.nombre || '',
    apellido: user.apellido || '',
    dni: user.dni || '',
    email: user.email || '',
    telefono: user.telefono || '',
    rol: user.rol || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        dni: user.dni || '',
        email: user.email || '',
        telefono: user.telefono || '',
        rol: user.rol || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="user-management-modal-overlay"> {/* CLASE ESPECÍFICA */}
      <div className="user-management-modal-content"> {/* CLASE ESPECÍFICA */}
        <div className="user-management-modal-header"> {/* CLASE ESPECÍFICA */}
          <h2>Editar Usuario</h2>
          <button className="user-management-modal-close-btn" onClick={onClose}> {/* CLASE ESPECÍFICA */}
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="user-management-modal-form"> {/* CLASE ESPECÍFICA */}
          <div className="form-group-row-modal"> {/* CLASE ESPECÍFICA */}
            <div className="form-group-modal"> {/* CLASE ESPECÍFICA */}
              <label htmlFor="editNombre">Nombre</label>
              <input
                type="text"
                id="editNombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group-row-modal"> {/* CLASE ESPECÍFICA */}
            <div className="form-group-modal"> {/* CLASE ESPECÍFICA */}
              <label htmlFor="editApellido">Apellido</label>
              <input
                type="text"
                id="editApellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group-row-modal"> {/* CLASE ESPECÍFICA */}
            <div className="form-group-modal"> {/* CLASE ESPECÍFICA */}
              <label htmlFor="editDni">DNI</label>
              <input
                type="text"
                id="editDni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group-row-modal"> {/* CLASE ESPECÍFICA */}
            <div className="form-group-modal"> {/* CLASE ESPECÍFICA */}
              <label htmlFor="editEmail">Email</label>
              <input
                type="email"
                id="editEmail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group-row-modal"> {/* CLASE ESPECÍFICA */}
            <div className="form-group-modal"> {/* CLASE ESPECÍFICA */}
              <label htmlFor="editTelefono">Teléfono</label>
              <input
                type="text"
                id="editTelefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group-row-modal"> {/* CLASE ESPECÍFICA */}
            <div className="form-group-modal"> {/* CLASE ESPECÍFICA */}
              <label htmlFor="editRol">Rol</label>
              <select
                id="editRol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="ROLE_estudiante">Estudiante</option>
                <option value="ROL_admin">Administrador</option>
                <option value="ROLE_docente">Docente</option>
              </select>
            </div>
          </div>

          <div className="user-management-modal-actions"> {/* CLASE ESPECÍFICA */}
            <button type="submit" className="btn btn-save-user">Guardar cambios</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}