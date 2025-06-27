import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import qrYape from '../assets/qr-yape.png';
import qrPlin from '../assets/qr-plin.png';
import "./Pago.css";


export default function Pago() {
    const [metodoPago, setMetodoPago] = useState("");
    const [referenciaPago, setReferenciaPago] = useState("");
    const [nombreTitular, setNombreTitular] = useState("");
    const [numeroTarjeta, setNumeroTarjeta] = useState("");
    const [fechaVencimiento, setFechaVencimiento] = useState("");
    const [cvv, setCvv] = useState("");
    const token = localStorage.getItem("jwt");
    const [usuarioId, setUsuarioId] = useState(null);
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        if (!token) return;
        try {
            const decoded = jwtDecode(token);
            setUsuarioId(decoded.userId);
        } catch (error) {
            Swal.fire("Error", "Token inválido", "error");
        }
    }, [token]);

    useEffect(() => {
        if (usuarioId) {
            fetch(`http://localhost:8080/api/carrito/${usuarioId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setCarrito(data))
                .catch((err) => console.error("Error al cargar carrito:", err));
        }
    }, [usuarioId]);

    const handlePago = async () => {
        if (!metodoPago) {
            return Swal.fire("Advertencia", "Selecciona un método de pago", "warning");
        }

        // Validación simple
        if (
            metodoPago === "tarjeta" &&
            (!nombreTitular || !numeroTarjeta || !fechaVencimiento || !cvv)
        ) {
            return Swal.fire("Faltan datos", "Completa todos los datos de la tarjeta", "warning");
        }

        if ((metodoPago === "yape" || metodoPago === "plin") && !referenciaPago) {
            return Swal.fire("Faltan datos", "Debes ingresar el número de operación", "warning");
        }

        try {
            for (const item of carrito) {
                await fetch("http://localhost:8080/api/pagos/registrar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        usuarioId,
                        cursoId: item.cursoId,
                        metodoPago,
                        referenciaPago: metodoPago === "tarjeta" ? numeroTarjeta.slice(-4) : referenciaPago,
                    }),
                });
            }

            Swal.fire("Pago realizado", "Gracias por tu compra.", "success").then(() =>
                window.location.href = "/cursos-comprados"
            );
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo procesar el pago", "error");
        }
    };

    const calcularTotal = () =>
        carrito.reduce((total, item) => total + item.precio, 0).toFixed(2);

    return (
        <div className="pago-wrapper">
            <Container className="pago-container">
                <h2 className="pago-title">Resumen de Pago</h2>

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="pago-form-label">Método de Pago</Form.Label>
                        <Form.Select
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                        >
                            <option value="">--- Seleccione ---</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="yape">Yape</option>
                            <option value="plin">Plin</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Condicional: Tarjeta */}
                    {metodoPago === "tarjeta" && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre del titular</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nombreTitular}
                                    onChange={(e) => setNombreTitular(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Número de tarjeta</Form.Label>
                                <Form.Control
                                    type="text"
                                    maxLength={16}
                                    value={numeroTarjeta}
                                    onChange={(e) => setNumeroTarjeta(e.target.value)}
                                />
                            </Form.Group>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Fecha de vencimiento</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="MM/AA"
                                            maxLength={5}
                                            value={fechaVencimiento}
                                            onChange={(e) => setFechaVencimiento(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control
                                            type="password"
                                            maxLength={4}
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    )}

                    {(metodoPago === "yape" || metodoPago === "plin") && (
                        <>
                            <div className="qr-container mb-3">
                                <img
                                    src={metodoPago === "yape" ? qrYape : qrPlin}
                                    alt={`QR ${metodoPago}`}
                                    className="qr-img"
                                />
                                <p className="qr-msg">
                                    Escanea el código con tu app de {metodoPago.toUpperCase()} y luego
                                    introduce el número de operación como comprobante.
                                </p>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label>Número de operación</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={referenciaPago}
                                    onChange={(e) => setReferenciaPago(e.target.value)}
                                    placeholder="Ej: 123456"
                                />
                            </Form.Group>
                        </>
                    )}

                </Form>

                <div className="pago-total">Total a pagar: S/ {calcularTotal()}</div>
                <Button className="pago-btn" variant="success" onClick={handlePago}>
                    Confirmar Pago
                </Button>
            </Container>
        </div>
    );

}
