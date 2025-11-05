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
        check('descripcion', 'Falta la descripción del turno').trim().notEmpty(),
        validarCampos
    ],
    turnosControlador.crearTurno);

//PUT para editar un turno por su id
router.put('/:turno_id', turnosControlador.modificarTurno);

//DELETE para el eliminado lógico de un turno por su id
router.delete('/:turno_id', turnosControlador.eliminarTurno);

export { router };