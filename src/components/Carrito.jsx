import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import NavbarEstudiante from "./navbar-estudiante";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

import "./Carrito.css"; // Asegúrate de que esta importación es correcta

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwt");

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
      setUsuarioId(decoded.userId);
    } catch (err) {
      console.error("Error al decodificar token:", err);
      Swal.fire({
        icon: "error",
        title: "Token inválido",
        text: "Tu sesión ha expirado o es inválida. Por favor, inicia sesión nuevamente.",
      }).then(() => {
        localStorage.clear();
        window.location.href = "/login";
      });
      setError("Sesión inválida o expirada.");
    }
  }, [token]);

  useEffect(() => {
    const fetchCarritoItems = async () => {
      if (usuarioId) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:8080/api/carrito/${usuarioId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo cargar el carrito.`);
          }

          const data = await response.json();
          setItems(data);
        } catch (err) {
          console.error("Error al cargar carrito:", err);
          setError("No se pudieron cargar los cursos de tu carrito. Intenta de nuevo más tarde.");
        } finally {
          setLoading(false);
        }
      } else if (!token) {
        setLoading(false);
      }
    };

    fetchCarritoItems();
  }, [usuarioId, token]);

  const eliminarDelCarrito = async (cursoId, cursoNombre) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de eliminar "${cursoNombre}"?`,
      text: "Esta acción no se puede revertir.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#8c92ca",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/api/carrito/eliminar?cursoId=${cursoId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor al eliminar.");
        }

        setItems((prev) => prev.filter((item) => item.cursoId !== cursoId));

        Swal.fire({
          icon: "success",
          title: "Curso eliminado",
          text: `"${cursoNombre}" fue eliminado del carrito correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error al eliminar del carrito:", err);
        Swal.fire("Error", "No se pudo eliminar el curso del carrito. Intenta de nuevo.", "error");
      }
    }
  };

  const calcularTotal = () =>
    items.reduce((total, item) => total + item.precio, 0).toFixed(2);

  return (
    <>
      <NavbarEstudiante />
      <div className="carrito-wrapper">
        <Container className="carrito-content-container py-5">
          <h2 className="carrito-title text-center mb-5">Tu Carrito de Compras</h2>

          {loading ? (
            <div className="text-center carrito-loading-message">
              Cargando cursos en tu carrito...
            </div>
          ) : error ? (
            <div className="text-center carrito-error-message">
              <p>{error}</p>
              <Button as={Link} to="/catalogo" variant="primary" className="btn-go-catalog">
                Ir al Catálogo
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center carrito-empty-message">
              <FaShoppingCart className="empty-cart-icon mb-3" />
              <p className="lead mb-4">¡Tu carrito está vacío!</p>
              <p>Parece que aún no has agregado ningún curso.</p>
              <Button as={Link} to="/catalogo" variant="primary" className="btn-go-catalog">
                Explorar Cursos
              </Button>
            </div>
          ) : (
            <div className="carrito-main">
              <div className="carrito-items">
                {items.map((item) => (
                  <Card key={item.cursoId} className="carrito-item-card mb-3">
                    <div className="carrito-item-img-container">
                      <Card.Img
                        src={item.imagen || "https://via.placeholder.com/150x100?text=Curso"}
                        alt={item.nombreCurso}
                      />
                    </div>
                    
                    <div className="carrito-info">
                      <h5>{item.nombreCurso}</h5>
                      <p>Dictado por: <strong>{item.docenteNombre}</strong></p>
                      <p className="precio d-lg-none">S/ {item.precio.toFixed(2)}</p>
                    </div>

                    <div className="carrito-price-action">
                      <p className="precio d-none d-lg-block">S/ {item.precio.toFixed(2)}</p>
                      <Button
                        variant="danger"
                        className="btn-eliminar"
                        onClick={() => eliminarDelCarrito(item.cursoId, item.nombreCurso)}
                      >
                        <FaTrashAlt className="me-1" /> Eliminar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="carrito-summary">
                <Card.Body>
                  <h4>Resumen de tu compra</h4>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="total-label">Total:</span>
                    <span className="total-price">S/ {calcularTotal()}</span>
                  </div>
                  <Button
                    variant="success"
                    className="btn-pagar w-100 mt-3"
                    onClick={() => window.location.href = "/pago"}
                  >
                    Proceder al pago
                  </Button>
                </Card.Body>
              </Card>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}