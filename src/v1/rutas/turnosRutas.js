import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import TurnosControlador from '../../controladores/turnosControlador.js';
import apicache from 'apicache';

let cache = apicache.middleware;

const turnosControlador = new TurnosControlador();

const router = express.Router(); 

//GET de todos los turnos
router.get('/', cache('2 minutes'), turnosControlador.buscarTodosTurnos); 

//GET para buscar un turno por su id
router.get('/:turno_id', cache('3 minutes'), turnosControlador.buscarTurno); 

//POST para agregar un nuevo turno
router.post('/', 
    [
        check('orden', 'Falta el orden o no es un entero')
            .trim().notEmpty().isInt(),
        check('hora_desde', 'Falta la hora_desde (formato HH:MM o HH:MM:SS)')
            .trim().notEmpty().isTime(),
        check('hora_hasta', 'Falta la hora_hasta (formato HH:MM o HH:MM:SS)')
            .trim().notEmpty().isTime(),
        validarCampos
    ],
    turnosControlador.crearTurno);

//PUT para editar un turno por su id
router.put('/:turno_id', 
    [
        // Hacemos las validaciones opcionales para el PUT
        check('orden', 'El orden debe ser un entero')
            .optional().trim().isInt(),
        check('hora_desde', 'La hora_desde es inválida')
            .optional().trim().isTime(),
        check('hora_hasta', 'La hora_hasta es inválida')
            .optional().trim().isTime(),
        validarCampos
    ],
    turnosControlador.modificarTurno);

//DELETE para el eliminado lógico de un turno por su id
router.delete('/:turno_id', turnosControlador.eliminarTurno);

export { router };