import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaHome } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import Swal from 'sweetalert2';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();

  // Estados para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  // Estados para recuperación contraseña
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState('email'); // 'email' o 'token'

  const [emailForRecovery, setEmailForRecovery] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Token para validación
  const [tokenLetter, setTokenLetter] = useState('');
  const [tokenNumber, setTokenNumber] = useState('');
  const [tokenError, setTokenError] = useState('');



  // Cooldown para evitar spam de envío de correo recuperación
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  // LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = { email, password };

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login exitoso:", data);

        // Guardar JWT y datos del usuario
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("nombre", data.nombre);

        // Redirigir según rol
        switch (data.rol) {
          case "ROLE_admin":
            navigate("/dashboard-profesor");
            break;
          case "ROLE_docente":
            navigate("/profesor/vista-cursos");
            break;
          case "ROLE_estudiante":
            navigate("/");
            break;
          default:
            navigate("/error");
        }
      } else {
        const data = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Credenciales inválidas',
          text: data.error || 'Verifica tu email y contraseña.',
        });
      }
    } catch (error) {
      console.error("Error en login:", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error al iniciar sesión',
      });
    }
  };


  // ENVÍO CORREO RECUPERACIÓN
  const handleSendRecoveryEmail = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;

    try {
      const res = await fetch('http://localhost:8080/auth/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email: emailForRecovery }),
      });

      const data = await res.json();

      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar correo',
          text: data.error,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: data.mensaje || 'Revisa tu bandeja de entrada.',
          timer: 2000,
          showConfirmButton: false,
        });

        setTokenLetter(data.letraToken || '');
        setTimeout(() => {
          setForgotPasswordStep('token');
        }, 1500);
        setCooldown(30);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo enviar el correo. Intenta nuevamente.',
      });
    }
  };


  // VALIDACIÓN DEL TOKEN
  const handleValidateToken = async (e) => {
    e.preventDefault();
    setTokenError('');

    if (!/^\d{4}$/.test(tokenNumber)) {
      setTokenError('Debes ingresar 4 dígitos numéricos');
      return;
    }

    const fullToken = `${tokenLetter.toUpperCase()}-${tokenNumber}`;

    try {
      const res = await fetch(`http://localhost:8080/auth/verificar?token=${encodeURIComponent(fullToken)}`);

      if (res.ok) {
        // Mostrar confirmación antes de redirigir
        await Swal.fire({
          icon: 'success',
          title: 'Token válido',
          text: 'Serás redirigido para cambiar tu contraseña.',
          confirmButtonText: 'Continuar',
        });

        navigate(`/changepassword?token=${encodeURIComponent(fullToken)}`);


        setShowForgotPasswordModal(false);
        setForgotPasswordStep('email');
        setEmailForRecovery('');
        setTokenLetter('');
        setTokenNumber('');
      } else {
        const data = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Token inválido',
          text: data.error || 'Token inválido o expirado',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo validar el token. Intenta nuevamente.',
      });
    }

  };

  const handleCloseModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPasswordStep('email');
    setEmailForRecovery('');
    setEmailError('');
    setEmailSuccess('');
    setTokenLetter('');
    setTokenNumber('');
    setTokenError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card login-card">
        <Link to="/" className="home-icon-link">
          <FaHome className="home-icon" />
        </Link>

        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <FaUser className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {loginError && <div className="alert alert-danger">{loginError}</div>}

          <div className="login-options-section">
            <div className="remember-me-group">
              <input type="checkbox" id="rememberMe" name="rememberMe" />
              <label htmlFor="rememberMe">Recordarme</label>
            </div>
            <div className="forgot-password-group">
              <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPasswordModal(true); setForgotPasswordStep('email'); }}>¿Olvidaste tu contraseña?</a>
            </div>
          </div>

          <button type="submit" className="auth-button">Entrar</button>
        </form>

        <p className="auth-switch">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>

      {/* MODAL RECUPERACIÓN DE CONTRASEÑA */}
      {showForgotPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={handleCloseModal}>
              <IoCloseSharp />
            </button>

            {forgotPasswordStep === 'email' ? (
              <form onSubmit={handleSendRecoveryEmail} className="forgot-password-form">
                <h3>Recuperar contraseña</h3>
                <p>Ingresa tu correo electrónico:</p>
                <input
                  type="email"
                  id="recoveryEmail"
                  name="recoveryEmail"
                  placeholder="Correo electrónico"
                  value={emailForRecovery}
                  onChange={e => setEmailForRecovery(e.target.value)}
                  required
                />
                {emailError && <div className="error-message">{emailError}</div>}
                {emailSuccess && <div className="success-message">{emailSuccess}</div>}
                <button type="submit" className="modal-button" disabled={cooldown > 0}>
                  Enviar
                </button>
                {cooldown > 0 && <div className="cooldown-message">Espera {cooldown} segundos para enviar otro token.</div>}
              </form>
            ) : (
              <form onSubmit={handleValidateToken} className="validate-token-form">
                <h3>Ingresa el token que recibiste</h3>
                <div className="token-input-group">
                  <input
                    type="text"
                    maxLength={1}
                    placeholder="B"
                    value={tokenLetter}
                    onChange={e => setTokenLetter(e.target.value.toUpperCase())}
                    required
                  />
                  <span>-</span>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="1234"
                    value={tokenNumber}
                    onChange={e => setTokenNumber(e.target.value)}
                    required
                  />
                </div>
                {tokenError && <div className="error-message">{tokenError}</div>}
                <button type="submit" className="modal-button">Validar Token</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
