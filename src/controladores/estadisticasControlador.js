import EstadisticasServicio from "../servicios/estadisticasServicio.js";
import { errorCatch } from "./funciones.js"; 

// Esta clase maneja la petición y la respuesta
export default class EstadisticasControlador {

    constructor() {
        this.estadisticasServicio = new EstadisticasServicio();
    }

    // Este método es el que se conecta a la ruta
    obtenerEstadisticas = async (req, res) => {
        try {
            // Pide los datos al servicio
            const datos = await this.estadisticasServicio.generarEstadisticas();
            
            // Responde con un JSON
            res.json({
                estado: true,
                estadisticas: datos
            });
            
        } catch (error) {
            errorCatch('GET /estadisticas', error, res);
        }
    }
}