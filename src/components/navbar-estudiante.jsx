import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import logo from "../assets/logo.png"; // Ajusta la ruta si es necesario
import "./navbar-estudiante.css";

export default function NavbarEstudiante() {
  const [nombreUsuario, setNombreUsuario] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const verificarSesion = () => {
      const nombre = localStorage.getItem("nombre");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            localStorage.clear();
            setNombreUsuario(null);
          } else {
            setNombreUsuario(nombre || null);
          }
        } catch (e) {
          localStorage.clear();
          setNombreUsuario(null);
        }
      } else {
        setNombreUsuario(null);
      }
    };
    verificarSesion();
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setNombreUsuario(null);
    navigate("/login");
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar-estudiante">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={logo} alt="EduTrack Logo" className="logo-img me-2" />
          <span className="brand-text">EduTrack</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={NavLink} to="/catalogo">Catálogo</Nav.Link>
            <Nav.Link as={NavLink} to="/cursosestudiante">Mis Cursos</Nav.Link>
            <Nav.Link as={NavLink} to="/certificados">Certificados</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/carrito" className="me-3 d-flex align-items-center">
              <FaShoppingCart size={20} className="me-1" />
              <span>Carrito</span>
            </Nav.Link>
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
                <Button as={Link} to="/login" variant="outline-light" className="custom-btn-login me-4">Login</Button>
                <Button as={Link} to="/register" variant="light" className="custom-btn-register">Registrarse</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}