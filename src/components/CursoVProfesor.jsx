import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBell, FaBars, FaSignOutAlt, FaPlusCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Collapse, Modal, Form } from 'react-bootstrap';
import './CursoVProfesor.css';
import DashboardNavbar from './DashboardNavbar';
import CpythonImage from '../assets/Cpython.webp';
import EduTrackLogo from '../assets/logo.png';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



export default function CursoVProfesor() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [cursoEditando, setCursoEditando] = useState(null);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [disponibleParaCompra, setDisponibleParaCompra] = useState(false);


  const navigate = useNavigate();


  const [nuevoCurso, setNuevoCurso] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    objetivos: '',
    incluye: '',
    requisitos: '',
    imagen: '',
    disponibleParaCompra: false
  });

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const decoded = jwtDecode(token);
    const docenteId = decoded.userId; // El campo depende de cómo esté tu JWT, podría ser decoded.id también

    fetch(`http://localhost:8080/api/cursos/docente/${docenteId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setCursos(data))
      .catch(error => console.error('Error al cargar cursos:', error));
  }, []);

  const handleLogout = () => {
    console.log("Cerrar sesión (simulado)");
  };

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoCurso(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitCurso = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/cursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(nuevoCurso),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setCursos(prev => [...prev, data]);
      Swal.fire('Curso creado', 'El curso se creó correctamente', 'success');
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar curso:', error.message);
      Swal.fire('Error', 'No se pudo guardar el curso', 'error');
    }
  };

  const handleEliminarCurso = async (id) => {
    const confirmar = await Swal.fire({
      title: '¿Eliminar curso?',
      text: 'Esta acción marcará el curso como inactivo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmar.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:8080/api/cursos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      });

      if (response.ok) {
        setCursos(prev => prev.filter(c => c.id !== id));
        Swal.fire('Eliminado', 'El curso fue marcado como inactivo.', 'success');
      } else {
        const errText = await response.text();
        throw new Error(errText);
      }
    } catch (err) {
      console.error("Error al eliminar curso:", err);
      Swal.fire('Error', 'No se pudo eliminar el curso.', 'error');
    }
  };

  const handleEditarCurso = (curso) => {
    setCursoEditando(curso);
    setShowEditarModal(true);
  };

  const handleActualizarCurso = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/cursos/${cursoEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(cursoEditando)
      });

      if (!response.ok) throw new Error(await response.text());

      const actualizado = await response.json();
      setCursos(prev => prev.map(c => c.id === actualizado.id ? actualizado : c));
      Swal.fire('Actualizado', 'El curso fue actualizado exitosamente', 'success');
      setShowEditarModal(false);
    } catch (err) {
      console.error("Error actualizando curso:", err);
      Swal.fire('Error', 'No se pudo actualizar el curso', 'error');
    }
  };




  const notifications = [];

  return (
    <div className="profesor-curso-layout-modern">
      <DashboardNavbar />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitCurso}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Curso</Form.Label>
              <Form.Control name="nombre" value={nuevoCurso.nombre} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" name="descripcion" value={nuevoCurso.descripcion} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name="precio" value={nuevoCurso.precio} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lo que aprenderás</Form.Label>
              <Form.Control
                as="textarea"
                name="objetivos"
                value={nuevoCurso.objetivos}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Este curso incluye</Form.Label>
              <Form.Control
                as="textarea"
                name="incluye"
                value={nuevoCurso.incluye}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Requisitos</Form.Label>
              <Form.Control
                as="textarea"
                name="requisitos"
                value={nuevoCurso.requisitos}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control
                type="url"
                name="imagen"
                value={nuevoCurso.imagen}
                onChange={handleInputChange}
                placeholder="https://..."
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">Guardar Curso</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditarModal} onHide={() => setShowEditarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cursoEditando && (
            <Form onSubmit={handleActualizarCurso}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="nombre"
                  value={cursoEditando.nombre}
                  onChange={e => setCursoEditando({ ...cursoEditando, nombre: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  name="descripcion"
                  value={cursoEditando.descripcion}
                  onChange={e => setCursoEditando({ ...cursoEditando, descripcion: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  name="precio"
                  value={cursoEditando.precio}
                  onChange={e => setCursoEditando({ ...cursoEditando, precio: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>URL de la Imagen</Form.Label>
                <Form.Control
                  name="imagen"
                  value={cursoEditando.imagen}
                  onChange={e => setCursoEditando({ ...cursoEditando, imagen: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Lo que aprenderás</Form.Label>
                <Form.Control
                  as="textarea"
                  name="objetivos"
                  value={cursoEditando.objetivos || ''}
                  onChange={e => setCursoEditando({ ...cursoEditando, objetivos: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Incluye</Form.Label>
                <Form.Control
                  as="textarea"
                  name="incluye"
                  value={cursoEditando.incluye || ''}
                  onChange={e => setCursoEditando({ ...cursoEditando, incluye: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Requisitos</Form.Label>
                <Form.Control
                  as="textarea"
                  name="requisitos"
                  value={cursoEditando.requisitos || ''}
                  onChange={e => setCursoEditando({ ...cursoEditando, requisitos: e.target.value })}
                />
              </Form.Group>
              <Button type="submit" variant="primary">Guardar Cambios</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>


      <div className="profesor-main-content-modern">
        <Container fluid className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-0">Mis Cursos</h1>
              <p className="lead text-muted">Listado de Cursos Impartidos</p>
            </div>
          </div>

          <Row>
            <Col lg={8} xl={9} className="mb-4">
              <Row>
                {cursos.length > 0 ? (
                  <>
                    {cursos.map((curso) => (
                      <Col md={6} lg={6} xl={4} className="mb-4" key={curso.id}>
                        <Card className="course-card-modern">
                          <Card.Img
                            variant="top"
                            src={curso.imagen || CpythonImage}
                            className="course-image-modern"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/modulos-curso/${curso.id}`)}
                          />
                          <Card.Body className="d-flex flex-column justify-content-between h-100">
                            <div>
                              <Card.Title className="course-title-modern">{curso.nombre}</Card.Title>
                              <Card.Text className="course-description-modern">{curso.descripcion}</Card.Text>
                              <div className="course-meta-modern">
                                <span>Precio: ${curso.precio}</span>
                              </div>
                            </div>

                            <div>
                              <Button
                                variant="warning"
                                className="mt-3 me-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditarCurso(curso);
                                }}
                              >
                                Editar Curso
                              </Button>

                              <Button
                                variant="danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEliminarCurso(curso.id);
                                }}
                              >
                                Eliminar
                              </Button>

                              <div className="mt-2">
                                <strong>Estado: </strong>
                                <span style={{ color: curso.disponibleParaCompra ? 'green' : 'red' }}>
                                  {curso.disponibleParaCompra ? 'Disponible para compra' : 'No disponible'}
                                </span>
                              </div>
                              
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}


                    <Col md={6} lg={6} xl={4} className="mb-4">
                      <Card className="add-course-card-modern h-100 d-flex align-items-center justify-content-center">
                        <div onClick={handleShowModal} className="text-center text-decoration-none add-course-link-modern" style={{ cursor: 'pointer' }}>
                          <FaPlusCircle className="add-icon-modern mb-2" />
                          <h3>Crear Nuevo Curso</h3>
                          <p className="text-muted">Comienza a compartir tu conocimiento.</p>
                        </div>
                      </Card>
                    </Col>
                  </>
                ) : (
                  <Col md={6} lg={6} xl={4} className="mb-4">
                    <Card className="add-course-card-modern h-100 d-flex align-items-center justify-content-center">
                      <div onClick={handleShowModal} className="text-center text-decoration-none add-course-link-modern" style={{ cursor: 'pointer' }}>
                        <FaPlusCircle className="add-icon-modern mb-2" />
                        <h3>Actualmente no tienes cursos registrados</h3>
                        <p className="text-muted">Haz clic para crear uno.</p>
                      </div>
                    </Card>
                  </Col>
                )}
              </Row>
            </Col>

            <Col lg={4} xl={3} className="mb-4">
              <Card className="notifications-panel-modern">
                <Card.Header
                  onClick={() => setOpenNotifications(!openNotifications)}
                  aria-controls="notifications-collapse-content"
                  aria-expanded={openNotifications}
                  className="notifications-header-toggle"
                >
                  <h3 className="mb-0">Notificaciones y Recordatorios</h3>
                  {openNotifications ? <FaChevronUp className="toggle-icon" /> : <FaChevronDown className="toggle-icon" />}
                </Card.Header>

                <Collapse in={openNotifications}>
                  <div id="notifications-collapse-content">
                    <Card.Body className="notifications-body">
                      {notifications.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {notifications.map((notif) => (
                            <li key={notif.id} className="notification-item py-2 border-bottom">
                              <small className="text-muted float-end">{notif.time}</small>
                              {notif.message}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-center text-muted py-3 mb-0">
                          No hay notificaciones recientes. <br /> ¡Todo al día!
                        </p>
                      )}
                    </Card.Body>
                    {notifications.length > 0 && (
                      <Card.Footer className="text-center notifications-footer">
                        <Link to="#" className="text-decoration-none">Ver todas</Link>
                      </Card.Footer>
                    )}
                  </div>
                </Collapse>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
