const express = require('express');
const router = express.Router();
const connection = require('../db/connection');
const { enviarCorreoTurno } = require('../utils/mailer');

// ✅ POST - Crear nuevo turno y enviar correo
router.post('/', async (req, res) => {
  try {
    // Extraemos correoDestino (solo para enviar correo)
    const { correoDestino, ...turnoData } = req.body;

    // Insertamos solo los datos que existen en la tabla
    const [result] = await connection.query('INSERT INTO turnos SET ?', turnoData);

    const nuevoTurno = { ...turnoData, turno_id: result.insertId };

    // Si se pasó un correo, enviamos la confirmación
    if (correoDestino) {
      await enviarCorreoTurno(correoDestino, nuevoTurno);
    }

    res.status(201).json({
      message: 'Turno creado correctamente y correo enviado',
      turno_id: result.insertId,
    });
  } catch (error) {
    console.error('❌ Error en POST /turnos:', error.message);
    res.status(500).json({ error: 'Error al crear turno', detalle: error.message });
  }
});

// ✅ PUT - Actualizar turno
router.put('/:id', async (req, res) => {
  try {
    const turno = req.body;
    await connection.query('UPDATE turnos SET ? WHERE turno_id = ?', [turno, req.params.id]);
    res.json({ message: 'Turno actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar turno', detalle: error.message });
  }
});

// ✅ DELETE - Eliminación lógica del turno
router.delete('/:id', async (req, res) => {
  try {
    await connection.query('UPDATE turnos SET activo = 0 WHERE turno_id = ?', [req.params.id]);
    res.json({ message: 'Turno eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar turno', detalle: error.message });
  }
});

module.exports = router;
