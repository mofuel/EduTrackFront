import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { FaCheckCircle, FaInfinity, FaCertificate } from "react-icons/fa";
import NavbarEstudiante from "./navbar-estudiante";
import "./CursoDetalle.css";

export default function CursoDetalle() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [yaComprado, setYaComprado] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const token = localStorage.getItem("jwt");

  // ... (toda tu lógica de useEffects y handleAgregarAlCarrito se queda igual)
  useEffect(() => {
    fetch(`http://localhost:8080/api/cursos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Curso no encontrado");
        return res.json();
      })
      .then((data) => setCurso(data))
      .catch((err) => console.error("Error al cargar curso:", err));
  }, [id]);

  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const uid = decoded.userId;
      setUsuarioId(uid);

      fetch(`http://localhost:8080/api/cursos-comprados/existe?usuarioId=${uid}&cursoId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  if (!curso) {
    return (
      <>
        <NavbarEstudiante />
        <div className="detalle-wrapper d-flex justify-content-center align-items-center">
          <p className="text-center mt-5">Cargando curso...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarEstudiante />
      <div className="detalle-wrapper">
        <Container className="py-5">
          <Row>
            <Col lg={8} md={7}>
              <div className="curso-main-content">
                <h1 className="curso-title">{curso.nombre}</h1>
                <p className="curso-descripcion">{curso.descripcion}</p>
                <div className="docente-info">
                  <span>Dictado por: <strong>{curso.docenteNombre}</strong></span>
                </div>

                <div className="section-card mt-4">
                  {/* 👇 CAMBIO DE CLASE AQUÍ 👇 */}
                  <h5 className="section-title-dc">Lo que aprenderás</h5>
                  <p>{curso.objetivos}</p>
                </div>

                <div className="section-card mt-4">
                  {/* 👇 CAMBIO DE CLASE AQUÍ 👇 */}
                  <h5 className="section-title-dc">Este curso incluye</h5>
                  <Row>
                    {curso.incluye?.split("\n").map((item, i) => (
                      item && <Col md={6} key={i} className="incluye-item">
                        <FaCheckCircle className="incluye-icon" />
                        <span>{item}</span>
                      </Col>
                    ))}
                  </Row>
                </div>

                <div className="section-card mt-4">
                  {/* 👇 CAMBIO DE CLASE AQUÍ 👇 */}
                  <h5 className="section-title-dc">Requisitos</h5>
                  <p>{curso.requisitos}</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={5}>
              <Card className="shadow sticky-top curso-side-card">
                <Card.Img
                  variant="top"
                  src={curso.imagen || "https://via.placeholder.com/600x300"}
                  className="side-card-img"
                />
                <Card.Body>
                  <h3 className="side-card-price">S/ {curso.precio?.toFixed(2)}</h3>
                  {yaComprado ? (
                    <Button className="btn-comprado w-100" disabled>Ya comprado</Button>
                  ) : (
                    <Button className="btn-agregar w-100" onClick={handleAgregarAlCarrito}>Añadir al carrito</Button>
                  )}
                  <div className="side-card-meta">
                    <p><FaInfinity /> Acceso de por vida</p>
                    <p><FaCertificate /> Certificado de finalización</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}