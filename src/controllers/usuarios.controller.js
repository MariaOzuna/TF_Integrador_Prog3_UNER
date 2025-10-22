const usuariosService = require('../services/usuarios.service');

const getAll = async (req, res) => {
  try {
    const usuarios = await usuariosService.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const usuario = await usuariosService.getById(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const nuevo = await usuariosService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const actualizado = await usuariosService.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await usuariosService.remove(req.params.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👇 ESTO ES CLAVE
module.exports = { getAll, getById, create, update, remove };
