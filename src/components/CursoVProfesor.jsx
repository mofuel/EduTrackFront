// src/components/CursoVProfesor.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBell, FaBars, FaSignOutAlt, FaPlusCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Collapse } from 'react-bootstrap';
import './CursoVProfesor.css'; // Asegúrate de que este CSS esté actualizado

// Importar la imagen de Python
import CpythonImage from '../assets/Cpython.webp'; // Asegúrate de que la ruta sea correcta
// Importar el logo de EduTrack
import EduTrackLogo from '../assets/logo.png'; // <--- Nueva importación para el logo

export default function CursoVProfesor() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(true);

  const user = {
    nombres: 'Profesor',
    apellidos: 'Ejemplo',
    rol: 'Docente',
    email: 'profesor@ejemplo.com'
  };

  const coursePython = {
    id: 'C001',
    title: 'Introducción a la Programación con Python',
    description: 'Aprende los fundamentos de Python, desde variables y estructuras de control hasta programación orientada a objetos, ideal para principiantes.',
    imageUrl: CpythonImage,
    studentsEnrolled: 150,
    lessons: 25,
    duration: '10 horas'
  };

  const notifications = []; // Array vacío para simular que no hay notificaciones
  // const notifications = [
  //   { id: 1, message: 'Nuevo alumno inscrito en Python.', time: 'Hace 5 min' },
  //   { id: 2, message: 'Reseña dejada en tu curso de React.', time: 'Hace 1 hora' },
  //   { id: 3, message: 'Se ha cargado el material de la lección 5.', time: 'Ayer' },
  // ];

  const handleLogout = () => {
    console.log("Cerrar sesión (simulado)");
  };

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileNavOpen) {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileNavOpen]);


  return (
    <div className="profesor-curso-layout-modern">
      {/* Navbar Superior del Profesor con diseño moderno */}
      <nav className="profesor-navbar-modern">
        {/* Modificación aquí para incluir la imagen del logo */}
        <div className="navbar-brand-modern">
          <Link to="/Inicio">
            <img src={EduTrackLogo} alt="EduTrack Logo" className="navbar-logo-image" /> {/* <--- Aquí se añade el logo */}
            EduTrack
          </Link>
        </div>
        {/* Fin de la modificación */}

        <div className="navbar-toggle-modern" onClick={handleMobileNavToggle}>
          <FaBars />
        </div>
        <ul className={`navbar-links-modern ${isMobileNavOpen ? 'open' : ''}`}>
          <li><Link to="#" onClick={() => setIsMobileNavOpen(false)}>Inicio</Link></li>
          <li><Link to="#" onClick={() => setIsMobileNavOpen(false)}>Mis Cursos</Link></li>
          <li><Link to="#" onClick={() => setIsMobileNavOpen(false)}>Mis Alumnos</Link></li>
          <li><Link to="#" onClick={() => setIsMobileNavOpen(false)}>Mensajes</Link></li>
          <li><Link to="#" onClick={() => setIsMobileNavOpen(false)}>Mi Perfil</Link></li>
        </ul>
        <div className="navbar-user-section-modern">
          <FaBell className="navbar-icon-modern" />
          <div className="user-profile-nav-modern">
            <span>{user.nombres}</span>
            <FaUserCircle className="user-avatar-nav-modern" />
          </div>
          <Button variant="outline-light" className="logout-btn-modern" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Salir
          </Button>
        </div>
      </nav>

      {/* Contenido Principal con diseño moderno */}
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
                <Col md={6} lg={6} xl={4} className="mb-4">
                  <Card className="course-card-modern">
                    <Card.Img variant="top" src={coursePython.imageUrl} alt={coursePython.title} className="course-image-modern" />
                    <Card.Body className="d-flex flex-column justify-content-between h-100">
                      <div>
                        <Card.Title className="course-title-modern">{coursePython.title}</Card.Title>
                        <Card.Text className="course-description-modern">{coursePython.description}</Card.Text>
                        <div className="course-meta-modern">
                          <span>Alumnos: {coursePython.studentsEnrolled}</span>
                          <span>Lecciones: {coursePython.lessons}</span>
                          <span>Duración: {coursePython.duration}</span>
                        </div>
                      </div>
                      <Button variant="primary" className="view-details-btn-modern mt-3">
                        Ver Detalles del Curso
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} lg={6} xl={4} className="mb-4">
                  <Card className="add-course-card-modern h-100 d-flex align-items-center justify-content-center">
                    <Link to="#" className="text-center text-decoration-none add-course-link-modern">
                      <FaPlusCircle className="add-icon-modern mb-2" />
                      <h3>Crear Nuevo Curso</h3>
                      <p className="text-muted">Comienza a compartir tu conocimiento.</p>
                    </Link>
                  </Card>
                </Col>
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
                          No hay notificaciones recientes. <br/> ¡Todo al día!
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