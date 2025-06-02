// src/components/FeaturedCourses.jsx
import React, { useState, useRef, useEffect } from 'react'; // <--- ¡IMPORTANTE: Añadir useRef y useEffect!
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHeart, FaSearch } from 'react-icons/fa';
import './FeaturedCourses.css';

// Importa tus imágenes aquí (rutas relativas desde src/components/)
import fullstackMainImage from '../assets/image Desarrollo Web Fullstack.png';
import fullstackHoverImage from '../assets/image Desarrollo Web Fullstack.png'; // Revisa esta ruta, parece que tiene un error de tipografía (.png.stack)
import marketingMainImage from '../assets/2marke.webp';
import marketingHoverImage from '../assets/2marke.webp';
import PythonMainImage from '../assets/python.png';
import PythonHoverImage from '../assets/python.png';
import UIMainImage from '../assets/ui.png';
import UIHoverImage from '../assets/ui.png';

export default function FeaturedCourses() {
  // <--- ¡Añadir Ref y Estado para la animación de la sección!
  const featuredCoursesRef = useRef(null);
  const [isSectionInView, setIsSectionInView] = useState(false);

  // <--- ¡Añadir useEffect para el IntersectionObserver!
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2, // Ajusta este valor (0.1-0.5) según qué tan pronto quieres que se active la animación.
      }
    );

    if (featuredCoursesRef.current) {
      observer.observe(featuredCoursesRef.current);
    }

    return () => {
      if (featuredCoursesRef.current) {
        observer.unobserve(featuredCoursesRef.current);
      }
    };
  }, []); // El array vacío asegura que esto se ejecuta solo una vez al montar


  const courses = [
    {
      id: 1,
      title: "Desarrollo Web Fullstack",
      description: "Aprende a construir aplicaciones web completas con HTML, CSS, JavaScript y más. Domina el frontend y el backend para crear aplicaciones robustas.",
      image: fullstackMainImage,
      hoverImage: fullstackHoverImage,
      price: "S/. 49.99",
      rating: 4.5,
      tag: "NUEVO" // Añadimos una propiedad 'tag'
    },
    {
      id: 2,
      title: "Marketing Digital Avanzado",
      description: "Domina las herramientas y estrategias del marketing online para potenciar tu marca personal o negocio, desde SEO hasta publicidad.",
      image: marketingMainImage,
      hoverImage: marketingHoverImage,
      price: "S/. 59.99",
      rating: 5,
      tag: "OFERTA" // Añadimos una propiedad 'tag'
    },
    {
      id: 3,
      title: "Data Science con Python",
      description: "Analiza datos como un profesional utilizando Python, Pandas y machine learning. Descubre patrones y toma decisiones basadas en datos.",
      image: PythonMainImage,
      hoverImage: PythonHoverImage,
      price: "S/. 69.99",
      rating: 4,
    },
    {
      id: 4,
      title: "Diseño UX/UI para Principiantes",
      description: "Crea experiencias de usuario intuitivas y atractivas. Aprende a diseñar interfaces que la gente ame.",
      image: UIMainImage,
      hoverImage: UIHoverImage,
      price: "S/. 39.99",
      rating: 4.5,
    },

  ];

  // Función para renderizar estrellas de rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star filled">&#9733;</span>);
    }
    if (halfStar) {
      stars.push(<span key="half" className="star half-filled">&#9733;</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">&#9734;</span>);
    }
    return stars;
  };


  return (
    // <--- ¡Aplicar REF y CLASE CONDICIONAL para activar animaciones!
    <section
      className={`featured-courses-section ${isSectionInView ? 'in-view' : ''}`}
      ref={featuredCoursesRef}
    >
      <div className="container featured-courses-container">
        {/* <--- ¡ENVOLVER TÍTULO Y SUBTÍTULO en el div de animación! */}
        <div className="section-header-animated">
          <h2 className="section-title">- Nuestros Cursos Destacados -</h2>
          <p className="section-subtitle">Explora los programas más populares y mejor valorados por nuestros estudiantes.</p>
        </div>
        {/* --- Fin del wrapper de encabezado --- */}

        <div className="row justify-content-center">
          {courses.map((course, index) => ( // Añadir 'index' para el delay
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={course.id}>
              {/* <--- ¡Aplicar la clase animated-card y el delay! */}
              <div
                className={`course-card animated-card ${isSectionInView ? 'in-view' : ''}`}
                style={{ animationDelay: `${0.3 + index * 0.15}s` }} // Delay escalonado
              >
                <div className="card-image-wrapper">
                  <img src={course.image} className="card-image main-image" alt={course.title} />
                  <img src={course.hoverImage} className="card-image hover-image" alt={`${course.title} (hover)`} />
                  <div className="image-overlay">
                    <button className="icon-button zoom-button" title="Ver Detalles">
                      <FaSearch />
                    </button>
                    <button className="icon-button heart-button" title="Añadir a Favoritos">
                      <FaHeart />
                    </button>
                  </div>
   
                </div>
                <div className="card-info">
                  <h5 className="course-title">{course.title}</h5>
                  <p className="course-description">{course.description}</p>
                  <div className="course-rating">
                    {renderStars(course.rating)}
                  </div>
                  <div className="card-footer-flex">
                    <span className="course-price">{course.price}</span>
                    <button className="join-button">UNIRME</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}