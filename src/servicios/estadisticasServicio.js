import Estadisticas from "../db/estadisticas.js";

// Esta clase es el puente
export default class EstadisticasServicio {

    constructor() {
        // Se crea una instancia de la clase de DB
        this.estadisticas = new Estadisticas();
    }

    // El servicio solo se encarga de llamar al método de la BD
    generarEstadisticas = () => {
        return this.estadisticas.llamarSP();
    }
}