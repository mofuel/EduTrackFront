import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import "./CursosEstudiante.css";

export default function CursosEstudiante() {
  const [cursos, setCursos] = useState([]);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (!token) {
      Swal.fire("Sesión requerida", "Inicia sesión para ver tus cursos.", "warning").then(() => {
        window.location.href = "/login";
      });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const usuarioId = decoded.userId;

      fetch(`http://localhost:8080/api/cursos-comprados/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setCursos(data))
        .catch((err) => console.error("Error al cargar cursos comprados:", err));
    } catch (error) {
      console.error("Token inválido", error);
      Swal.fire("Error", "Tu sesión ha expirado", "error");
    }
  }, [token]);

  return (
    <div className="cursos-estudiante-wrapper">
      <Container className="py-5">
        <h2 className="mb-4 text-center">Mis Cursos Comprados</h2>

        {cursos.length === 0 ? (
          <p className="text-center">Aún no has comprado ningún curso.</p>
        ) : (
          <Row>
            {cursos.map((curso) => (
              <Col md={6} lg={4} key={curso.id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={curso.imagen || "https://via.placeholder.com/400x200"}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{curso.nombre}</Card.Title>
                    <Card.Text className="text-muted">
                      {curso.descripcion?.slice(0, 100)}...
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => window.location.href = `/modulos-curso/${curso.id}`}
                    >
                      Ir al curso
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
