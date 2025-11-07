import EstadisticasServicio from "../servicios/estadisticasServicio.js";
import { errorCatch } from "./funciones.js"; 
import handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export default class DashboardControlador {

    constructor() {
        this.estadisticasServicio = new EstadisticasServicio();
    }

    mostrarDashboard = async (req, res) => {
        try {
            const datos = await this.estadisticasServicio.generarEstadisticas();
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const plantillaPath = path.join(__dirname, '..', 'utiles', 'handlebars', 'dashboard.hbs');
            
            const archivoHbs = await readFile(plantillaPath, 'utf-8');

            // Compila y envia el html
            const template = handlebars.compile(archivoHbs);
            
            // La plantilla espera una variable 'estadisticas'
            const html = template({ estadisticas: datos });

            // En lugar de res.json(), enviamos el HTML
            res.send(html);

        } catch (error) {
            errorCatch('GET /dashboard', error, res);
        }
    }
}