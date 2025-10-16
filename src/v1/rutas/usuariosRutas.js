//acá no definimos clases
import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import apicache from 'apicache';

let cache = apicache.middleware;

const usuariosControlador = new UsuariosControlador();

const router = express.Router(); //esto da express para poder definir las rutas

//GET de todos los usuarios --> la ruta es usuarios/
router.get('/', cache('2 minutes'), usuariosControlador.buscarTodosUsuarios); //usar apicache

//GET para buscar un usuario por su id
router.get('/:usuario_id', cache('3 minutes'), usuariosControlador.buscarUsuario); //usar apicache

//POST para agregar un nuevo usuario
router.post('/', 
    [
        check('nombre', 'Falta el nombre del usuario').trim().notEmpty(),
        check('apellido', 'Falta el apellido del usuario').trim().notEmpty(),
        check('nombre_usuario', 'Falta el nombre de usuario o el email es inválido').trim().notEmpty().isEmail(), // trim para eliminar espacios, notEmpty para que no esté vacio, isEmail chequea que sea email correcto
        check('contrasenia', 'Falta la contraseña').trim().notEmpty(),
        check('tipo_usuario', 'Falta el tipo del usuario, debe poner un numero del 1 al 3').trim().notEmpty().isNumeric(),
        validarCampos
    ],
    usuariosControlador.agregarUsuario);

//PUT para editar un usuario por su id
router.put('/:usuario_id', usuariosControlador.editarUsuario);

//DELETE para el eliminado lógico de un usuario por su id
router.delete('/:usuario_id', usuariosControlador.eliminarUsuario);

export { router };