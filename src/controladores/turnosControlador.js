import TurnosServicio from "../servicios/turnosServicio.js";
import { errorCatch, turnoNoEncontrado } from "./funciones.js"; // Asegúrate de agregar turnoNoEncontrado
import apicache from 'apicache';

export default class TurnosControlador {
  constructor() {
    this.turnosServicio = new TurnosServicio();
  }

  buscarTodosTurnos = async (req, res) => {
    try {
      const turnos = await this.turnosServicio.buscarTodosTurnos(); 

      res.json({
        estado: true,
        datos: turnos,
      });

    } catch (err) {
      errorCatch('GET /turnos', err, res);
    }
  };

  buscarTurno = async (req, res) => {
    try {
      const turno_id = req.params.turno_id;
      const turno = await this.turnosServicio.buscarTurno(turno_id);

      if (!turno) {
        return turnoNoEncontrado(res);
      }

      res.json({
        estado: true,
        turno: turno,
      });
    } catch (err) {
        errorCatch('GET /turnos/:id', err, res);
    }
  };

  crearTurno = async (req, res) => {
    try {
      // CAMBIAMOS ESTO: para que coincida con los campos nuevos
      const { orden, hora_desde, hora_hasta } = req.body;
      const turno = { orden, hora_desde, hora_hasta };
      const nuevoTurno = await this.turnosServicio.crearTurno(turno);

      if (!nuevoTurno) {
        return res.status(404).json({
          estado: false,
          mensaje: "Turno no creado",
        });
      }

      res.status(201).json({
        estado: true,
        mensaje: `Turno agregado con éxito. Su id es: ${nuevoTurno.turno_id}`,
        turno: nuevoTurno
      });
      apicache.clear();

    } catch (err) {
        errorCatch('POST /turnos', err, res);
    }
  };

  modificarTurno = async (req, res) => {
    try {
      const turno_id = req.params.turno_id;
      const datos = req.body;

      const turnoModificado = await this.turnosServicio.modificarTurno(
        turno_id,
        datos
      );

      if (!turnoModificado) {
        return turnoNoEncontrado(res);
      }

      res.json({
        estado: true,
        mensaje: "Turno modificado!",
        turno: turnoModificado,
      });
      apicache.clear();

    } catch (err) {
        errorCatch('PUT /turnos/:id', err, res);
    }
  };

  eliminarTurno = async (req, res) => {
    try {
      const turno_id = req.params.turno_id;
      const dato = await this.turnosServicio.buscarTurno(turno_id);
      const eliminado = await this.turnosServicio.eliminarTurno(turno_id);

      if (!dato) { 
        return turnoNoEncontrado(res);
      }

      res.json({
        estado: true,
        mensaje: "Se eliminó el siguiente turno.",
        turno: dato,
      });
      apicache.clear();

    } catch (error) {
        errorCatch('DELETE /turnos/:id', error, res);
    }
  };
}