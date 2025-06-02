// src/components/Carousel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Carousel as BootstrapCarousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './carousel.css';

import carrusel1 from "../assets/1carrusel.jpg";
import carrusel2 from "../assets/2carrusel.jpg";
import carrusel3 from "../assets/3carrusel.jpg";
import carrusel4 from "../assets/4carrusel.jpg";

export default function Carousel() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselInnerRef = useRef(null);
  
  // NUEVOS ESTADOS Y REFS PARA LA ANIMACIÓN ON-SCROLL-INTO-VIEW
  const carouselSectionRef = useRef(null); // Para observar la sección principal del carrusel
  const [isCarouselInView, setIsCarouselInView] = useState(false); // Para saber si está visible

  useEffect(() => {
    console.log('Componente montado. carouselInnerRef.current:', carouselInnerRef.current);

    if (window.bootstrap && carouselInnerRef.current) {
      console.log('window.bootstrap existe. Intentando inicializar Bootstrap Carousel...');
      const carouselElement = carouselInnerRef.current.closest('.carousel');
      if (carouselElement) {
        let bsCarousel = window.bootstrap.Carousel.getInstance(carouselElement);
        if (!bsCarousel) {
          bsCarousel = new window.bootstrap.Carousel(carouselElement);
          console.log('Bootstrap Carousel inicializado por primera vez.', bsCarousel);
        } else {
          console.log('Bootstrap Carousel ya estaba inicializado.', bsCarousel);
        }

        return () => {
          if (bsCarousel) {
            bsCarousel.dispose();
            console.log('Bootstrap Carousel dispuesto.');
          }
        };
      } else {
        console.warn('No se encontró el elemento .carousel padre para inicializar Bootstrap Carousel.');
      }
    } else {
      console.warn('window.bootstrap no existe o carouselInnerRef.current es nulo.');
    }
  }, []);

  // useEffect para Intersection Observer (Este se mantiene como lo tenías)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Actualiza el estado si el carrusel entra o sale del viewport
        setIsCarouselInView(entry.isIntersecting);
        // console.log('Carousel In View:', entry.isIntersecting); // Para depuración
      },
      {
        root: null, // El viewport es el root
        rootMargin: '0px',
        threshold: 0.1, // Se activa cuando al menos el 10% del carrusel es visible
      }
    );

    if (carouselSectionRef.current) {
      observer.observe(carouselSectionRef.current);
    }

    // Función de limpieza para detener la observación cuando el componente se desmonte
    return () => {
      if (carouselSectionRef.current) {
        observer.unobserve(carouselSectionRef.current);
      }
    };
  }, []); // El array de dependencias vacío asegura que el observador se cree y destruya una sola vez

  const handleStart = (clientX) => {
    console.log('Drag Start:', clientX);
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);

    if (window.bootstrap && carouselInnerRef.current) {
      const carouselElement = carouselInnerRef.current.closest('.carousel');
      if (carouselElement) {
        const bsCarousel = window.bootstrap.Carousel.getInstance(carouselElement);
        if (bsCarousel) {
          bsCarousel.pause();
          console.log('Carousel pausado.');
        }
      }
    }
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    setCurrentX(clientX);
    // console.log('Dragging:', clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diffX = currentX - startX;
    const swipeThreshold = 70;

    console.log('Drag End. DiffX:', diffX);

    if (window.bootstrap && carouselInnerRef.current) {
      const carouselElement = carouselInnerRef.current.closest('.carousel');
      if (carouselElement) {
        const bsCarousel = window.bootstrap.Carousel.getInstance(carouselElement);
        if (bsCarousel) {
          if (diffX > swipeThreshold) {
            console.log('Swipe a la derecha. yendo a prev().');
            bsCarousel.prev();
          } else if (diffX < -swipeThreshold) {
            console.log('Swipe a la izquierda. yendo a next().');
            bsCarousel.next();
          }
          bsCarousel.cycle();
          console.log('Carousel reanudado.');
        }
      }
    }
  };

  const onMouseDown = (e) => handleStart(e.clientX);
  const onMouseMove = (e) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => {
    if (isDragging) {
      console.log('Mouse salió mientras arrastraba. Finalizando arrastre.');
      handleEnd();
    }
  };

  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  return (
    <div
      id="mainCarousel"
      // AÑADIMOS CONDICIONALMENTE LA CLASE 'carousel-in-view'
      className={`carousel slide ${isCarouselInView ? 'carousel-in-view' : ''}`}
      data-bs-ride="carousel"
      data-bs-interval="4000"
      onMouseLeave={onMouseLeave}
      ref={carouselSectionRef} // <--- ATTACHAMOS EL REF AL DIV PRINCIPAL DEL CARRUSEL
    >
      {/* Indicadores */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
      </div>

      {/* Slides - Aquí se aplican los eventos de arrastre */}
      <div
        className="carousel-inner"
        ref={carouselInnerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDragStart={(e) => e.preventDefault()}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="carousel-item active">
          <img src={carrusel1} className="d-block w-100" alt="Slide 1" />
          <div className="carousel-caption-custom">
            <h5>¡Tu Futuro Profesional Comienza Aquí!</h5>
            <p>Transforma tu carrera con cursos diseñados para el éxito en el mercado laboral actual.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src={carrusel2} className="d-block w-100" alt="Slide 2" />
          <div className="carousel-caption-custom">
            <h5>Aprende a tu Ritmo, Crece Sin Límites.</h5>
            <p>Accede a conocimientos de vanguardia y conviértete en el experto que siempre soñaste ser.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src={carrusel3} className="d-block w-100" alt="Slide 3" />
          <div className="carousel-caption-custom">
            <h5>Aprender es Evolucionar.</h5>
            <p>Explora nuestra amplia oferta de cursos y da el siguiente paso en tu desarrollo.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src={carrusel4} className="d-block w-100" alt="Slide 4" />
          <div className="carousel-caption-custom">
            <h5>Conoce... Crece... Lidera...</h5>
            <p>Cada curso es un paso hacia la versión más capaz y exitosa de ti mismo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}