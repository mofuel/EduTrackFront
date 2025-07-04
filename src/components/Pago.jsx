import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

import NavbarEstudiante from "./navbar-estudiante"; // Asegúrate de que la ruta sea correcta
import qrYape from '../assets/qr-yape.png';
import qrPlin from '../assets/qr-plin.png';
import "./Pago.css"; // Esta es la hoja de estilos clave

export default function Pago() {
  const [metodoPago, setMetodoPago] = useState("");
  const [referenciaPago, setReferenciaPago] = useState("");
  const [nombreTitular, setNombreTitular] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [loadingCarrito, setLoadingCarrito] = useState(true);

  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Sesión requerida",
        text: "Debes iniciar sesión para proceder con el pago.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUsuarioId(decoded.userId);
    } catch (error) {
      console.error("Error al decodificar token:", error);
      Swal.fire({
        icon: "error",
        title: "Token inválido",
        text: "Tu sesión ha expirado o es inválida. Por favor, inicia sesión nuevamente.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        localStorage.clear();
        navigate("/login");
      });
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchCarrito = async () => {
      if (usuarioId) {
        setLoadingCarrito(true);
        try {
          const response = await fetch(`http://localhost:8080/api/carrito/${usuarioId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo cargar el carrito.`);
          }

          const data = await response.json();
          // Asegurarse de que el nombre del curso viene en cada item del carrito
          // Si tu backend no envía 'nombreCurso', necesitarás ajustarlo ahí.
          // Para evitar que "Curso Desconocido" aparezca, el backend debería proveerlo.
          setCarrito(data);
        } catch (err) {
          console.error("Error al cargar carrito:", err);
          Swal.fire("Error", "No se pudo cargar tu carrito. Intenta de nuevo más tarde.", "error").then(() => {
            navigate("/carrito");
          });
        } finally {
          setLoadingCarrito(false);
        }
      }
    };

    if (usuarioId) {
      fetchCarrito();
    }
  }, [usuarioId, token, navigate]);

  const handlePago = async () => {
    if (carrito.length === 0) {
      return Swal.fire("Carrito vacío", "No hay cursos en tu carrito para pagar.", "info").then(() => {
        navigate("/catalogo");
      });
    }

    if (!metodoPago) {
      return Swal.fire("Advertencia", "Selecciona un método de pago", "warning");
    }

    if (metodoPago === "tarjeta" && (!nombreTitular || !numeroTarjeta || !fechaVencimiento || !cvv)) {
      return Swal.fire("Faltan datos", "Completa todos los datos de la tarjeta", "warning");
    }

    if ((metodoPago === "yape" || metodoPago === "plin") && !referenciaPago) {
      return Swal.fire("Faltan datos", "Debes ingresar el número de operación", "warning");
    }

    // Validaciones de formato
    const fechaRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (metodoPago === "tarjeta" && !fechaVencimiento.match(fechaRegex)) {
        return Swal.fire("Formato inválido", "La fecha de vencimiento debe ser MM/AA", "warning");
    }

    const cvvRegex = /^[0-9]{3,4}$/;
    if (metodoPago === "tarjeta" && !cvv.match(cvvRegex)) {
        return Swal.fire("Formato inválido", "El CVV debe tener 3 o 4 dígitos numéricos", "warning");
    }

    const numeroTarjetaRegex = /^[0-9]{16}$/;
    if (metodoPago === "tarjeta" && !numeroTarjeta.match(numeroTarjetaRegex)) {
        return Swal.fire("Formato inválido", "El número de tarjeta debe tener 16 dígitos numéricos", "warning");
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

      Swal.fire({
        title: "¡Pago Realizado!",
        text: "Gracias por tu compra. Tus cursos ya están disponibles.",
        icon: "success",
        confirmButtonText: "Ir a Mis Cursos",
      }).then(() => navigate("/cursosestudiante"));

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo procesar el pago. Intenta de nuevo.", "error");
    }
  };

  const calcularTotal = () => carrito.reduce((total, item) => total + (item.precio || 0), 0).toFixed(2);

  return (
    <>
      <NavbarEstudiante />
      <div className="pago-page-wrapper"> {/* Fondo de la página */}
        <Container className="pago-content-container"> {/* Contenedor principal para el formulario */}
          <h1 className="pago-main-title text-center mb-5">Finalizar Compra</h1> {/* Título principal */}

          {loadingCarrito ? (
            <div className="pago-message text-center">Cargando detalles del pedido...</div>
          ) : carrito.length === 0 ? (
            <div className="pago-message text-center">
              <p>Tu carrito está vacío. No hay nada que pagar.</p>
              <Button as={Link} to="/catalogo" className="pago-main-btn">Explorar Cursos</Button>
            </div>
          ) : (
            <Row className="justify-content-center">
              <Col lg={8} xl={7}> {/* Columna centralizada para el contenido del pago */}
                <div className="pago-form-card"> {/* Tarjeta envolvente para el formulario */}
                  <div className="pago-summary-section mb-4">
                    <h2 className="pago-section-title mb-3">Resumen de tu Pedido</h2>
                    {carrito.map((item) => (
                      <div key={item.cursoId} className="pago-item-summary d-flex justify-content-between align-items-center mb-2">
                        <span className="pago-item-name">{item.nombreCurso || 'Curso Desconocido'}</span>
                        <span className="pago-item-price">S/ {item.precio ? item.precio.toFixed(2) : '0.00'}</span>
                      </div>
                    ))}
                    <div className="pago-total-display d-flex justify-content-between align-items-center mt-3 pt-3">
                      <span className="pago-total-label">Total a Pagar:</span>
                      <span className="pago-total-amount">S/ {calcularTotal()}</span>
                    </div>
                  </div>

                  <hr className="pago-divider my-4" />

                  <div className="pago-method-section">
                    <h2 className="pago-section-title mb-4">Selecciona tu Método de Pago</h2>
                    <Form>
                      <Form.Group className="mb-4">
                        <Form.Label className="pago-form-label">Método de Pago</Form.Label>
                        <Form.Select
                          className="form-control-custom"
                          value={metodoPago}
                          onChange={(e) => setMetodoPago(e.target.value)}
                        >
                          <option value="">--- Seleccione ---</option>
                          <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                          <option value="yape">Yape</option>
                          <option value="plin">Plin</option>
                        </Form.Select>
                      </Form.Group>

                      {metodoPago === "tarjeta" && (
                        <div className="pago-card-details">
                          <Form.Group className="mb-3">
                            <Form.Label className="pago-form-label">Nombre del titular</Form.Label>
                            <Form.Control
                              type="text"
                              value={nombreTitular}
                              onChange={(e) => setNombreTitular(e.target.value)}
                              className="form-control-custom"
                              placeholder="Nombre en la tarjeta"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label className="pago-form-label">Número de tarjeta</Form.Label>
                            <Form.Control
                              type="text"
                              maxLength={16}
                              value={numeroTarjeta}
                              onChange={(e) => setNumeroTarjeta(e.target.value.replace(/\D/g, ''))} // Solo números
                              className="form-control-custom"
                              placeholder="XXXX XXXX XXXX XXXX"
                            />
                          </Form.Group>
                          <Row>
                            <Col xs={7}>
                              <Form.Group className="mb-3">
                                <Form.Label className="pago-form-label">Fecha de vencimiento</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="MM/AA"
                                  maxLength={5}
                                  value={fechaVencimiento}
                                  onChange={(e) => setFechaVencimiento(e.target.value)}
                                  className="form-control-custom"
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={5}>
                              <Form.Group className="mb-3">
                                <Form.Label className="pago-form-label">CVV</Form.Label>
                                <Form.Control
                                  type="password"
                                  maxLength={4}
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} // Solo números
                                  className="form-control-custom"
                                  placeholder="XXX"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      )}

                      {(metodoPago === "yape" || metodoPago === "plin") && (
                        <div className="qr-payment-details text-center">
                          <h4 className="qr-title mb-3">Pagar con {metodoPago.toUpperCase()}</h4>
                          <div className="qr-img-box mb-3">
                            <img src={metodoPago === "yape" ? qrYape : qrPlin} alt={`QR ${metodoPago}`} className="qr-img" />
                          </div>
                          <p className="qr-instruction">Escanea el código con tu app de {metodoPago.toUpperCase()} y luego ingresa el **número de operación**.</p>
                          <Form.Group className="mb-3">
                            <Form.Label className="pago-form-label">Número de operación</Form.Label>
                            <Form.Control
                              type="text"
                              value={referenciaPago}
                              onChange={(e) => setReferenciaPago(e.target.value)}
                              placeholder="Ej: 123456789"
                              className="form-control-custom"
                            />
                          </Form.Group>
                        </div>
                      )}

                      <Button className="pago-main-btn mt-5" variant="success" onClick={handlePago}>
                        Confirmar Pago
                      </Button>
                    </Form>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </>
  );
}