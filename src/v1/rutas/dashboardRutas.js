import express from 'express';
import DashboardControlador from '../../controladores/dashboardControlador.js';

const router = express.Router();
const dashboardControlador = new DashboardControlador();

router.get('/', dashboardControlador.mostrarDashboard);

export { router };