import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import TurnosControlador from '../../controladores/turnosControlador.js';
import apicache from 'apicache';

let cache = apicache.middleware;

const turnosControlador = new TurnosControlador();

const router = express.Router(); 

// Expresión regular para validar HH:MM o HH:MM:SS
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

//GET de todos los turnos
router.get('/', cache('2 minutes'), turnosControlador.buscarTodosTurnos); 

//GET para buscar un turno por su id
router.get('/:turno_id', cache('3 minutes'), turnosControlador.buscarTurno); 

//POST para agregar un nuevo turno
router.post('/', 
    [
        check('orden', 'Falta el orden o no es un entero')
            .trim().notEmpty().isInt(),
            
        // CAMBIAMOS .isISO8601().toDate() POR .matches(timeRegex)
        check('hora_desde', 'El formato de hora_desde debe ser HH:MM o HH:MM:SS')
            .trim().notEmpty().matches(timeRegex),
            
        // CAMBIAMOS .isISO8601().toDate() POR .matches(timeRegex)
        check('hora_hasta', 'El formato de hora_hasta debe ser HH:MM o HH:MM:SS')
            .trim().notEmpty().matches(timeRegex),
            
        validarCampos
    ],
    turnosControlador.crearTurno);

//PUT para editar un turno por su id
router.put('/:turno_id', 
    [
        check('orden', 'El orden debe ser un entero')
            .optional().trim().isInt(),

        // CAMBIAMOS .isISO8601().toDate() POR .matches(timeRegex)
        check('hora_desde', 'El formato de hora_desde debe ser HH:MM o HH:MM:SS')
            .optional().trim().matches(timeRegex),

        // CAMBIAMOS .isISO8601().toDate() POR .matches(timeRegex)
        check('hora_hasta', 'El formato de hora_hasta debe ser HH:MM o HH:MM:SS')
            .optional().trim().matches(timeRegex),
            
        validarCampos
    ],
    turnosControlador.modificarTurno);

//DELETE para el eliminado lógico de un turno por su id
router.delete('/:turno_id', turnosControlador.eliminarTurno);

export { router };