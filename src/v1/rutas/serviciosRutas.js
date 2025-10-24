import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import ServiciosControlador from '../../controladores/serviciosControlador.js';
import apicache from 'apicache';

let cache = apicache.middleware;

const serviciosControlador = new ServiciosControlador();

const router = express.Router(); //esto da express para poder definir las rutas

//GET de todos los servicios --> la ruta es servicios/
router.get('/', cache('2 minutes'), serviciosControlador.buscarTodosServicios); //usar apicache

//GET para buscar un servicio por su id
router.get('/:servicio_id', cache('3 minutes'), serviciosControlador.buscarServicio); //usar apicache

//POST para agregar un nuevo servicio
router.post('/', 
    [
        check('descripcion', 'Falta la descripción del servicio').trim().notEmpty(),
        check('importe', 'Falta el importe del servicio').trim().notEmpty()
        .isFloat({min: 0}).withMessage('El importe debe ser un número mayor o igual a 0'),
        validarCampos
    ],
    serviciosControlador.agregarServicio);

//PUT para editar un servicio por su id
router.put('/:servicio_id', serviciosControlador.editarServicio);

//DELETE para el eliminado lógico de un servicio por su id
router.delete('/:servicio_id', serviciosControlador.eliminarServicio);

export { router };