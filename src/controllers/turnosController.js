import pool from '../db/connection.js';
import { enviarCorreoTurno } from '../utils/mailer.js';

export const obtenerTurnos = async (req, res) => {
  try {
    const [turnos] = await pool.query('SELECT * FROM turnos WHERE activo = 1');
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearTurno = async (req, res) => {
  try {
    const { correoDestino, ...turnoData } = req.body;
    if (!turnoData.fecha || !turnoData.hora_desde || !turnoData.hora_hasta) {
      return res.status(400).json({ error: 'Faltan datos obligatorios: fecha/hora_desde/hora_hasta' });
    }

    const [result] = await pool.query('INSERT INTO turnos SET ?', turnoData);
    const nuevoTurno = { ...turnoData, turno_id: result.insertId };

    if (correoDestino) {
      await enviarCorreoTurno(correoDestino, nuevoTurno);
    }

    res.status(201).json({ message: correoDestino ? 'Turno creado y correo enviado' : 'Turno creado', turno_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarTurno = async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE turnos SET ? WHERE turno_id = ?', [req.body, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Turno no encontrado' });
    res.json({ message: 'Turno actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarTurno = async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE turnos SET activo = 0 WHERE turno_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Turno no encontrado' });
    res.json({ message: 'Turno eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
