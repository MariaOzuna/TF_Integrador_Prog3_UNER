import Reservas from "../db/reservas.js";

export default class ReservasServicio{
    constructor(){
        this.reservas = new Reservas();
    }

    buscarTodasLasReservas = () => {
        return this.reservas.buscarTodasLasReservas();
    }

    buscarReserva = (reserva_id) => {
        return this.reservas.buscarReserva(reserva_id);
    }

    agregarReserva = (valores) => {
        return this.reservas.agregarReserva(valores);
    }

    editarReserva = async (reserva_id, valores) => {
        const existe = await this.reservas.buscarReserva(reserva_id);
        if (!existe) {
            return null;
        }
        return this.reservas.editarReserva(reserva_id, valores);
    }

    eliminarReserva = async (reserva_id) => {
        const existe = await this.reservas.buscarReserva(reserva_id);
        if (!existe) {
            return null;
        }
        return this.reservas.eliminarReserva(reserva_id);
    }
}