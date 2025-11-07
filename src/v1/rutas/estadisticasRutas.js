import express from 'express';
import EstadisticasControlador from '../../controladores/estadisticasControlador.js';

// Hay que agregar la seguridad!!

const router = express.Router();
const estadisticasControlador = new EstadisticasControlador();

// Se crea la ruta GET
router.get('/', estadisticasControlador.obtenerEstadisticas);

export { router };