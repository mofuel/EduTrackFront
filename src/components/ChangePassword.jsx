// src/components/ChangePassword.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // Importa useNavigate y useLocation
import { FaLock, FaHome } from 'react-icons/fa'; // Iconos
import Swal from 'sweetalert2';

import './ChangePassword.css'; // Su propio CSS

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState(''); // Estado para almacenar el token de la URL
  const location = useLocation(); // Hook para acceder a la URL
  const navigate = useNavigate(); // Hook para la navegación programática

  // useEffect para extraer el token de la URL cuando el componente se monta
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      console.log('Token extraído de la URL:', tokenFromUrl);
      // Aquí podrías añadir una validación inicial del token si es necesario
    } else {
      console.warn('No se encontró el token en la URL. Redirigiendo a Login.');
      navigate('/login'); // Si no hay token, redirige a Login
    }
  }, [location.search, navigate]); // Dependencias: re-ejecutar si la URL cambia

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden',
        text: 'Por favor, asegúrate de que ambas contraseñas sean iguales.',
      });
      return;
    }

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Token no encontrado',
        text: 'No se pudo procesar la solicitud. Intenta desde el enlace enviado a tu correo.',
      });
      return;
    }

    try {
      // Aquí iría la petición al backend para cambiar la contraseña, por ejemplo:
      // const response = await fetch(`http://localhost:8080/auth/cambiar-password?token=${token}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ nuevaPassword: newPassword }),
      // });

      // if (response.ok) {
      await Swal.fire({
        icon: 'success',
        title: 'Contraseña cambiada',
        text: 'Tu contraseña ha sido actualizada exitosamente.',
        confirmButtonText: 'Iniciar sesión'
      });
      navigate('/login');
      // } else {
      //   const error = await response.text();
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Error al cambiar la contraseña',
      //     text: error || 'Intenta nuevamente.',
      //   });
      // }

    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'No se pudo conectar. Intenta más tarde.',
      });
    }
  };


  if (!token && location.search) { // Opcional: Mostrar un loader mientras se valida el token o si no hay.
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h3>Cargando...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container"> {/* Reutiliza el contenedor de Auth para el fondo */}
      <div className="auth-card change-password-card"> {/* Nueva clase específica */}
        <Link to="/" className="home-icon-link">
          <FaHome className="home-icon" />
        </Link>

        <h2>Cambiar Contraseña</h2>
        <form onSubmit={handleChangePasswordSubmit} className="change-password-form">
          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">Cambiar</button>
        </form>
      </div>
    </div>
  );
}

//handleChangePasswordSubmit
// Aquí iría tu lógica para enviar la nueva contraseña y el token a tu API
// Ejemplo de llamada a API (AJAX/Fetch):
// fetch('/api/reset-password', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ token, newPassword })
// })
// .then(response => response.json())
// .then(data => {
//   if (data.success) {
//     alert('Contraseña cambiada exitosamente. Por favor, inicia sesión.');
//     navigate('/login'); // Redirige al login después de cambiarla
//   } else {
//     alert('Error al cambiar la contraseña: ' + data.message);
//   }
// })
// .catch(error => {
//   console.error('Error:', error);
//   alert('Hubo un problema al intentar cambiar la contraseña.');
// });

// SIMULACIÓN (eliminar en producción):