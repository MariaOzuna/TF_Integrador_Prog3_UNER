import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js'; 
import SalonesControlador from '../../controladores/salonesControlador.js';
import apicache from 'apicache';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

let cache = apicache.middleware;
const salonesControlador = new SalonesControlador();
const router = express.Router(); 

// Rutas para salones

/**
 * @swagger
 * tags:
 *   - name: Salones
 *     description: Endpoints para la gestión de salones.
 */

/**
 * @swagger
 * /salones:
 *   get:
 *     summary: Obtiene todos los salones activos
 *     tags: [Salones]
 *     responses:
 *       '200':
 *         description: Lista de salones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 salones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Salon'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
// Clientes(3), Empleados(2) y Admin(1) pueden ver
router.get('/', cache('2 minutes'), autorizarUsuarios([1, 2, 3]),salonesControlador.buscarTodos);


/**
 * @swagger
 * /salones/{salon_id}:
 *   get:
 *     summary: Obtiene un salón por su ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del salón.
 *     responses:
 *       '200':
 *         description: Datos del salón.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 salon:
 *                   $ref: '#/components/schemas/Salon'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
// Clientes(3), Empleados(2) y Admin(1) pueden ver
router.get('/:salon_id', cache('3 minutes'),autorizarUsuarios([1, 2, 3]), salonesControlador.buscarPorId);


/**
 * @swagger
 * /salones:
 *   post:
 *     summary: Agrega un nuevo salón
 *     tags: [Salones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoSalon'
 *     responses:
 *       '201':
 *         description: Salón creado exitosamente.
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
 *                   example: "Salón agregado con éxito. Su id es: 12"
 *                 salon:
 *                   $ref: '#/components/schemas/Salon'
 *       '400':
 *         $ref: '#/components/responses/ErrorValidacion'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
// Solo Empleados(2) y Admin(1)
router.post('/', 
    autorizarUsuarios([1, 2]), // AUTORIZACIÓN
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


/**
 * @swagger
 * /salones/{salon_id}:
 *   put:
 *     summary: Edita un salón existente
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del salón a editar.
 *     requestBody:
 *       required: true
 *       description: Campos a modificar (parcial).
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoSalon'
 *     responses:
 *       '200':
 *         description: Salón modificado con éxito.
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
 *                   example: 'Salón modificado'
 *                 salon:
 *                   $ref: '#/components/schemas/Salon'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
// modifica por id - Solo Empleados(2) y Admin(1)
router.put('/:salon_id', autorizarUsuarios([1, 2]), salonesControlador.modificar);


/**
 * @swagger
 * /salones/{salon_id}:
 *   delete:
 *     summary: Elimina (lógicamente) un salón por su ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del salón a eliminar.
 *     responses:
 *       '200':
 *         description: Salón eliminado lógicamente.
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
 *                   example: "Se eliminó el siguiente salón."
 *                 salon:
 *                   $ref: '#/components/schemas/Salon'
 *       '404':
 *         $ref: '#/components/responses/ErrorNoEncontrado'
 *       '500':
 *         $ref: '#/components/responses/ErrorServidor'
 */
// elimina por id - Solo Empleados(2) y Admin(1)
router.delete('/:salon_id',autorizarUsuarios([1, 2]), salonesControlador.eliminar);

export { router };