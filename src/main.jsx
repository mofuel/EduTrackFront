// src/main.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ReactDOM from 'react-dom/client';
import App from './App';

// ✅ Importa el CSS de Bootstrap para que los estilos se apliquen
import 'bootstrap/dist/css/bootstrap.min.css';
// ✅ También puedes mantener el bundle JS si usas componentes como Carousel o Collapse
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <App /> // <<-- ¡SIN <React.StrictMode>!
);