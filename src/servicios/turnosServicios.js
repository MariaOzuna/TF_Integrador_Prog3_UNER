import Turnos from "../db/turnos.js";

export default class TurnosServicio{
    constructor(){
        this.turnos = new Turnos(); //instancio la clase turnos de db
    }

    buscarTodosTurnos = () => {
        return this.turnos.buscarTodosTurnos();
    }

    buscarPorId = (turno_id) => {
        return this.turnos.buscarPorId(turno_id);
    }

    crearTurno = (turno) => {
        return this.turnos.crearTurno(turno);
    }

    modificarTurno = async (turno_id, datos) => {
        const existe = await this.turnos.buscarPorId(turno_id);
        if (!existe) {
            return null;
        }
        return this.turnos.modificarTurno(turno_id, datos);
    }
    
    eliminarTurno = async (turno_id) => {
        const existe = await this.turnos.buscarPorId(turno_id);
        if (!existe) {
            return null;
        }
        return this.turnos.eliminarTurno(turno_id);
    }
}