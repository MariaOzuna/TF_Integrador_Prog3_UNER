import express from 'express';
import DashboardControlador from '../../controladores/dashboardControlador.js';

// Faltaria agregar la seguridad para que solo el admin lo pueda ver!!!

const router = express.Router();
const dashboardControlador = new DashboardControlador();

router.get('/', dashboardControlador.mostrarDashboard);

export { router };