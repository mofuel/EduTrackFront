import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import "./CursoDetalle.css";
import AppNavbar from "./Navbar"; 

export default function CursoDetalle() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/cursos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Curso no encontrado");
        return res.json();
      })
      .then((data) => setCurso(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!curso) return <p className="text-center mt-5">Cargando curso...</p>;

  return (
  <>
    <AppNavbar /> {/* Navbar siempre visible arriba */}
    
    <div className="detalle-wrapper">
      <Container className="curso-detalle-container">
        <Row>
          {/* Columna principal de información */}
          <Col lg={8}>
            <h1>{curso.nombre}</h1>
            <p className="text-muted">{curso.descripcion}</p>

            <h5 className="mt-4">Lo que aprenderás</h5>
            <Card className="mb-3 p-3">
              <p>{curso.objetivos}</p>
            </Card>

            <h5>Este curso incluye</h5>
            <ul>
              {curso.incluye?.split("\n").map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h5 className="mt-4">Requisitos</h5>
            <Card className="mb-3 p-3">
              <p>{curso.requisitos}</p>
            </Card>

            <h5>Docente</h5>
            <p><Badge bg="secondary">{curso.docenteNombre}</Badge></p>
          </Col>

          {/* Columna lateral con imagen y precio */}
          <Col lg={4}>
            <Card className="shadow sticky-top curso-side-card">
              <Card.Img
                variant="top"
                src={curso.imagen || "https://via.placeholder.com/600x300"}
                alt="Imagen del curso"
                className="img-fluid"
                style={{ maxHeight: "220px", objectFit: "cover" }}
              />
              <Card.Body>
                <h3 className="mb-3">S/ {curso.precio?.toFixed(2)}</h3>
                {curso.disponibleParaCompra ? (
                  <Button variant="success" className="w-100">Comprar curso</Button>
                ) : (
                  <Button variant="secondary" className="w-100" disabled>No disponible</Button>
                )}
                <p className="mt-3 text-muted small">
                  Acceso de por vida · Certificado de finalización
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  </>
);

}
