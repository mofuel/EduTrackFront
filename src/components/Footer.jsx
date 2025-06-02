// src/components/Footer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'; // Nuestro CSS personalizado

export default function Footer() {
  const footerRef = useRef(null);
  const [isFooterInView, setIsFooterInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Se activa cuando el 10% del footer es visible
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer
      className={`footer-section ${isFooterInView ? 'in-view' : ''}`}
      ref={footerRef}
    >
      {/* ¡LA BARRA SEPARADORA VA AQUÍ, JUSTO AL INICIO DEL FOOTER! */}
      {/* Añadimos la clase 'in-view' para que se anime al mismo tiempo que el footer */}
      <div className={`footer-top-divider ${isFooterInView ? 'in-view' : ''}`}></div>

      <div className="container footer-container">
        {/* Sección de Información de la Empresa (animada) */}
        <div className="footer-column company-info-animated">
          <h5 className="footer-brand">EduTrack</h5>
          <p className="footer-description">
            Impulsando tu futuro profesional con educación de calidad, práctica y accesible.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn className="social-icon" />
            </a>
          </div>
        </div>

        {/* Sección de Enlaces Rápidos (animada) */}
        <div className="footer-column quick-links-animated">
          <h6 className="footer-heading">Enlaces Rápidos</h6>
          <ul className="list-unstyled footer-links">
            <li><a href="#inicio" className="footer-link">Inicio</a></li>
            <li><a href="#cursos" className="footer-link">Cursos</a></li>
            <li><a href="#instructores" className="footer-link">Instructores</a></li>
            <li><a href="#testimonios" className="footer-link">Testimonios</a></li>
            <li><a href="#contacto" className="footer-link">Contacto</a></li>
          </ul>
        </div>

        {/* Sección de Contacto (animada) */}
        <div className="footer-column contact-info-animated">
          <h6 className="footer-heading">Contacto</h6>
          <ul className="list-unstyled contact-details">
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>Av. Siempre Viva 742, Springfield</span>
            </li>
            <li>
              <FaPhone className="contact-icon" />
              <span>+51 987 654 321</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>info@edutrack.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Sección de Derechos de Autor */}
      <div className="footer-bottom-bar">
        <p className="footer-copyright">© 2025 EduTrack. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}