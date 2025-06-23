// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes de la página principal
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import FeaturedCourses from './components/FeaturedCourses';
import BenefitCardsSlider from './components/BenefitCardsSlider';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

// Componentes de autenticación
import Login from './components/Login';
import Register from './components/Register';

// NUEVO: Importa el componente para cambiar contraseña
import ChangePassword from './components/ChangePassword';

// Componentes del Dashboard (ahora se importan directamente aquí)
import TeacherDashboard from './components/TeacherDashboard'; // Tu dashboard principal
import UserManagement from './components/UserManagement';       // El nuevo componente de usuarios

// --- NUEVA IMPORTACIÓN PARA LA VISTA DE CURSOS DEL PROFESOR ---
import CursoVProfesor from './components/CursoVProfesor';

import ModulosCurso from './components/ModulosCurso';
import CatalogoCursos from './components/CatalogoCursos';
import CursoDetalle from './components/CursoDetalle';
import Carrito from './components/Carrito';




// Estilos globales y de librerías
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// ==========================================================
// COMPONENTE PARA LA PÁGINA PRINCIPAL COMPLETA
// Esto agrupa todas las secciones de tu landing page
function HomePage() {
  useEffect(() => {
    // Estas lógicas de scroll-to-top son más adecuadas aquí,
    // para que solo afecten cuando se renderiza la HomePage
    window.scrollTo(0, 0);
    console.log("Intento 1: window.scrollTo(0, 0) ejecutado.");

    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      console.log("Intento 2: window.scrollTo(0, 0) con 100ms de retraso.");
    }, 100);

    const animationFrameId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      console.log("Intento 3: window.scrollTo(0, 0) con requestAnimationFrame.");
    });

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Se ejecuta solo una vez al montar la HomePage

  return (
    <>
      <Navbar />
      <Carousel />
      <BenefitCardsSlider />
      <FeaturedCourses />
      <Testimonials />
      {/* Esta es la línea separadora que va antes del footer, si la quieres global */}
      <div className="global-page-divider"></div>
      <Footer />
    </>
  );
}

// ==========================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN CON RUTAS
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página principal (Home Page) */}
        {/* Cuando la URL es "/", se renderiza todo el componente HomePage */}
        <Route path="/" element={<HomePage />} />

        {/* Ruta para la página de Login */}
        {/* Cuando la URL es "/login", solo se renderiza el componente Login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas COMPLETAS E INDEPENDIENTES del Dashboard */}
        <Route path="/dashboard-profesor" element={<TeacherDashboard />} />
        <Route path="/usuarios" element={<UserManagement />} />
        

        {/* --- NUEVA RUTA PARA LA VISTA DE CURSOS DEL PROFESOR --- */}
        <Route path="/profesor/vista-cursos" element={<CursoVProfesor />} />

        <Route path="/modulos-curso/:cursoId" element={<ModulosCurso />} />
        <Route path="/catalogo" element={<CatalogoCursos />} />
        <Route path="/catalogo/curso/:id" element={<CursoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />

        {/* Ruta para la página de Register */}
        {/* Cuando la URL es "/register", solo se renderiza el componente Register */}
        <Route path="/register" element={<Register />} />

        {/* NUEVO: Ruta para la página de Cambiar Contraseña */}
        <Route path="/changepassword" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;