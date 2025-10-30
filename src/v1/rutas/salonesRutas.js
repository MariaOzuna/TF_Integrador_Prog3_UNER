import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js'; 
import SalonesControlador from '../../controladores/salonesControlador.js';
import apicache from 'apicache';


let cache = apicache.middleware;
const salonesControlador = new SalonesControlador();
const router = express.Router(); 

// Rutas para salones
router.get('/', cache('2 minutes'), salonesControlador.buscarTodos);

router.get('/:salon_id', cache('3 minutes'), salonesControlador.buscarPorId);

router.post('/', 
    [
        check('titulo', 'Falta el título del salón')
            .trim().notEmpty(),
        check('direccion', 'Falta la dirección del salón')
            .trim().notEmpty(),
        check('capacidad', 'La capacidad es obligatoria y debe ser un número')
            .trim().notEmpty().isInt({ min: 1 }),
        check('importe', 'El importe es obligatorio y debe ser un número')
            .trim().notEmpty().isFloat({ min: 0 }),
            
        validarCampos
    ],
    salonesControlador.crear); // Llama al método crear

// modifica por id
router.put('/:salon_id', salonesControlador.modificar);

// elimina por id
router.delete('/:salon_id', salonesControlador.eliminar);

export { router };