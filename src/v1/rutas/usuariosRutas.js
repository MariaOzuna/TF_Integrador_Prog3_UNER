import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import apicache from 'apicache';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

let cache = apicache.middleware;

const usuariosControlador = new UsuariosControlador();

const router = express.Router(); //esto da express para poder definir las rutas

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Endpoints para la gestión de usuarios.
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios activos
 *     tags: [Usuarios]
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//GET de todos los usuarios --> la ruta es usuarios/ - Empleados(2) y Admin(1)
router.get('/', cache('2 minutes'), autorizarUsuarios([1, 2]), usuariosControlador.buscarTodosUsuarios); //usar apicache


/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del usuario a buscar.
 *     responses:
 *       '200':
 *         description: Datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//GET para buscar un usuario por su id - Empleados(2) y Admin(1)
router.get('/:usuario_id', cache('3 minutes'), autorizarUsuarios([1, 2]),usuariosControlador.buscarUsuario); //usar apicache


/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Agrega un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoUsuario'
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario agregado con éxito. Su id es: 123"
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       '400':
 *         $ref: '#/components/responses/ErrorValidacion'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//POST para agregar un nuevo usuario - Solo Admin(1)
router.post('/', 
    autorizarUsuarios([1]), // AUTORIZACIÓN
    [
        check('nombre', 'Falta el nombre del usuario')
        .trim()
        .notEmpty(),
        check('apellido', 'Falta el apellido del usuario')
        .trim()
        .notEmpty(),
        check('nombre_usuario', 'Falta el nombre de usuario o el email es inválido')
        .trim()
        .notEmpty()
        .isEmail(), // trim para eliminar espacios, notEmpty para que no esté vacio, isEmail chequea que sea email correcto
        check('contrasenia', 'Falta la contraseña')
        .trim()
        .notEmpty(),
        check('tipo_usuario', 'Falta el tipo del usuario')
        .trim()
        .notEmpty()
        .isInt({min: 1, max: 3}).withMessage('El valor debe ser un número entre el 1 y el 3'),
        validarCampos
    ],
    usuariosControlador.agregarUsuario);


/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   put:
 *     summary: Edita un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del usuario a editar.
 *     requestBody:
 *       required: true
 *       description: Campos a modificar (parcial).
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoUsuario'
 *     responses:
 *       '200':
 *         description: Usuario modificado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario modificado con éxito"
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//PUT para editar un usuario por su id - Solo Admin(1)
router.put('/:usuario_id', autorizarUsuarios([1]), usuariosControlador.editarUsuario);


/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   delete:
 *     summary: Elimina (lógicamente) un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del usuario a eliminar.
 *     responses:
 *       '200':
 *         description: Usuario eliminado lógicamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario eliminado con éxito."
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//DELETE para el eliminado lógico de un usuario por su id - Solo Admin(1)
router.delete('/:usuario_id', autorizarUsuarios([1]), usuariosControlador.eliminarUsuario);

export { router };