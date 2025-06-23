import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import "./Carrito.css";

export default function Carrito() {
    const [items, setItems] = useState([]);
    const [usuarioId, setUsuarioId] = useState(null);
    const token = localStorage.getItem("jwt");

    // Decodificar JWT y obtener userId
    useEffect(() => {
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Sesión requerida",
                text: "Debes iniciar sesión para ver tu carrito.",
                confirmButtonText: "Iniciar sesión",
            }).then(() => {
                window.location.href = "/login";
            });
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUsuarioId(decoded.userId); // Ajusta si tu campo es diferente (ej: id, sub, etc.)
        } catch (error) {
            console.error("Error al decodificar token:", error);
            Swal.fire({
                icon: "error",
                title: "Token inválido",
                text: "Tu sesión ha expirado o es inválida.",
            });
        }
    }, [token]);

    // Cargar items del carrito del usuario
    useEffect(() => {
        if (usuarioId) {
            fetch(`http://localhost:8080/api/carrito/${usuarioId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setItems(data))
                .catch((err) => console.error("Error al cargar carrito:", err));
        }
    }, [usuarioId, token]);

    // Eliminar curso del carrito
    const eliminarDelCarrito = (cursoId) => {
        fetch(`http://localhost:8080/api/carrito/eliminar?cursoId=${cursoId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error en la respuesta del servidor");

                setItems((prev) => prev.filter((item) => item.cursoId !== cursoId));

                Swal.fire({
                    icon: "success",
                    title: "Curso eliminado",
                    text: "El curso fue eliminado del carrito correctamente.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            })
            .catch((err) => {
                console.error("Error al eliminar del carrito:", err);
                Swal.fire("Error", "No se pudo eliminar el curso del carrito", "error");
            });
    };


    // Calcular total del carrito
    const calcularTotal = () =>
        items.reduce((total, item) => total + item.precio, 0).toFixed(2);

    return (
        <div className="carrito-wrapper">
            <Container className="carrito-container">
                <h2 className="mb-4">Mi Carrito</h2>

                {items.length === 0 ? (
                    <p>No tienes cursos en tu carrito.</p>
                ) : (
                    <>
                        <Row>
                            {items.map((item) => (
                                <Col md={6} lg={4} key={item.cursoId} className="mb-4">
                                    <Card className="curso-card">
                                        <Card.Img
                                            variant="top"
                                            src={item.imagen || "https://via.placeholder.com/300x200"}
                                            className="img-fluid"
                                        />
                                        <Card.Body>
                                            <Card.Title>{item.nombreCurso}</Card.Title>
                                            <Card.Text>S/ {item.precio.toFixed(2)}</Card.Text>
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => eliminarDelCarrito(item.cursoId)}
                                            >
                                                Eliminar
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div className="total-section mt-4 text-end">
                            <h5>Total: S/ {calcularTotal()}</h5>
                            <Button variant="success">Proceder al pago</Button>
                        </div>
                    </>
                )}
            </Container>
        </div>
    );
}
