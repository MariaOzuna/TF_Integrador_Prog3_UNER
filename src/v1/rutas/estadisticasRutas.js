import express from 'express';
import EstadisticasControlador from '../../controladores/estadisticasControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

// Hay que agregar la seguridad!!

const router = express.Router();
const estadisticasControlador = new EstadisticasControlador();

// Se crea la ruta GET - Solo Admin(1)
router.get('/', autorizarUsuarios([1]), estadisticasControlador.obtenerEstadisticas);

export { router };