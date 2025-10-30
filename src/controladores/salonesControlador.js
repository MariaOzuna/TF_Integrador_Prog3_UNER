import SalonesServicio from "../servicios/salonesServicio.js";
import { errorCatch, salonNoEncontrado } from "./funciones.js";
import apicache from 'apicache';

export default class SalonesControlador {

    constructor() {
        this.salonesServicio = new SalonesServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const [datos, campos] = await this.salonesServicio.buscarTodos();
            res.json({
                estado: true,
                salones: datos 
            });
        } catch (error) {
            errorCatch('GET /salones', error, res);
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.buscarPorId(salon_id);

            if (!salon) {
                return salonNoEncontrado(res);
            }

            res.json({
                estado: true,
                salon: salon
            });
        } catch (error) {
            errorCatch('GET /salones/:id', error, res);
        }
    }
    
    crear = async (req, res) => {
        try {
            const salon = req.body;
            const [agregado] = await this.salonesServicio.crear(salon);

            res.status(201).json({
                estado: true,
                mensaje: `Salón agregado con éxito. Su id es: ${agregado.insertId}`,
                salon: agregado
            });
            apicache.clear();

        } catch (error) {
            errorCatch('POST /salones', error, res);
        }
    }
    
    modificar = async (req, res) => {
        try {
            const salon_id = req.params.salon_id;
            const datos = req.body;
            
            const salonModificado = await this.salonesServicio.modificar(salon_id, datos);

            if (!salonModificado) {
                return salonNoEncontrado(res);
            }

            res.json({
                estado: true,
                mensaje: 'Salón modificado',
                salon: salonModificado
            });
            apicache.clear();

        } catch (error) {
            errorCatch('PUT /salones/:id', error, res);
        }
    }

    eliminar = async (req, res) => {
        try {
            const salon_id = req.params.salon_id;

            const dato = await this.salonesServicio.buscarPorId(salon_id);
            const eliminado = await this.salonesServicio.eliminar(salon_id);

            if (!eliminado) {
                return salonNoEncontrado(res);
            }

            res.json({
                estado: true,
                mensaje: "Se eliminó el siguiente salón.",
                salon: dato 
            });
            apicache.clear();

        } catch (error) {
            errorCatch('DELETE /salones/:id', error, res);
        }
    }
}