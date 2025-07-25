import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Collapse, Modal, Form, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import VProfesorNavbar from "./VProfesorNavbar";
import styles from "./ModulosCurso.module.css";
import { FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from "react-icons/fa";

export default function ModulosCurso() {
  const { cursoId } = useParams();
  const [modulos, setModulos] = useState([]);
  const [idModuloExpandido, setIdModuloExpandido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNuevoModulo, setShowNuevoModulo] = useState(false);
  const [nuevoModulo, setNuevoModulo] = useState({
    titulo: "",
    descripcion: "",
  });

  const [showNuevoContenido, setShowNuevoContenido] = useState(false);
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
  const [nuevoContenido, setNuevoContenido] = useState({
    titulo: "",
    tipo: "pdf",
    url: "",
  });

  const token = localStorage.getItem("jwt");

  const [modoEdicionModulo, setModoEdicionModulo] = useState(false);
  const [modoEdicionContenido, setModoEdicionContenido] = useState(false);
  const [moduloIdEditando, setModuloIdEditando] = useState(null);
  const [contenidoIdEditando, setContenidoIdEditando] = useState(null);
  const [disponibleParaCompra, setDisponibleParaCompra] = useState(false);
  const [rol, setRol] = useState(null);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  //AGREGUE 2
  const [reseña, setReseña] = useState({ comentario: "", estrellas: 5 });
  const [reseñaGuardada, setReseñaGuardada] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  const handleToggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  const fetchModulos = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/modulos/curso/${cursoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setModulos(data);
    } catch (err) {
      console.error("Error cargando módulos o contenidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRol(decoded.rol || decoded.role || "");
      } catch (error) {
        console.error("Token inválido", error);
      }
    }
  }, [token]);

  const esDocenteOAdmin = rol === "ROLE_docente" || rol === "ROLE_admin";

  useEffect(() => {
    fetchModulos();
    fetchTodasLasReseñas();
    const fetchCurso = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/cursos/${cursoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setDisponibleParaCompra(data.disponibleParaCompra);
      } catch (err) {
        console.error("Error al cargar estado de disponibilidad:", err);
      }
    };
    fetchCurso();

    //agregue 3
      const fetchReseña = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/reseñas/curso/${cursoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setReseñaGuardada(data);
          setReseña({ comentario: data.comentario, estrellas: data.estrellas });
        }
      } catch (err) {
        console.error("Error al cargar reseña:", err);
      }
    };

    fetchReseña();
  }, [cursoId, token]);

  const toggleModuloExpansion = (id) => {
    setIdModuloExpandido((prevId) => (prevId === id ? null : id));
  };


  //AGREGUE NUEVO 1.1
  const handleGuardarReseña = async () => {
  try {
    const res = await fetch(`http://localhost:8080/api/resenas/${cursoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        comentario: reseña.comentario,
        estrellas: reseña.estrellas
      }),
    });

    if (res.ok) {
      Swal.fire("Guardado", "Reseña guardada correctamente", "success");
      
      // ✅ Limpiar formulario
      setReseña({ comentario: "", estrellas: 5 });
      
      // ✅ Recargar las reseñas para mostrar la nueva
      fetchTodasLasReseñas();
    } else {
      const error = await res.text();
      Swal.fire("Error", error, "error");
    }
  } catch (error) {
    console.error("Error al guardar reseña:", error);
    Swal.fire("Error", "Error de conexión", "error");
  }
};

  // AGREGUE 1.2
  const [todasLasReseñas, setTodasLasReseñas] = useState([]);

  const fetchTodasLasReseñas = async () => {
    try {
    // ✅ CAMBIAR ESTA URL:
    const res = await fetch(`http://localhost:8080/api/resenas/curso/${cursoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setTodasLasReseñas(data); // Ya no necesitas filtrar
    }
  } catch (err) {
    console.error("Error al cargar reseñas:", err);
  }
  };


