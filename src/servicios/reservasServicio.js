import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import NotificacionesServicios from "./notificacionesServicio.js"

// Nuevo servicios de informes
import InformesServicio from "./informesServicio.js";

export default class ReservasServicio{
    constructor(){
        this.reservas = new Reservas();
        this.reservas_servicios = new ReservasServicios();
        // Instancia de nuevo servicio
        this.informes = new InformesServicio();
        this.notificaciones_servicios = new NotificacionesServicios();
    }

    buscarTodasLasReservas = (usuario) => {
       if(usuario.tipo_usuario < 3){
            return this.reservas.buscarTodasLasReservas();
        }else{
            return this.reservas.buscarPropias(usuario.usuario_id);
        }
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


// Llamar a la BD
buscarDatosReporte = () => {
        return this.reservas.buscarDatosReporte();
}

generarInforme = async (formato) => { 
        // Busca los datos
        const datosReporte = await this.buscarDatosReporte();
        
        // Verifica si hay datos
        if (!datosReporte || datosReporte.length === 0) {
            return null; // El controlador dirá, No hay datos
        }

        if (formato === 'pdf') {
            const pdf = await this.informes.informeReservasPdf(datosReporte);
            return {
                file: pdf,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="reporte_reservas.pdf"'
                }
            };
        }
        
        // Si el formato no es pdf, devuelve null
        return null;
    }
}