const connection = require('../db/connection');

const getAll = async () => {
  const [rows] = await connection.query('SELECT * FROM usuarios');
  return rows;
};

const getById = async (id) => {
  const [rows] = await connection.query('SELECT * FROM usuarios WHERE usuario_id = ?', [id]);
  return rows[0];
};

const create = async (usuario) => {
  const [result] = await connection.query('INSERT INTO usuarios SET ?', usuario);
  return { usuario_id: result.insertId, ...usuario };
};

const update = async (id, usuario) => {
  await connection.query('UPDATE usuarios SET ? WHERE usuario_id = ?', [usuario, id]);
  return { usuario_id: id, ...usuario };
};

const remove = async (id) => {
  await connection.query('DELETE FROM usuarios WHERE usuario_id = ?', [id]);
  return { message: 'Usuario eliminado correctamente' };
};

module.exports = { getAll, getById, create, update, remove };