const handleEliminarReseña = async () => {
  const confirm = await Swal.fire({
    title: "¿Eliminar reseña?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
  });

  if (confirm.isConfirmed && reseñaGuardada) {
    const res = await fetch(`http://localhost:8080/api/reseñas/${reseñaGuardada.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setReseñaGuardada(null);
      setReseña({ comentario: "", estrellas: 5 });
      Swal.fire("Eliminado", "Reseña eliminada", "success");
    }
  }
};

  const handleNuevoModulo = async () => {
    if (!cursoId || isNaN(Number(cursoId))) {
      Swal.fire("Error", "ID de curso no válido", "error");
      return;
    }
    const response = await fetch(`http://localhost:8080/api/modulos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...nuevoModulo,
        cursoId: Number(cursoId),
      }),
    });

    if (response.ok) {
      await fetchModulos();
      setNuevoModulo({ titulo: "", descripcion: "" });
      await Swal.fire("Éxito", "Módulo creado correctamente", "success");
      setShowNuevoModulo(false);
    } else {
      const error = await response.text();
      Swal.fire("Error", error, "error");
    }
  };

  const handleNuevoContenido = async () => {
    const response = await fetch(`http://localhost:8080/api/contenidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...nuevoContenido,
        moduloId: moduloSeleccionado,
      }),
    });

    if (response.ok) {
      await fetchModulos();
      setNuevoContenido({ titulo: "", tipo: "pdf", url: "" });
      await Swal.fire("Éxito", "Contenido agregado", "success");
      setShowNuevoContenido(false);
    } else {
      const error = await response.text();
      Swal.fire("Error", error, "error");
    }
  };

  const handleEliminarModulo = async (moduloId) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el módulo y sus contenidos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`http://localhost:8080/api/modulos/${moduloId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        Swal.fire("Eliminado", "Módulo eliminado", "success");
        fetchModulos();
      }
    }
  };

  const handleEliminarContenido = async (contenidoId) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar contenido?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });

    if (confirm.isConfirmed) {
      const res = await fetch(
        `http://localhost:8080/api/contenidos/${contenidoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        Swal.fire("Eliminado", "Contenido eliminado", "success");
        fetchModulos();
      }
    }
  };

  const handleEditarModulo = (modulo) => {
    setNuevoModulo({
      titulo: modulo.titulo,
      descripcion: modulo.descripcion,
    });
    setModuloIdEditando(modulo.id);
    setModoEdicionModulo(true);
    setShowNuevoModulo(true);
  };

  const handleActualizarModulo = async () => {
    const response = await fetch(
      `http://localhost:8080/api/modulos/${moduloIdEditando}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...nuevoModulo,
          id: moduloIdEditando,
          cursoId: Number(cursoId),
        }),
      }
    );

    if (response.ok) {
      await fetchModulos();
      setNuevoModulo({ titulo: "", descripcion: "" });
      setModoEdicionModulo(false);
      await Swal.fire("Éxito", "Módulo actualizado correctamente", "success");
      setShowNuevoModulo(false);
    } else {
      const error = await response.text();
      Swal.fire("Error", error, "error");
    }
  };

  const handleEditarContenido = (contenido) => {
    setNuevoContenido({
      titulo: contenido.titulo,
      tipo: contenido.tipo,
      url: contenido.url,
    });
    setContenidoIdEditando(contenido.id);
    setModuloSeleccionado(contenido.moduloId || contenido.modulo?.id);
    setModoEdicionContenido(true);
    setShowNuevoContenido(true);
  };

  const handleActualizarContenido = async () => {
    const response = await fetch(
      `http://localhost:8080/api/contenidos/${contenidoIdEditando}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...nuevoContenido,
          id: contenidoIdEditando,
          moduloId: moduloSeleccionado,
        }),
      }
    );

    if (response.ok) {
      await fetchModulos();
      setNuevoContenido({ titulo: "", tipo: "pdf", url: "" });
      setModoEdicionContenido(false);
      await Swal.fire("Éxito", "Contenido actualizado correctamente", "success");
      setShowNuevoContenido(false);
    } else {
      const error = await response.text();
      Swal.fire("Error", error, "error");
    }
  };

  const toggleDisponibilidad = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/cursos/${cursoId}/disponibilidad?disponible=${!disponibleParaCompra}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        setDisponibleParaCompra(!disponibleParaCompra);
        Swal.fire(
          "Actualizado",
          `Curso ahora está ${
            !disponibleParaCompra ? "disponible" : "no disponible"
          } para compra`,
          "success"
        );
      } else {
        const error = await res.text();
        Swal.fire("Error", error, "error");
      }
    } catch (err) {
      console.error("Error actualizando disponibilidad:", err);
    }
  };

  return (
    <>
      <VProfesorNavbar
        isNavExpanded={isNavExpanded}
        toggleNav={handleToggleNav}
        handleLogout={handleLogout}
        rol={rol}
      />
      <div className={`container ${styles["main-content-wrapper"]} mt-4`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Módulos del Curso</h2>
        </div>

        {esDocenteOAdmin && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button
              className={`${styles.btn} ${styles["btn-primary"]}`}
              onClick={() => {
                setModoEdicionModulo(false);
                setNuevoModulo({ titulo: "", descripcion: "" });
                setShowNuevoModulo(true);
              }}
            >
              + Nuevo Módulo
            </Button>

            <Button
              className={`${styles.btn} ${
                disponibleParaCompra
                  ? styles["btn-success"]
                  : styles["btn-danger"]
              }`}
              onClick={toggleDisponibilidad}
            >
              {disponibleParaCompra ? <FaCheckCircle /> : <FaTimesCircle />}
              {disponibleParaCompra
                ? " Disponible para compra"
                : " No disponible"}
            </Button>
          </div>
        )}

        {loading ? (
          <Spinner animation="border" className={styles.spinnerBorder || ""} />
        ) : modulos.length === 0 ? (
          <p>No hay módulos aún.</p>
        ) : (
          modulos.map((modulo) => (
            <Card key={modulo.id} className={`${styles.card} mb-3`}>
              <Card.Header
                className={`${styles["card-header"]} ${
                  idModuloExpandido === modulo.id
                    ? styles["header-expanded"]
                    : ""
                }`}
                onClick={() => toggleModuloExpansion(modulo.id)}
              >
                <div className={styles["header-content"]}>
                  <span
                    className={`${styles["arrow-icon"]} ${
                      idModuloExpandido === modulo.id
                        ? styles["arrow-rotated"]
                        : ""
                    }`}
                  >
                    &#9658;
                  </span>
                  <span className={styles["module-title"]}>
                    {modulo.titulo}
                  </span>
                </div>
              </Card.Header>

              <Collapse in={idModuloExpandido === modulo.id}>
                <div>
                  <Card.Body className={styles["card-body"]}>
                    <p>{modulo.descripcion}</p>
                    <h6>Contenidos:</h6>
                    {modulo.contenidos.length > 0 ? (
                      <ul className={styles.list}>
                        {modulo.contenidos.map((cont) => (
                          <li key={cont.id} className={styles["list-item"]}>
                            <div className={styles["content-info"]}>
                              <strong>{cont.tipo.toUpperCase()}</strong>:{" "}
                              <a
                                href={cont.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {cont.titulo}
                              </a>
                            </div>

                            {esDocenteOAdmin && (
                              <div className={styles["content-actions"]}>
                                <Button
                                  size="sm"
                                  className={`${styles.btn} ${styles["btn-warning"]} ms-2`}
                                  onClick={() => handleEditarContenido(cont)}
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  className={`${styles.btn} ${styles["btn-danger"]} ms-2`}
                                  onClick={() =>
                                    handleEliminarContenido(cont.id)
                                  }
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay contenidos.</p>
                    )}

                    {esDocenteOAdmin && (
                      <>
                        <Button
                          size="sm"
                          className={`${styles.btn} ${styles["btn-primary"]} me-2`}
                          onClick={() => {
                            setModuloSeleccionado(modulo.id);
                            setModoEdicionContenido(false);
                            setNuevoContenido({
                              titulo: "",
                              tipo: "pdf",
                              url: "",
                            });
                            setShowNuevoContenido(true);
                          }}
                        >
                          + Agregar Contenido
                        </Button>

                        <Button
                          size="sm"
                          className={`${styles.btn} ${styles["btn-warning"]} me-2`}
                          onClick={() => handleEditarModulo(modulo)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          className={`${styles.btn} ${styles["btn-danger"]}`}
                          onClick={() => handleEliminarModulo(modulo.id)}
                        >
                          Eliminar
                        </Button>
                      </>
                    )}
                  </Card.Body>
                </div>
              </Collapse>
            </Card>
          ))
        )}

        {/* Modal: nuevo/editar módulo */}
        <Modal
          show={showNuevoModulo}
          onHide={() => setShowNuevoModulo(false)}
          centered
        >
          <Modal.Header closeButton className={styles.customModalHeader}>
            <Modal.Title className={styles.customModalTitle}>
              {modoEdicionModulo ? "Editar Módulo" : "Nuevo Módulo"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  value={nuevoModulo.titulo}
                  onChange={(e) =>
                    setNuevoModulo({ ...nuevoModulo, titulo: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  value={nuevoModulo.descripcion}
                  onChange={(e) =>
                    setNuevoModulo({
                      ...nuevoModulo,
                      descripcion: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className={styles.customModalFooter}>
            <Button
              onClick={
                modoEdicionModulo ? handleActualizarModulo : handleNuevoModulo
              }
              className={`${styles.btn} ${styles["btn-primary"]}`}
            >
              {modoEdicionModulo ? "Actualizar" : "Guardar"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal: nuevo/editar contenido */}
        <Modal
          show={showNuevoContenido}
          onHide={() => setShowNuevoContenido(false)}
          centered
        >
          <Modal.Header closeButton className={styles.customModalHeader}>
            <Modal.Title className={styles.customModalTitle}>
              {modoEdicionContenido ? "Editar Contenido" : "Nuevo Contenido"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  value={nuevoContenido.titulo}
                  onChange={(e) =>
                    setNuevoContenido({
                      ...nuevoContenido,
                      titulo: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Select
                  value={nuevoContenido.tipo}
                  onChange={(e) =>
                    setNuevoContenido({
                      ...nuevoContenido,
                      tipo: e.target.value,
                    })
                  }
                >
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="enlace">Enlace</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>URL</Form.Label>
                <Form.Control
                  value={nuevoContenido.url}
                  onChange={(e) =>
                    setNuevoContenido({
                      ...nuevoContenido,
                      url: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className={styles.customModalFooter}>
            <Button
              onClick={
                modoEdicionContenido
                  ? handleActualizarContenido
                  : handleNuevoContenido
              }
              className={`${styles.btn} ${styles["btn-primary"]}`}
            >
              {modoEdicionContenido ? "Actualizar" : "Agregar"}
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* AGREGUE NUEVO RESEÑA */}
        <div className={`${styles.reseñaContainer || 'reseña-container'} mt-4`}>
          <h4 className={styles.tituloReseña || ''}>Tu Reseña</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className={styles.labelReseña || ''}>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reseña.comentario}
                onChange={(e) =>
                  setReseña({ ...reseña, comentario: e.target.value })
                }
                style={{ backgroundColor: '#ffffff', color: '#495057' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className={styles.labelReseña || ''}>Estrellas</Form.Label>
              <Form.Select
                value={reseña.estrellas}
                onChange={(e) =>
                  setReseña({ ...reseña, estrellas: parseInt(e.target.value) })
                }
                style={{ backgroundColor: '#ffffff', color: '#495057' }}
              >
                {[5, 4, 3, 2, 1].map((val) => (
                  <option key={val} value={val}>
                    {val} ⭐
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="reseña-btns">
              <Button
                variant="primary"
                onClick={handleGuardarReseña}
                className={`btn btn-primary ${styles.btn || ''}`}
              >
                {reseñaGuardada ? "Actualizar" : "Guardar"}
              </Button>
              {reseñaGuardada && (
                <Button
                  variant="danger"
                  onClick={handleEliminarReseña}
                  className={`btn btn-danger ms-2 ${styles.btn || ''}`}
                >
                  Eliminar
                </Button>
              )}
            </div>
          </Form>
        </div>

        <div className={`${styles.reseñasExistentes || 'reseñas-existentes'} mt-4`}>
          <h5 className={styles.tituloReseñasExistentes || ''}>Reseñas del curso</h5>
          {todasLasReseñas.length === 0 ? (
            <p style={{ color: '#6c757d' }}>No hay reseñas aún.</p>
          ) : (
            todasLasReseñas.map((resenaItem, index) => (
              <Card key={index} className={`mb-2 ${styles.reseñaCard || ''}`}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className={styles.nombreUsuario || ''}>
                      {resenaItem.usuario?.email || 
                      resenaItem.usuario?.email || 
                      resenaItem.usuarios?.nombre || 
                      resenaItem.usuarios?.email || 
                      'Anónimo'}
                    </strong>
                    <span style={{ color: '#ffc107' }}>
                      {'⭐'.repeat(resenaItem.estrellas)}
                    </span>
                  </div>
                  <p className={`${styles.textoComentario || ''} mt-2`}>
                    {resenaItem.comentario}
                  </p>
                  <small className={`${styles.fechaReseña || ''} text-muted`}>
                  </small>
                </Card.Body>
              </Card>
            ))
          )}
        </div>

      </div>
    </>
  );
}