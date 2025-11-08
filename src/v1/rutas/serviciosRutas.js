import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import ServiciosControlador from '../../controladores/serviciosControlador.js';
import apicache from 'apicache';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

let cache = apicache.middleware;

const serviciosControlador = new ServiciosControlador();

const router = express.Router(); //esto da express para poder definir las rutas


/**
 * @swagger
 * tags:
 *   - name: Servicios
 *     description: Endpoints para la gestión de servicios.
 */

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Obtiene todos los servicios activos
 *     tags: [Servicios]
 *     responses:
 *       '200':
 *         description: Lista de servicios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 servicios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Servicio'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//GET de todos los servicios --> la ruta es servicios/
// Clientes(3), Empleados(2) y Admin(1) pueden ver
router.get('/', cache('2 minutes'),autorizarUsuarios([1, 2, 3]), serviciosControlador.buscarTodosServicios); //usar apicache


/**
 * @swagger
 * /servicios/{servicio_id}:
 *   get:
 *     summary: Obtiene un servicio por su ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del servicio.
 *     responses:
 *       '200':
 *         description: Datos del servicio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 servicio:
 *                   $ref: '#/components/schemas/Servicio'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//GET para buscar un servicio por su id
// Clientes(3), Empleados(2) y Admin(1) pueden ver
router.get('/:servicio_id', cache('3 minutes'),autorizarUsuarios([1, 2, 3]), serviciosControlador.buscarServicio);


/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Agrega un nuevo servicio
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoServicio'
 *     responses:
 *       '201':
 *         description: Servicio creado exitosamente.
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
 *                   example: "Servicio agregado con éxito. Su id es: 12"
 *                 servicio:
 *                   $ref: '#/components/schemas/Servicio'
 *       '400':
 *         $ref: '#/components/responses/ErrorValidacion'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//POST para agregar un nuevo servicio - Solo Empleados(2) y Admin(1)
router.post('/', 
    autorizarUsuarios([1, 2]), // AUTORIZACIÓN
    [
        check('descripcion', 'Falta la descripción del servicio').trim().notEmpty(),
        check('importe', 'Falta el importe del servicio').trim().notEmpty()
        .isFloat({min: 0}).withMessage('El importe debe ser un número mayor o igual a 0'),
        validarCampos
    ],
    serviciosControlador.agregarServicio);


/**
 * @swagger
 * /servicios/{servicio_id}:
 *   put:
 *     summary: Edita un servicio existente
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del servicio a editar.
 *     requestBody:
 *       required: true
 *       description: Campos a modificar (parcial).
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoServicio'
 *     responses:
 *       '200':
 *         description: Servicio modificado con éxito.
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
 *                   example: "Servicio modificado"
 *                 servicio:
 *                   $ref: '#/components/schemas/Servicio'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//PUT para editar un servicio por su id - Solo Empleados(2) y Admin(1)
router.put('/:servicio_id', autorizarUsuarios([1, 2]), serviciosControlador.editarServicio);


/**
 * @swagger
 * /servicios/{servicio_id}:
 *   delete:
 *     summary: Elimina (lógicamente) un servicio por su ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del servicio a eliminar.
 *     responses:
 *       '200':
 *         description: Servicio eliminado lógicamente.
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
 *                   example: "Se eliminó el siguiente servicio."
 *                 servicio:
 *                   $ref: '#/components/schemas/Servicio'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//DELETE para el eliminado lógico de un servicio por su id - Solo Empleados(2) y Admin(1)
router.delete('/:servicio_id',autorizarUsuarios([1, 2]), serviciosControlador.eliminarServicio);

export { router };