import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import NavbarEstudiante from './navbar-estudiante';
import './CatalogoCursos.css'; 

const CatalogoCursos = () => {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();
  const [comprados, setComprados] = useState([]);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    fetch("http://localhost:8080/api/cursos/disponibles")
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error("Error al cargar cursos:", err));
  }, []);

  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      fetch(`http://localhost:8080/api/cursos-comprados/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          const idsComprados = data.map(curso => curso.cursoId);
          setComprados(idsComprados);
        })
        .catch(err => console.error("Error al cargar cursos comprados:", err));
    } catch (error) {
      console.error("Error al decodificar token:", error);
    }
  }, [token]);

  const handleAgregarCarrito = async (cursoId) => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Debes iniciar sesión para agregar cursos al carrito.',
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }
    let usuarioId;
    try {
      const decoded = jwtDecode(token);
      usuarioId = decoded.userId;
      if (!usuarioId) throw new Error("Token inválido");
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Token inválido',
        text: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
      });
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/carrito/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuarioId, cursoId }),
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Agregado",
          text: "Curso agregado al carrito correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else if (response.status === 400) {
        Swal.fire({
          icon: "info",
          title: "Ya está en el carrito",
          text: "Este curso ya fue agregado.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Error inesperado");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo agregar el curso al carrito", "error");
    }
  };

  return (
    <>
      <NavbarEstudiante /> 
      <div className="catalogo-background">
        <Container className="py-5">
          <h1 className="catalogo-title text-center mb-3">Catálogo de Cursos</h1>
          <p className="catalogo-subtitle text-center mb-5">
            Explora nuestra selección de cursos y lleva tus habilidades al siguiente nivel.
          </p>
          <Row>
            {cursos.length > 0 ? (
              cursos.map(curso => (
                <Col 
                  key={curso.id} 
                  xs={12} sm={6} lg={4}
                  className="mb-4 d-flex align-items-stretch"
                >
                  <Card className="curso-card h-100">
                    <Card.Img
                      variant="top"
                      src={curso.imagen || "https://via.placeholder.com/400x200?text=EduTrack"}
                      className="curso-card-img"
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="curso-card-title">{curso.nombre}</Card.Title>
                      <Card.Text className="curso-card-text">
                        {curso.descripcion}
                      </Card.Text>
                      <div className="mt-auto"> 
                        <div className="mb-2 curso-card-docente">
                          <strong>Docente:</strong> {curso.docenteNombre}
                        </div>
                        <div className="mb-3 curso-card-precio">
                          S/. {curso.precio}
                        </div>
                        <div className="d-flex justify-content-between gap-2 mt-3">
                          <Button
                            variant="primary"
                            className="btn-ver-curso"
                            onClick={() => navigate(`/catalogo/curso/${curso.id}`)}
                          >
                            Ver Detalles
                          </Button>
                          {comprados.includes(curso.id) ? (
                            <Button variant="secondary" className="btn-comprado" disabled>
                              Adquirido
                            </Button>
                          ) : (
                            <Button
                              variant="outline-success"
                              className="btn-agregar"
                              onClick={() => handleAgregarCarrito(curso.id)}
                            >
                              <FaShoppingCart className="me-2" />
                              Agregar
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-center text-light">No hay cursos disponibles en este momento.</p>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default CatalogoCursos;