import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import TurnosControlador from '../../controladores/turnosControlador.js';
import apicache from 'apicache';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

let cache = apicache.middleware;

const turnosControlador = new TurnosControlador();

const router = express.Router(); 

// Expresión regular para validar HH:MM o HH:MM:SS
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;


/**
 * @swagger
 * tags:
 *   - name: Turnos
 *     description: Endpoints para la gestión de turnos.
 */

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Obtiene todos los turnos activos
 *     tags: [Turnos]
 *     responses:
 *       '200':
 *         description: Lista de turnos activos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 turnos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Turno'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//GET de todos los turnos - Clientes(3), Empleados(2) y Admin(1) pueden ver
router.get('/', cache('2 minutes'), autorizarUsuarios([1, 2, 3]), turnosControlador.buscarTodosTurnos); 


/**
 * @swagger
 * /turnos/{turno_id}:
 *   get:
 *     summary: Obtiene un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del turno.
 *     responses:
 *       '200':
 *         description: Datos del turno solicitado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 turno:
 *                   $ref: '#/components/schemas/Turno'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//GET para buscar un turno por su id - Clientes(3), Empleados(2) y Admin(1) pueden ver
router.get('/:turno_id', cache('3 minutes'), autorizarUsuarios([1, 2, 3]),
 turnosControlador.buscarTurno); 
//, 
/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crea un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoTurno'
 *     responses:
 *       '201':
 *         description: Turno creado exitosamente.
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
 *                   example: "Turno creado con éxito. ID: 5"
 *                 turno:
 *                   $ref: '#/components/schemas/Turno'
 *       '400':
 *         $ref: '#/components/responses/ErrorValidacion'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//POST para agregar un nuevo turno - Solo Empleados(2) y Admin(1)
router.post('/', 
    autorizarUsuarios([1, 2]), // AUTORIZACIÓN
    [
        check('orden', 'Falta el orden o no es un entero')
            .trim().notEmpty().isInt(),
            
        check('hora_desde', 'El formato de hora_desde debe ser HH:MM o HH:MM:SS')
            .trim().notEmpty().matches(timeRegex),
            
        check('hora_hasta', 'El formato de hora_hasta debe ser HH:MM o HH:MM:SS')
            .trim().notEmpty().matches(timeRegex),
            
        validarCampos
    ],
    turnosControlador.crearTurno);


/**
 * @swagger
 * /turnos/{turno_id}:
 *   put:
 *     summary: Edita un turno existente
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del turno a editar.
 *     requestBody:
 *       required: true
 *       description: Campos a modificar (parcial).
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoTurno'
 *     responses:
 *       '200':
 *         description: Turno modificado con éxito.
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
 *                   example: "Turno modificado correctamente."
 *                 turno:
 *                   $ref: '#/components/schemas/Turno'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//PUT para editar un turno por su id - Solo Empleados(2) y Admin(1)
router.put('/:turno_id', 
    autorizarUsuarios([1, 2]), // AUTORIZACIÓN
    [
        check('orden', 'El orden debe ser un entero')
            .optional().trim().isInt(),

        check('hora_desde', 'El formato de hora_desde debe ser HH:MM o HH:MM:SS')
            .optional().trim().matches(timeRegex),

        check('hora_hasta', 'El formato de hora_hasta debe ser HH:MM o HH:MM:SS')
            .optional().trim().matches(timeRegex),
            
        validarCampos
    ],
    turnosControlador.modificarTurno);


/**
 * @swagger
 * /turnos/{turno_id}:
 *   delete:
 *     summary: Elimina (lógicamente) un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del turno a eliminar.
 *     responses:
 *       '200':
 *         description: Turno eliminado lógicamente.
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
 *                   example: "Turno eliminado correctamente."
 *                 turno:
 *                   $ref: '#/components/schemas/Turno'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//DELETE para el eliminado lógico de un turno por su id
// Solo Empleados(2) y Admin(1)
router.delete('/:turno_id', autorizarUsuarios([1, 2]), turnosControlador.eliminarTurno);

export { router };