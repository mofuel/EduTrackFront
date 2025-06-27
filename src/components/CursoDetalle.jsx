import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import "./CursoDetalle.css";
import AppNavbar from "./Navbar";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export default function CursoDetalle() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [yaComprado, setYaComprado] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const token = localStorage.getItem("jwt");

  // ✅ Nuevo useEffect para cargar los datos del curso
  useEffect(() => {
    fetch(`http://localhost:8080/api/cursos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Curso no encontrado");
        return res.json();
      })
      .then((data) => setCurso(data))
      .catch((err) => console.error("Error al cargar curso:", err));
  }, [id]);

  // Verificar si el curso ya fue comprado
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const uid = decoded.userId;
      setUsuarioId(uid);

      fetch(`http://localhost:8080/api/cursos-comprados/existe?usuarioId=${uid}&cursoId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setYaComprado(data))
        .catch((err) => console.error("Error al verificar compra:", err));
    } catch (error) {
      console.error("Token inválido", error);
    }
  }, [id, token]);

  const handleAgregarAlCarrito = async () => {
    if (!token || !usuarioId) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Debes iniciar sesión para añadir cursos al carrito.',
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/carrito/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuarioId, cursoId: parseInt(id) }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Agregado al carrito",
          text: "El curso ha sido añadido correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else if (response.status === 400) {
        Swal.fire({
          icon: "info",
          title: "Ya en el carrito",
          text: "Este curso ya fue agregado al carrito.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Error inesperado");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo añadir el curso al carrito", "error");
    }
  };


  return (
    <>
      <AppNavbar />
      <div className="detalle-wrapper">
        <Container className="curso-detalle-container">
          {curso ? (
            <Row>
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

              <Col lg={4}>
                <Card className="shadow sticky-top curso-side-card">
                  <Card.Img
                    variant="top"
                    src={curso.imagen || "https://via.placeholder.com/600x300"}
                    className="img-fluid"
                    style={{ maxHeight: "220px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <h3 className="mb-3">S/ {curso.precio?.toFixed(2)}</h3>

                    {yaComprado ? (
                      <Button variant="secondary" className="w-100" disabled>
                        Ya comprado
                      </Button>
                    ) : curso.disponibleParaCompra ? (
                      <Button variant="success" className="w-100" onClick={handleAgregarAlCarrito}>
                        Añadir al carrito
                      </Button>
                    ) : (
                      <Button variant="secondary" className="w-100" disabled>
                        No disponible
                      </Button>
                    )}

                    <p className="mt-3 text-muted small">
                      Acceso de por vida · Certificado de finalización
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <p className="text-center mt-5">Cargando curso...</p>
          )}
        </Container>
      </div>
    </>
  );

}
