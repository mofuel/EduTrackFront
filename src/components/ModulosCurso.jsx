import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Collapse, Modal, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

export default function ModulosCurso() {
  const { cursoId } = useParams();
  const [modulos, setModulos] = useState([]);
  const [moduloExpandido, setModuloExpandido] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showNuevoModulo, setShowNuevoModulo] = useState(false);
  const [nuevoModulo, setNuevoModulo] = useState({ titulo: '', descripcion: '' });

  const [showNuevoContenido, setShowNuevoContenido] = useState(false);
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
  const [nuevoContenido, setNuevoContenido] = useState({ titulo: '', tipo: 'pdf', url: '' });

  const token = localStorage.getItem("jwt");

  const [modoEdicionModulo, setModoEdicionModulo] = useState(false);
  const [modoEdicionContenido, setModoEdicionContenido] = useState(false);
  const [moduloIdEditando, setModuloIdEditando] = useState(null);
  const [contenidoIdEditando, setContenidoIdEditando] = useState(null);
  const [disponibleParaCompra, setDisponibleParaCompra] = useState(false);
  const [rol, setRol] = useState(null);


  const fetchModulos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/modulos/curso/${cursoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setModulos(data); // Aquí ya vienen los contenidos dentro de cada módulo
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
        console.log("Token decodificado:", decoded);
        setRol(decoded.rol || decoded.role || "");
      } catch (error) {
        console.error("Token inválido", error);
      }
    }
  }, [token]);
  const esDocenteOAdmin = rol === "ROLE_docente" || rol === "ROLE_admin";

  useEffect(() => {
    fetchModulos();

    // Obtener estado del curso (disponibilidad)
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
  }, [cursoId]);

  const toggleModulo = (id) => {
    setModuloExpandido(prev => (prev === id ? null : id));
  };

  const handleNuevoModulo = async () => {
    if (!cursoId || isNaN(Number(cursoId))) {
      Swal.fire("Error", "ID de curso no válido", "error");
      return;
    }

    const response = await fetch(`http://localhost:8080/api/modulos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...nuevoModulo,
        cursoId: Number(cursoId)
      })
    });

    if (response.ok) {
      await fetchModulos();
      setShowNuevoModulo(false);
      setNuevoModulo({ titulo: '', descripcion: '' });
      Swal.fire('Éxito', 'Módulo creado correctamente', 'success');
    } else {
      const error = await response.text();
      Swal.fire('Error', error, 'error');
    }
  };


  const handleNuevoContenido = async () => {
    const response = await fetch(`http://localhost:8080/api/contenidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...nuevoContenido,
        moduloId: moduloSeleccionado
      })
    });

    if (response.ok) {
      await fetchModulos(); // Recargar para mostrar nuevo contenido
      setShowNuevoContenido(false);
      setNuevoContenido({ titulo: '', tipo: 'pdf', url: '' });
      Swal.fire('Éxito', 'Contenido agregado', 'success');
    } else {
      const error = await response.text();
      Swal.fire('Error', error, 'error');
    }
  };

  const handleEliminarModulo = async (moduloId) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el módulo y sus contenidos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`http://localhost:8080/api/modulos/${moduloId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        Swal.fire('Eliminado', 'Módulo eliminado', 'success');
        fetchModulos();
      }
    }
  };

  const handleEliminarContenido = async (contenidoId) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar contenido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí'
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`http://localhost:8080/api/contenidos/${contenidoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        Swal.fire('Eliminado', 'Contenido eliminado', 'success');
        fetchModulos();
      }
    }
  };

  const handleEditarModulo = (modulo) => {
    setNuevoModulo({
      titulo: modulo.titulo,
      descripcion: modulo.descripcion
    });
    setModuloIdEditando(modulo.id);
    setModoEdicionModulo(true);
    setShowNuevoModulo(true);
  };


  const handleActualizarModulo = async () => {
    const response = await fetch(`http://localhost:8080/api/modulos/${moduloIdEditando}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...nuevoModulo,
        id: moduloIdEditando,
        cursoId: Number(cursoId)
      })
    });

    if (response.ok) {
      await fetchModulos();
      setShowNuevoModulo(false);
      setNuevoModulo({ titulo: '', descripcion: '' });
      setModoEdicionModulo(false);
      Swal.fire('Éxito', 'Módulo actualizado correctamente', 'success');
    } else {
      const error = await response.text();
      Swal.fire('Error', error, 'error');
    }
  };

  const handleEditarContenido = (contenido) => {
    setNuevoContenido({
      titulo: contenido.titulo,
      tipo: contenido.tipo,
      url: contenido.url
    });
    setContenidoIdEditando(contenido.id);
    setModuloSeleccionado(contenido.moduloId || contenido.modulo?.id); // soporte para ambas formas
    setModoEdicionContenido(true);
    setShowNuevoContenido(true);
  };

  const handleActualizarContenido = async () => {
    const response = await fetch(`http://localhost:8080/api/contenidos/${contenidoIdEditando}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...nuevoContenido,
        id: contenidoIdEditando,
        moduloId: moduloSeleccionado
      })
    });

    if (response.ok) {
      await fetchModulos();
      setShowNuevoContenido(false);
      setNuevoContenido({ titulo: '', tipo: 'pdf', url: '' });
      setModoEdicionContenido(false);
      Swal.fire('Éxito', 'Contenido actualizado correctamente', 'success');
    } else {
      const error = await response.text();
      Swal.fire('Error', error, 'error');
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
          `Curso ahora está ${!disponibleParaCompra ? "disponible" : "no disponible"} para compra`,
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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Módulos del Curso</h2>
      </div>

      {esDocenteOAdmin && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            onClick={() => {
              setModoEdicionModulo(false);
              setNuevoModulo({ titulo: '', descripcion: '' });
              setShowNuevoModulo(true);
            }}
          >
            + Nuevo Módulo
          </Button>

          <Button
            variant={disponibleParaCompra ? "success" : "secondary"}
            onClick={toggleDisponibilidad}
          >
            {disponibleParaCompra ? "✅ Disponible para compra" : "❌ No disponible"}
          </Button>
        </div>
      )}

      {loading ? (
        <Spinner animation="border" />
      ) : modulos.length === 0 ? (
        <p>No hay módulos aún.</p>
      ) : (
        modulos.map(modulo => (
          <Card key={modulo.id} className="mb-3">
            <Card.Header onClick={() => toggleModulo(modulo.id)} style={{ cursor: 'pointer' }}>
              <h5>{modulo.titulo}</h5>
            </Card.Header>
            <Collapse in={moduloExpandido === modulo.id}>
              <div>
                <Card.Body>
                  <p>{modulo.descripcion}</p>
                  <h6>Contenidos:</h6>
                  {modulo.contenidos.length > 0 ? (
                    <ul>
                      {modulo.contenidos.map(cont => (
                        <li key={cont.id}>
                          <strong>{cont.tipo.toUpperCase()}</strong>:{" "}
                          <a href={cont.url} target="_blank" rel="noopener noreferrer">{cont.titulo}</a>

                          {/* 👇 Solo docentes/admin pueden ver estos botones */}
                          {esDocenteOAdmin && (
                            <>
                              <Button
                                variant="warning"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleEditarContenido(cont, modulo.id)}
                              >
                                ✏️
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleEliminarContenido(cont.id)}
                              >
                                🗑️
                              </Button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>

                  ) : (
                    <p>No hay contenidos.</p>
                  )}

                  {esDocenteOAdmin && (
                    <>
                      <Button size="sm" className="me-2" onClick={() => {
                        setModuloSeleccionado(modulo.id);
                        setModoEdicionContenido(false);
                        setNuevoContenido({ titulo: '', tipo: 'pdf', url: '' });
                        setShowNuevoContenido(true);
                      }}>
                        + Agregar Contenido
                      </Button>

                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditarModulo(modulo)}>Editar</Button>
                      <Button variant="danger" size="sm" onClick={() => handleEliminarModulo(modulo.id)}>Eliminar</Button>
                    </>
                  )}

                </Card.Body>
              </div>
            </Collapse>
          </Card>
        ))
      )}

      {/* Modal: nuevo módulo */}
      <Modal show={showNuevoModulo} onHide={() => setShowNuevoModulo(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicionModulo ? "Editar Módulo" : "Nuevo Módulo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control
                value={nuevoModulo.titulo}
                onChange={e => setNuevoModulo({ ...nuevoModulo, titulo: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                value={nuevoModulo.descripcion}
                onChange={e => setNuevoModulo({ ...nuevoModulo, descripcion: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={modoEdicionModulo ? handleActualizarModulo : handleNuevoModulo}>
            {modoEdicionModulo ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: nuevo contenido */}
      <Modal show={showNuevoContenido} onHide={() => setShowNuevoContenido(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicionContenido ? "Editar Contenido" : "Nuevo Contenido"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control
                value={nuevoContenido.titulo}
                onChange={e => setNuevoContenido({ ...nuevoContenido, titulo: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={nuevoContenido.tipo}
                onChange={e => setNuevoContenido({ ...nuevoContenido, tipo: e.target.value })}
              >
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="enlace">Enlace</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>URL</Form.Label>
              <Form.Control
                value={nuevoContenido.url}
                onChange={e => setNuevoContenido({ ...nuevoContenido, url: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={modoEdicionContenido ? handleActualizarContenido : handleNuevoContenido}>
            {modoEdicionContenido ? "Actualizar" : "Agregar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
