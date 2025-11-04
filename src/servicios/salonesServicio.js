import Salones from "../db/salones.js";

export default class SalonesServicio {
    constructor() {
        this.salones = new Salones();
    }

    buscarTodos = async () => {
        return await this.salones.buscarTodos();
    }

    buscarPorId = async (salon_id) => {
        return await this.salones.buscarPorId(salon_id);
    }
    
    crear = async (salon) => {
        return await this.salones.crear(salon);
    }

    modificar = async (salon_id, datos) => {
        const existe = await this.salones.buscarPorId(salon_id);
        if (!existe) {
            return null;
        }
        return await this.salones.modificar(salon_id, datos);
    }
    
    eliminar = async (salon_id) => {
        const existe = await this.salones.buscarPorId(salon_id);
        if (!existe) {
            return null;
        }
        return await this.salones.eliminar(salon_id);
    }
}