import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import './CatalogoCursos.css'; // Puedes crear tus estilos personalizados

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


  // Cargar cursos comprados por el usuario si hay token
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


  // Agregar curso al carrito
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
    <Container className="py-5">
      <h2 className="text-center mb-4">Catálogo de Cursos</h2>
      <Row>
        {cursos.length > 0 ? (
          cursos.map(curso => (
            <Col key={curso.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={curso.imagen || "https://via.placeholder.com/400x200?text=Curso"}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{curso.nombre}</Card.Title>
                  <Card.Text className="text-truncate">
                    {curso.descripcion}
                  </Card.Text>
                  <div className="mb-2">
                    <strong>Docente:</strong> {curso.docenteNombre}
                  </div>
                  <div className="mb-2">
                    <strong>Precio:</strong> ${curso.precio}
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/catalogo/curso/${curso.id}`)}
                    >
                      Ver curso
                    </Button>

                    {comprados.includes(curso.id) ? (
                      <Button variant="secondary" disabled>
                        Ya comprado
                      </Button>
                    ) : (
                      <Button
                        variant="outline-success"
                        onClick={() => handleAgregarCarrito(curso.id)}
                      >
                        <FaShoppingCart className="me-2" />
                        Agregar al carrito
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No hay cursos disponibles en este momento.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CatalogoCursos;
