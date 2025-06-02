// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
// Importamos Link y useLocation de react-router-dom
import { Link, useLocation } from "react-router-dom";
// Importamos los componentes de React-Bootstrap
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
import "./Navbar.css";

export default function AppNavbar() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation(); // Hook para obtener la URL actual

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50; // Umbral de scroll en píxeles
      if (window.scrollY > scrollThreshold) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              to="/" // Navega a la Home
              onClick={() => handleScrollToSection('featured-courses')} // ID de la sección de cursos
              // Añade 'active' si quieres resaltarlo cuando estés en la Home
              className={location.pathname === '/' ? 'active' : ''}
            >
              Cursos
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

            {/* Nav.Link para 'Testimonios' (asume que es una sección en tu Home) */}
            <Nav.Link
              as={Link}
              to="/" // Navega a la Home
              onClick={() => handleScrollToSection('testimonios')} // ID de la sección de testimonios
              className={location.pathname === '/' ? 'active' : ''}
            >
              Team-EduTrack
            </Nav.Link>


            {/* Botón de Login */}
            {/* Usamos Button con la prop 'as={Link}' y 'to="/login"' */}
            <Button
              as={Link}
              to="/login"
              variant="outline-light"
              className={`custom-btn-login me-4 ${location.pathname === '/login' ? 'active-btn' : ''}`}
            >
              Login
            </Button>

            {/* Botón de Registrarse */}
            {/* Usamos Button con la prop 'as={Link}' y 'to="/register"' */}
            <Button
              as={Link}
              to="/register"
              variant="light"
              className={`custom-btn-register ${location.pathname === '/register' ? 'active-btn' : ''}`}
            >
              Registrarse
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}