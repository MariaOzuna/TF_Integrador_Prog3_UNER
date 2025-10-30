import ReservasServicio from "../servicios/reservasServicio.js";
import { errorCatch } from "./funciones.js";
import apicache from 'apicache';

export default class ReservasControlador{
    constructor(){
        this.reservasServicio = new ReservasServicio();
    }

    //GET de todas las reservas
    buscarTodasLasReservas = async (req, res) => {
        try{
            const datos = await this.reservasServicio.buscarTodasLasReservas();
            res.json({
                estado: true,
                reservas: datos
            });
        } catch (error) {
            errorCatch('GET (Todas)', error, res);
        }
    }

    //GET reserva 
    buscarReserva = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const reserva = await this.reservasServicio.buscarReserva(reserva_id);

            if(!reserva){
                return reservaNoEncontrada(res);
            }
            res.json({
                estado: true,
                reserva: reserva
            });
        } catch (error) {
            errorCatch('GET', error, res);
        }
    }

    //POST para agregar reserva
    agregarReserva = async (req, res) => {
        try {
            const {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total} = req.body;
            const valores = [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total];
            
            const [agregado] = await this.reservasServicio.agregarReserva(valores);

            res.status(201).json({ 
                estado: true,
                mensaje: `Reserva agregada con éxito. Su id es: ${agregado.insertId}`,
                reserva_id: agregado.insertId
            });
            apicache.clear();
            
        } catch (error) {
            errorCatch('POST', error, res);
        }
    }

    //PUT para editar una reserva
    editarReserva = async(req, res) => {
        try{
            const reserva_id = req.params.reserva_id;
            const valores = req.body;
            const reservaEditada = await this.reservasServicio.editarReserva(reserva_id, valores);

            if(!reservaEditada){
                return reservaNoEncontrada(res);
            }
            res.json({
                estado: true,
                reserva: reservaEditada,
                mensaje: "Reserva modificada con éxito"
            });
            apicache.clear();

        } catch (error) {
            errorCatch('PUT', error, res);
        }
    }

    //DELETE para eliminado lógico
    eliminarReserva = async (req, res) => {
        try{
            const reserva_id = req.params.reserva_id;
            const datosReserva = await this.reservasServicio.buscarReserva(reserva_id);
            const eliminado = await this.reservasServicio.eliminarReserva(reserva_id);

            if(!datosReserva){
                return reservaNoEncontrada(res);
            }

            res.json({
                estado: true,
                mensaje: "Se eliminó la siguiente reserva.",
                reserva_eliminada: datosReserva
            })
        
        } catch (error) {
            errorCatch('DELETE', error, res);
        }
    }
}