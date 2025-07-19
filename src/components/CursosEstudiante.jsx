import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import NavbarEstudiante from './navbar-estudiante'; // Asegúrate de que la ruta sea correcta
import './CursosEstudiante.css';

export default function CursosEstudiante() {
  const [cursos, setCursos] = useState([]);
  const [avances, setAvances] = useState([]);
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

    const decoded = jwtDecode(token);
    const usuarioId = decoded.userId;

    const fetchCursosYAvances = async () => {
      setIsLoading(true);
      try {
        const [cursosResp, avancesResp] = await Promise.all([
          fetch(`http://localhost:8080/api/cursos-comprados/${usuarioId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`http://localhost:8080/api/progreso/usuario/${usuarioId}/avance-cursos`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!cursosResp.ok || !avancesResp.ok) {
          throw new Error("Error al obtener datos.");
        }

        const cursosData = await cursosResp.json();
        const avancesData = await avancesResp.json();

        // Asociar porcentaje a cada curso
        const cursosConAvance = cursosData.map(curso => {
          const progreso = avancesData.find(p => p.cursoId === curso.id);
          return {
            ...curso,
            porcentajeAvance: progreso ? progreso.porcentajeAvance : 0,
          };
        });

        setCursos(cursosConAvance);
      } catch (error) {
        console.error("Error al cargar cursos o avances:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudieron cargar tus cursos.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCursosYAvances();
  }, [token]);

  return (
    <>
      <NavbarEstudiante />
      <div className="catalogo-background cursos-estudiante-background">
        <Container className="py-5">
          <h1 className="catalogo-title text-center mb-3">Mis Cursos</h1>
          <p className="catalogo-subtitle text-center mb-5">
            Aquí encontrarás todos los cursos que has adquirido. ¡Sigue aprendiendo!
          </p>

          {isLoading ? (
            <p className="text-center text-light">Cargando tus cursos...</p>
          ) : cursos.length === 0 ? (
            <p className="text-center text-light">
              Aún no has comprado ningún curso. ¡Explora nuestro <a href="/catalogo" className="text-warning">catálogo</a>!
            </p>
          ) : (
            <Row>
              {cursos.map(curso => (
                <Col key={curso.id} xs={12} sm={6} lg={4} className="mb-4 d-flex align-items-stretch">
                  <Card className="curso-card h-100">
                    <Card.Img
                      variant="top"
                      src={curso.imagen || "https://via.placeholder.com/400x200?text=Mi+Curso"}
                      className="curso-card-img"
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="curso-card-title">{curso.nombreCurso}</Card.Title>
                      <Card.Text className="curso-card-text">
                        {curso.descripcion?.length > 150
                          ? `${curso.descripcion.slice(0, 150)}...`
                          : curso.descripcion}
                      </Card.Text>

                      <div className="mt-auto">
                        <div className="mb-2 curso-card-docente">
                          <strong>Docente:</strong> {curso.docenteNombre || 'N/A'}
                        </div>

                        {/* Avance */}
                        <div className="mb-2 curso-card-avance">
                          <strong>Avance:</strong> {curso.porcentajeAvance?.toFixed(1)}%
                          <progress
                            value={curso.porcentajeAvance ?? 0}
                            max="100"
                            className="w-100"
                          ></progress>
                        </div>

                        <Button
                          variant="primary"
                          className="btn-ver-curso w-100"
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