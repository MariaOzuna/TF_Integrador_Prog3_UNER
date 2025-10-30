const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// ✅ GET - Listar usuarios con FILTRO y PAGINACIÓN
router.get('/', async (req, res) => {
  try {
    const { tipo_usuario, page = 1, limit = 5 } = req.query;

    // base de la consulta
    let query = 'SELECT * FROM usuarios';
    const params = [];

    // FILTRO por tipo_usuario si se incluye en la URL
    if (tipo_usuario) {
      query += ' WHERE tipo_usuario = ?';
      params.push(tipo_usuario);
    }

    // PAGINACIÓN
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await connection.query(query, params);

    // respuesta
    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: rows.length,
      data: rows
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', detalle: error.message });
  }
});


// ✅ GET - Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM usuarios WHERE usuario_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario', detalle: error.message });
  }
});

// ✅ POST - Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const usuario = req.body;
    const [result] = await connection.query('INSERT INTO usuarios SET ?', usuario);
    res.status(201).json({ message: 'Usuario creado', usuario_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
  }
});

// ✅ PUT - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const usuario = req.body;
    await connection.query('UPDATE usuarios SET ? WHERE usuario_id = ?', [usuario, req.params.id]);
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
  }
});

// ✅ DELETE - Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    await connection.query('DELETE FROM usuarios WHERE usuario_id = ?', [req.params.id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario', detalle: error.message });
  }
});

module.exports = router;
