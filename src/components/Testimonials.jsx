// src/components/Testimonials.jsx
import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Testimonials.css';

// Importa tus imágenes. Se mantienen las que tenías.
import testimonial1Image from '../assets/testimonial-01.png';
import testimonial2Image from '../assets/testimonial-02.png'; // Esta importación no se usa en los 3 testimonios actuales, pero se mantiene.
import testimonial3Image from '../assets/testimonial-03.png';
import testimonial4Image from '../assets/testimonial-04.png';


export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonialsSectionRef = useRef(null);
  const [isSectionInView, setIsSectionInView] = useState(false);

  // Lógica del IntersectionObserver para la animación de entrada (sin cambios aquí)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    if (testimonialsSectionRef.current) {
      observer.observe(testimonialsSectionRef.current);
    }

    return () => {
      if (testimonialsSectionRef.current) {
        observer.unobserve(testimonialsSectionRef.current);
      }
    };
  }, []);


  // Datos de los testimonios (se mantiene tal cual, son 3 testimonios)
  const testimonials = [
    {
      id: 0,
      name: "Laura Gómez",
      title: "Fundadora en TechInnovate",
      text: "EduTrack transformó por completo mi trayectoria profesional. Sus cursos me proporcionaron las habilidades exactas que necesitaba para conseguir mi primer trabajo en una startup tecnológica. La calidad del contenido y el soporte de los instructores superaron todas mis expectativas. ¡Totalmente agradecida!",
      image: testimonial1Image
    },
    {
      id: 1,
      name: "Carlos Pérez",
      title: "Desarrollador Senior en NexGen",
      text: "Los cursos de EduTrack son increíblemente prácticos y se actualizan constantemente con las últimas tendencias de la industria. Pude aplicar lo aprendido desde el primer día, lo cual aceleró mi crecimiento profesional. Recomiendo esta plataforma a cualquiera que busque una educación de calidad y aplicable.",
      image: testimonial4Image // Usando testimonial4Image como tenías
    },
    {
      id: 2,
      name: "María López",
      title: "Especialista en Marketing Digital",
      text: "Como madre trabajadora, necesitaba una plataforma flexible para seguir aprendiendo. EduTrack me permitió hacerlo a mi propio ritmo, con materiales accesibles y clases grabadas. Ha sido fundamental para mantenerme relevante en el dinámico mundo del marketing digital.",
      image: testimonial3Image
    },
    // No hay testimonios adicionales comentados, para mantenerlo exacto a tu última versión.
  ];

  const handleIndicatorClick = (id) => {
    setCurrentSlide(id);
  };

  return (
    <section
      className={`edutrack-testimonials-section ${isSectionInView ? 'in-view' : ''}`}
      ref={testimonialsSectionRef}
    >
      <div className="edutrack-testimonials-container">
        <div className={`edutrack-testimonials-title-wrapper ${isSectionInView ? 'in-view' : ''}`}>
          <h1 className="edutrack-testimonials-heading">- Lo que dicen nuestros estudiantes -</h1>
        </div>

        <div className="edutrack-slider-indicator">
          {testimonials.map((testi, index) => (
            <img
              key={testi.id}
              src={testi.image}
              // --- CAMBIO AQUÍ: Eliminamos el style={{ animationDelay }} ---
              className={`edutrack-indicator-image ${isSectionInView ? 'in-view' : ''} ${index === currentSlide ? 'active' : ''}`}
              alt={testi.name}
              data-id={testi.id}
              onClick={() => handleIndicatorClick(testi.id)}
              // Antes: style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              // Ahora: Sin animationDelay aquí, para que anime con el resto
            />
          ))}
        </div>

        <div className={`edutrack-slider-wrapper ${isSectionInView ? 'in-view' : ''}`}>
          {testimonials.map((testi, index) => (
            <div
              key={testi.id}
              className={`edutrack-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <p className="edutrack-testimonial-text">"{testi.text}"</p>
              <div className="edutrack-client-info">
                <h3 className="edutrack-client-name">{testi.name}</h3>
                <span className="edutrack-client-title">{testi.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}