import { useState } from 'react';

function ResenaForm() {
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [idCurso, setIdCurso] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      comentario,
      estrellas: parseInt(estrellas),
      idCurso: parseInt(idCurso),
      idUsuario: parseInt(idUsuario)
    };

    try {
      const response = await fetch('http://localhost:8080/api/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMensaje('✅ Reseña enviada correctamente');
        setComentario('');
        setEstrellas(5);
        setIdCurso('');
        setIdUsuario('');
      } else {
        const errorText = await response.text();
        setMensaje(`❌ Error al enviar reseña: ${errorText}`);
      }
    } catch (error) {
      setMensaje(`❌ Error de red: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Enviar Reseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          required
        /><br />
        <input
          type="number"
          placeholder="Estrellas (1-5)"
          value={estrellas}
          min="1"
          max="5"
          onChange={(e) => setEstrellas(e.target.value)}
          required
        /><br />
        <input
          type="number"
          placeholder="ID del Curso"
          value={idCurso}
          onChange={(e) => setIdCurso(e.target.value)}
          required
        /><br />
        <input
          type="number"
          placeholder="ID del Usuario"
          value={idUsuario}
          onChange={(e) => setIdUsuario(e.target.value)}
          required
        /><br />
        <button type="submit">Enviar Reseña</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default ResenaForm;
