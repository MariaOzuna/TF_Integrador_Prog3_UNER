import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import ReservasControlador from '../../controladores/reservasControlador.js';
import apicache from 'apicache';

let cache = apicache.middleware;
const reservasControlador = new ReservasControlador();
const router = express.Router();

//GET de todas las reservas
router.get('/', cache('2 minutes'), reservasControlador.buscarTodasReservas);

//GET para buscar una reserva por su id
router.get('/:reserva_id', cache('3 minutes'), reservasControlador.buscarReserva);

//POST para agregar una nueva reserva
router.post('/', 
    [
        check('fecha_reserva', 'Falta la fecha de la reserva o es inválida')
            .trim().notEmpty().isISO8601().toDate(),
        check('salon_id', 'Falta el ID del salón o no es un entero')
            .trim().notEmpty().isInt(),
        check('usuario_id', 'Falta el ID del usuario o no es un entero')
            .trim().notEmpty().isInt(),
        check('turno_id', 'Falta el ID del turno o no es un entero')
            .trim().notEmpty().isInt(),
        check('tematica', 'La temática debe ser texto')
            .optional().trim().isString(),
        check('importe_salon', 'Falta el importe del salón o no es un número')
            .trim().notEmpty().isFloat({ min: 0 }),
        check('importe_total', 'Falta el importe total o no es un número')
            .trim().notEmpty().isFloat({ min: 0 }),
        validarCampos // Middleware de validación
    ],
    reservasControlador.agregarReserva);

//PUT para editar una reserva por su id
router.put('/:reserva_id', 
    [
        check('fecha_reserva', 'La fecha de la reserva es inválida')
            .optional().trim().isISO8601().toDate(),
        check('salon_id', 'El ID del salón no es un entero')
            .optional().trim().isInt(),
        check('turno_id', 'El ID del turno no es un entero')
            .optional().trim().isInt(),
        check('tematica', 'La temática debe ser texto')
            .optional().trim().isString(),
        check('importe_salon', 'El importe del salón no es un número')
            .optional().trim().isFloat({ min: 0 }),
        check('importe_total', 'El importe total no es un número')
            .optional().trim().isFloat({ min: 0 }),
        validarCampos
    ],
    reservasControlador.editarReserva);

//DELETE para eliminado lógico 
router.delete('/:reserva_id', reservasControlador.eliminarReserva);

export { router };
