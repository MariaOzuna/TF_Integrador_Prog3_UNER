import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

import ReservasControlador from '../../controladores/reservasControlador.js';
import apicache from 'apicache';


let cache = apicache.middleware;
const reservasControlador = new ReservasControlador();
const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Reservas
 *     description: Endpoints para la gestión de reservas.
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtiene todas las reservas activas
 *     tags: [Reservas]
 *     responses:
 *       '200':
 *         description: Lista de reservas activas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 reservas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reserva'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//GET de todas las reservas
router.get('/', cache('2 minutes'), autorizarUsuarios([1,2,3]), reservasControlador.buscarTodasLasReservas);


/**
 * @swagger
 * /reservas/{reserva_id}:
 *   get:
 *     summary: Obtiene una reserva por su ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico de la reserva.
 *     responses:
 *       '200':
 *         description: Datos de la reserva.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 reserva:
 *                   $ref: '#/components/schemas/Reserva'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//GET para buscar una reserva por su id
router.get('/:reserva_id', cache('3 minutes'), autorizarUsuarios([1,2,3]), reservasControlador.buscarReserva);


/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevaReserva'
 *     responses:
 *       '201':
 *         description: Reserva creada exitosamente.
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
 *                   example: "Reserva creada con éxito. ID: 45"
 *                 reserva:
 *                   $ref: '#/components/schemas/Reserva'
 *       '400':
 *         $ref: '#/components/responses/ErrorValidacion'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//POST para agregar una nueva reserva
router.post('/', autorizarUsuarios([1,3]),
    [
        check('fecha_reserva', 'Falta la fecha de la reserva o es inválida')
            .trim().notEmpty().isISO8601().toDate(),
        check('salon_id', 'Falta el ID del salón o no es un entero')
            .trim().notEmpty().isInt(),
        check('usuario_id', 'Falta el ID del usuario o no es un entero')
            .trim().notEmpty().isInt(),
        check('turno_id', 'Falta el ID del turno o no es un entero')
            .trim().notEmpty().isInt(),
        check('importe_salon', 'El importe del salón es obligatorio')
            .trim().notEmpty().isFloat({ min: 0 }),
        check('importe_total', 'El importe total es obligatorio')
            .trim().notEmpty().isFloat({ min: 0 }),
        check('servicios', 'Faltan los servicios')
            .notEmpty().isArray(),
        check('servicios.*.importe')
            .isFloat()
            .withMessage('El importe debe ser un numero'),
        validarCampos // Middleware de validación
    ],
    reservasControlador.agregarReserva);


/**
 * @swagger
 * /reservas/{reserva_id}:
 *   put:
 *     summary: Edita una reserva existente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico de la reserva a editar.
 *     requestBody:
 *       required: true
 *       description: Campos a modificar (parcial).
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevaReserva'
 *     responses:
 *       '200':
 *         description: Reserva modificada con éxito.
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
 *                   example: "Reserva modificada correctamente."
 *                 reserva:
 *                   $ref: '#/components/schemas/Reserva'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//PUT para editar una reserva por su id
router.put('/:reserva_id', autorizarUsuarios([1]),
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


/**
 * @swagger
 * /reservas/{reserva_id}:
 *   delete:
 *     summary: Elimina (lógicamente) una reserva por su ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico de la reserva a eliminar.
 *     responses:
 *       '200':
 *         description: Reserva eliminada lógicamente.
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
 *                   example: "Reserva eliminada correctamente."
 *                 reserva:
 *                   $ref: '#/components/schemas/Reserva'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
//DELETE para eliminado lógico 
router.delete('/:reserva_id', autorizarUsuarios([1]), reservasControlador.eliminarReserva);

export { router };