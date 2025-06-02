// src/components/BenefitCardsSlider.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import './BenefitCardsSlider.css';

// Importamos iconos de react-icons
import {
  RiTimeLine,
  RiComputerLine,
  RiBarChartFill,
  RiCustomerService2Fill,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
  RiTeamLine
} from 'react-icons/ri';

// Datos de los BENEFICIOS de estudiar en tu web
const benefits = [
  {
    id: 1,
    title: 'Flexibilidad de Horarios',
    description: 'Aprende a tu propio ritmo, desde cualquier lugar y en cualquier momento, adaptándose a tu vida.',
    icon: RiTimeLine,
    buttonText: 'Explorar Cursos',
    link: '#cursos',
  },
  {
    id: 2,
    title: 'Acceso Multi-Dispositivo',
    description: 'Estudia cómodamente desde tu ordenador, tablet o móvil, con una experiencia de usuario optimizada.',
    icon: RiComputerLine,
    buttonText: 'Ver Plataforma',
    link: '#plataforma',
  },
  {
    id: 3,
    title: 'Certificaciones Reconocidas',
    description: 'Obtén diplomas que validan tus nuevas habilidades y potencian tu perfil profesional en el mercado laboral.',
    icon: RiBarChartFill,
    buttonText: 'Conocer Más',
    link: '#certificaciones',
  },
  {
    id: 4,
    title: 'Soporte 24/7',
    description: 'Nuestro equipo de tutores y soporte técnico está siempre disponible para resolver tus dudas y ayudarte.',
    icon: RiCustomerService2Fill,
    buttonText: 'Preguntas Frecuentes',
    link: '#faq',
  },
  {
    id: 5,
    title: 'Contenido de Calidad Premium',
    description: 'Accede a materiales actualizados y creados por expertos de la industria, garantizando un aprendizaje de alto nivel.',
    icon: RiShieldCheckLine,
    buttonText: 'Metodología',
    link: '#metodologia',
  },
  {
    id: 6,
    title: 'Comunidad de Aprendizaje Activa',
    description: 'Conéctate con otros estudiantes, comparte ideas y participa en foros para enriquecer tu experiencia educativa.',
    icon: RiTeamLine,
    buttonText: 'Únete Ahora', // Corregido de sbuttonText a buttonText
    link: '#comunidad',
  },
];

const BenefitCardsSlider = () => {
  const benefitSliderRef = useRef(null);
  const [isSliderInView, setIsSliderInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSliderInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (benefitSliderRef.current) {
      observer.observe(benefitSliderRef.current);
    }

    return () => {
      if (benefitSliderRef.current) {
        observer.unobserve(benefitSliderRef.current);
      }
    };
  }, []);

  return (
    <section
      className={`new-card-slider-section ${isSliderInView ? 'in-view' : ''}`}
      ref={benefitSliderRef}
    >
      <div className="slider-header-animated">
        <h2 className="main-slider-title">- ¿Por Qué Elegirnos? -<br/></h2>
        <p className="main-slider-subtitle">Descubre las ventajas que te ofrecemos para impulsar tu aprendizaje y carrera.</p>
      </div>

      <Swiper
        loop={true}
        grabCursor={true}
        centeredSlides={true}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="new-card-swiper"
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 20 },
          650: { slidesPerView: 2, spaceBetween: 30 },
          890: { slidesPerView: 3, spaceBetween: 40 },
          1300: { slidesPerView: 4, spaceBetween: 50 },
          1600: { slidesPerView: 5, spaceBetween: 60 },
        }}
      >
        {benefits.map(benefit => (
          <SwiperSlide key={benefit.id} className="new-card-slide">
            {/* Nuevo wrapper para la animación de entrada */}
            <div className="animated-card-wrapper">
              <div className="new-card-content">
                <benefit.icon className="new-card-icon" />
                <h3 className="new-card-name">{benefit.title}</h3>
                <p className="new-card-description">{benefit.description}</p>
                <a href={benefit.link} className="new-card-button">
                  {benefit.buttonText}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-pagination"></div>

    </section>
  );
};

export default BenefitCardsSlider;