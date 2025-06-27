// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
// Importamos Link y useLocation de react-router-dom
import { Link, useLocation, useNavigate } from "react-router-dom";
// Importamos los componentes de React-Bootstrap
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import logo from "../assets/logo.png";
import "./Navbar.css";

export default function AppNavbar() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation(); // Hook para obtener la URL actual

  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");
  const [nombreUsuario, setNombreUsuario] = useState(null);


  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
      setHasScrolled(window.scrollY > scrollThreshold);
    };

    // Validación de sesión y nombre
    const verificarSesion = () => {
      const token = localStorage.getItem("jwt");
      const nombre = localStorage.getItem("nombre");

      // Opcional: Verifica si el token expiró (usando JWT base64)
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiracion = payload.exp * 1000; // JWT exp es en segundos
          const ahora = Date.now();

          if (expiracion < ahora) {
            // Token expirado
            localStorage.clear();
            setNombreUsuario(null);
          } else {
            // Token válido
            setNombreUsuario(nombre || null);
          }
        } catch (e) {
          console.error("Token inválido:", e);
          localStorage.clear();
          setNombreUsuario(null);
        }
      } else {
        setNombreUsuario(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    verificarSesion();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);


  const handleScrollToSection = (id) => {
    // Solo hace scroll si ya estás en la ruta principal ("/")
    if (location.pathname === '/') {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Si no estás en la Home, el Link ya se encarga de navegar a "/"
    // y luego el componente HomePage se montará y el useEffect de HomePage
    // que incluye el scroll-to-top se ejecutará. Para scroll a una sección específica
    // desde otra página, como te comenté, se necesitaría un enfoque más avanzado (hash routing).
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("rol");
    localStorage.removeItem("email");
    localStorage.removeItem("nombre");
    setNombreUsuario(null);
    navigate("/login");
  };


  return (
    <Navbar
      expand="lg"
      variant="dark"
      // CLAVE: Puedes poner 'fixed-top' aquí si quieres que el navbar siempre esté fijo en la parte superior
      // Si lo quitaste por un problema específico, puedes mantenerlo quitado.
      className={`custom-navbar ${hasScrolled ? 'scrolled' : ''} fixed-top`}
    >
      <Container>
        {/* Usar Link para la marca del navbar, siempre lleva a la Home */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={logo} alt="EduTrack Logo" className="logo-img me-2" />
          <span className="brand-text">EduTrack</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            {/* Nav.Link para 'Cursos' (asume que es una sección en tu Home) */}
            {/* Si estás en la Home, hará scroll. Si estás en otra página, navega a la Home. */}
            <Nav.Link
              as={Link}
              to="/catalogo" // Navega a la Home
              onClick={() => handleScrollToSection('featured-courses')} // ID de la sección de cursos
              // Añade 'active' si quieres resaltarlo cuando estés en la Home
              className={location.pathname === '/catalogo' ? 'active' : ''}
            >
              Catalogo
            </Nav.Link>

            {/* Nav.Link para 'Testimonios' (asume que es una sección en tu Home) */}
            <Nav.Link
              as={Link}
              to="/cursosestudiante" // Navega a la Home
              onClick={() => handleScrollToSection('testimonios')} // ID de la sección de testimonios
              className={location.pathname === '/cursosestudiante' ? 'active' : ''}
            >
              Mis Cursos
            </Nav.Link>

            {/* Nav.Link para 'Testimonios' (asume que es una sección en tu Home) */}
            <Nav.Link
              as={Link}
              to="/" // Navega a la Home
              onClick={() => handleScrollToSection('testimonios')} // ID de la sección de testimonios
              className={location.pathname === '/' ? 'active' : ''}
            >
              Certificados
            </Nav.Link>

            {/* Nav.Link para 'Testimonios' (asume que es una sección en tu Home) */}
            <Nav.Link
              as={Link}
              to="/" // Navega a la Home
              onClick={() => handleScrollToSection('testimonios')} // ID de la sección de testimonios
              className={location.pathname === '/' ? 'active' : ''}
            >
              Nosotros
            </Nav.Link>

          
            <Nav.Link as={Link} to="/carrito" className="me-3 d-flex align-items-center">
              <FaShoppingCart size={20} className="me-1" />
              <span>Carrito</span>
            </Nav.Link>


            {/* Botón de Login */}
            {/* Usamos Button con la prop 'as={Link}' y 'to="/login"' */}
            {token ? (
              <Dropdown align="end" className="me-3">
                <Dropdown.Toggle variant="outline-light" id="dropdown-user">
                  Hola, {nombreUsuario}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/perfil">Perfil</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  className={`custom-btn-login me-4 ${location.pathname === '/login' ? 'active-btn' : ''}`}
                >
                  Login
                </Button>

                <Button
                  as={Link}
                  to="/register"
                  variant="light"
                  className={`custom-btn-register ${location.pathname === '/register' ? 'active-btn' : ''}`}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}