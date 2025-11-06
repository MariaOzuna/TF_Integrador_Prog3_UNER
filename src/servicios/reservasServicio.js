import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import NotificacionesServicios from "./notificacionesServicio.js"

export default class ReservasServicio{
    constructor(){
        this.reservas = new Reservas();
        this.reservas_servicios = new ReservasServicios();
        this.notificaciones_servicios = new NotificacionesServicios();
    }

    buscarTodasLasReservas = () => {
        return this.reservas.buscarTodasLasReservas();
    }

    buscarReserva = (reserva_id) => {
        return this.reservas.buscarReserva(reserva_id);
    }

    agregarReserva = async (reserva) => {
        const {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, servicios} = reserva; //desestructuro para usar los datos
        const nuevaReserva = {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total}; //nueva reserva sin los servicios

        //agrego la reserva
        const resultado = await this.reservas.agregarReserva(nuevaReserva);

        if(!resultado) {
            return null;
        }

        //agregar servicios a la reserva
        await this.reservas_servicios.agregarServicios(resultado.reserva_id, servicios); 

        try{
            const datosParaNotificacion = await this.reservas.datosParaNotificacion(resultado.reserva_id);
            await this.notificaciones_servicios.enviarCorreo(datosParaNotificacion);

        } catch(notificacionError) {
            console.log("No se pudo enviar el correo");
        }
        
        //retorno reserva creada
        return this.reservas.buscarReserva(resultado.reserva_id);
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