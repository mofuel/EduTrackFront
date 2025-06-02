import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaBuilding, FaHome } from 'react-icons/fa';
import './Register.css';
import { PiX } from 'react-icons/pi';

export default function Register() {
  const navigate = useNavigate(); // Para redireccionar después del registro

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState({ value: 'Estudiante', label: 'Estudiante' });

  const rolOptions = [
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Docente', label: 'Docente' },
  ];

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgba(5, 22, 255, 0)',
      border: state.isFocused ? '1px solid rgba(255, 255, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(255, 255, 255, 0.1)' : 'none',
      color: 'var(--white-color, #f0f0f0)',
      maxHeight: '50px',
      padding: '0 0 0 40px',
      cursor: 'pointer',
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.6)',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--white-color, #f0f0f0)',
      marginLeft: '0px',
      paddingLeft: '5px',
      transform: 'translateY(-3px)',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.6)',
      marginLeft: '0px',
      paddingLeft: '5px',
    }),
    input: (provided) => ({
      ...provided,
      color: 'var(--white-color, #f0f0f0)',
      marginLeft: '0px',
      paddingLeft: '0px',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.7)',
      transition: 'transform 0.3s ease',
      transform: state.isFocused ? 'rotate(180deg)' : null,
      padding: '8px 12px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgb(6, 22, 75)',
      borderRadius: '8px',
      overflow: 'hidden',
      marginTop: '5px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      zIndex: 1000,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'rgba(255, 255, 255, 0)' : 'transparent',
      color: 'var(--white-color, #f0f0f0)',
      padding: '12px 15px',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
      },
      ...(state.isSelected && {
        backgroundColor: 'rgba(166, 187, 255, 0.3)',
        fontWeight: 'bold',
      }),
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const userData = {
      nombre,
      apellido,
      telefono,
      dni,
      email,
      password,
      confirmPassword,
      rol: rol.value
    };

    try {
      const response = await fetch('http://localhost:8080/api/usuarios/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      if (response.ok) {
        alert('Registro exitoso.');
        navigate('/login');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          alert(`Error al registrar: ${errorData.message || 'Inténtalo de nuevo'}`);
        } else {
          const text = await response.text();
          alert(`Error al registrar: ${text}`);
        }
      }

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Error en la conexión al servidor.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <Link to="/" className="home-icon-link">
          <FaHome className="home-icon" />
        </Link>

        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit} className="register-form">
          {/* Fila 1 */}
          <div className="form-row">
            <div className="form-group half-width">
              <span className="input-title">Nombres</span>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
            </div>
            <div className="form-group half-width">
              <span className="input-title">Teléfono</span>
              <div className="input-with-icon">
                <FaPhone className="input-icon" />
                <input type="tel" id="telefono" name="telefono" placeholder="Tu teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
              </div>
            </div>
          </div>

          {/* Fila 2 */}
          <div className="form-row">
            <div className="form-group half-width">
              <span className="input-title">Apellidos</span>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input type="text" id="apellido" name="apellido" placeholder="Tu apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
              </div>
            </div>
            <div className="form-group half-width">
              <span className="input-title">Rol</span>
              <div className="input-with-icon">
                <FaBuilding className="input-icon" />
                <Select id="rol" name="rol" options={rolOptions} value={rol} onChange={setRol} styles={customSelectStyles} isSearchable={false} />
              </div>
            </div>
          </div>

          {/* Fila 3 */}
          <div className="form-row">
            <div className="form-group half-width">
              <span className="input-title">DNI</span>
              <div className="input-with-icon">
                <FaIdCard className="input-icon" />
                <input type="text" id="dni" name="dni" placeholder="Tu DNI" value={dni} onChange={(e) => setDni(e.target.value)} required />
              </div>
            </div>
            <div className="form-group half-width">
              <span className="input-title">Contraseña</span>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input type="password" id="password" name="password" placeholder="Contraseña segura" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
          </div>

          {/* Fila 4 */}
          <div className="form-row">
            <div className="form-group half-width">
              <span className="input-title">Correo electrónico</span>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input type="email" id="email" name="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="form-group half-width">
              <span className="input-title">Confirmar contraseña</span>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>
          </div>

          <button type="submit" className="auth-button">Registrarse</button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}
