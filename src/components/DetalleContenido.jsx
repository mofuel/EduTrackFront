import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Button, Card, Alert } from "react-bootstrap";



export default function DetalleContenido() {
  const { contenidoId } = useParams();
  const [contenido, setContenido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/contenidos/${contenidoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setContenido(data);
      } catch (err) {
        console.error("Error al cargar el contenido:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContenido();
  }, [contenidoId, token]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (!contenido) return <Alert variant="danger">Contenido no encontrado.</Alert>;

  const renderContenido = () => {
    if (contenido.tipo === "video" && contenido.url.includes("youtube")) {
      const videoId = contenido.url.includes("v=")
        ? contenido.url.split("v=")[1]?.split("&")[0]
        : contenido.url.split("/").pop();

      return (
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Video de YouTube"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (contenido.tipo === "pdf") {
      return (
        <iframe
          src={contenido.url}
          width="100%"
          height="600"
          title="Visor PDF"
          onError={() => setIframeError(true)}
        />
      );
    }

    // Intento de cargar cualquier otro recurso en iframe
    return (
      <>
        {!iframeError ? (
          <iframe
            src={contenido.url}
            width="100%"
            height="600"
            title="Contenido Externo"
            onError={() => setIframeError(true)}
          />
        ) : (
          <Alert variant="warning">
            Este contenido no puede visualizarse directamente. Puedes abrirlo en otra pestaña.
          </Alert>
        )}
      </>
    );
  };

 return (
  <div className={`container mt-4 detalle-contenido ${contenido.tipo}`}>
    <Card>
      <Card.Body>
        <h4>{contenido.titulo}</h4>
        <div className="my-3">{renderContenido()}</div>
        <p className="text-muted">
          Recuerda que también puedes acceder directamente al contenido
          desde su fuente externa.
        </p>
        <Button variant="primary" href={contenido.url} target="_blank">
          Abrir en nueva pestaña
        </Button>
      </Card.Body>
    </Card>
  </div>
);


}
