import Servicios from "../db/servicios.js";

export default class ServiciosServicio{
    constructor(){
        this.servicios = new Servicios(); //instancio la clase servicios de db
    }

    buscarTodosServicios = () => {
        return this.servicios.buscarTodosServicios();
    }

    buscarServicio = (servicio_id) => {
        //se va pasando el servicio id por parametro
        return this.servicios.buscarServicio(servicio_id);
    }

    editarServicio = (servicio_id, datos) => {
        const existe = this.servicios.buscarServicio(servicio_id);
        if (!existe) {
            return null;
        }
        return this.servicios.editarServicio(servicio_id, datos);
    }

    eliminarServicio = (servicio_id) => {
        const existe = this.servicios.buscarServicio(servicio_id);
        if (!existe) {
            return null;
        }
        return this.servicios.eliminarServicio(servicio_id);
    }

    agregarServicio = (servicio) => {
        return this.servicios.agregarServicio(servicio);
    }
}