import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import NavbarEstudiante from './navbar-estudiante'; // Asegúrate de que la ruta sea correcta
import './CursosEstudiante.css';

export default function CursosEstudiante() {
  const [cursos, setCursos] = useState([]);
  const token = localStorage.getItem("jwt");
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Debes iniciar sesión para ver tus cursos.',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }

    const fetchCursosComprados = async () => {
      setIsLoading(true); // Inicia la carga
      try {
        const decoded = jwtDecode(token);
        const usuarioId = decoded.userId;

        if (!usuarioId) {
          throw new Error("Token inválido: userId no encontrado");
        }

        const response = await fetch(`http://localhost:8080/api/cursos-comprados/${usuarioId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Acceso no autorizado o token expirado.");
          }
          throw new Error("Error al cargar tus cursos.");
        }

        const data = await response.json();
        setCursos(data);
      } catch (error) {
        console.error("Error al cargar cursos comprados:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudieron cargar tus cursos. Inténtalo de nuevo más tarde.',
        }).then(() => {
          if (error.message.includes("expirado") || error.message.includes("inválido")) {
            localStorage.clear();
            window.location.href = "/login";
          }
        });
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    fetchCursosComprados();
  }, [token]);

  return (
    <>
      <NavbarEstudiante />
      <div className="catalogo-background cursos-estudiante-background"> {/* Reutilizamos la clase de fondo del catálogo y una específica */}
        <Container className="py-5">
          <h1 className="catalogo-title text-center mb-3">Mis Cursos</h1> {/* Reutilizamos el estilo del título */}
          <p className="catalogo-subtitle text-center mb-5">
            Aquí encontrarás todos los cursos que has adquirido. ¡Sigue aprendiendo!
          </p>

          {isLoading ? (
            <p className="text-center text-light">Cargando tus cursos...</p>
          ) : cursos.length === 0 ? (
            <p className="text-center text-light">Aún no has comprado ningún curso. ¡Explora nuestro <a href="/catalogo" className="text-warning">catálogo</a>!</p>
          ) : (
            <Row>
              {cursos.map((curso) => (
                <Col
                  key={curso.id}
                  xs={12} sm={6} lg={4}
                  className="mb-4 d-flex align-items-stretch"
                >
                  <Card className="curso-card h-100"> {/* Reutilizamos la clase de tarjeta del catálogo */}
                    <Card.Img
                      variant="top"
                      src={curso.imagen || "https://via.placeholder.com/400x200?text=Mi+Curso"}
                      className="curso-card-img" // Reutilizamos la clase de imagen del catálogo
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="curso-card-title">{curso.nombreCurso}</Card.Title> {/* Reutilizamos el estilo del título de la tarjeta */}
                      <Card.Text className="curso-card-text">
                        {curso.descripcion?.length > 150
                          ? `${curso.descripcion.slice(0, 150)}...`
                          : curso.descripcion}
                      </Card.Text>
                      <div className="mt-auto">
                        <div className="mb-2 curso-card-docente">
                          <strong>Docente:</strong> {curso.docenteNombre || 'N/A'}
                        </div>
                        <Button
                          variant="primary"
                          className="btn-ver-curso w-100" // Reutilizamos el botón y lo hacemos full width
                          onClick={() => window.location.href = `/modulos-curso/${curso.id}`}
                        >
                          Ir al Curso
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </>
  );
}