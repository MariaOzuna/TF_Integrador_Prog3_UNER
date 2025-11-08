import ServiciosServicio from "../servicios/serviciosServicio.js";

export default class ServiciosControlador {
  constructor() {
    this.serviciosServicio = new ServiciosServicio();
  }

  buscarTodosServicios = async (req, res) => {
    try {
      const servicios = await this.serviciosServicio.buscarTodosServicios(); //busca en serviciosServicio y los guarda en servicios

      res.json({
        //devuelve la respusta
        estado: true,
        datos: servicios,
      });

      
    } catch (err) {
      //captura el error de conexion a la bd o cualquier otro error
      console.log("Error en GET /servicios", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  buscarServicio = async (req, res) => {
    try {
      const servicio_id = req.params.servicio_id;
      const servicio = await this.serviciosServicio.buscarServicio(servicio_id);

      if (!servicio) {
        return res.status(404).json({
          estado: false,
          mensaje: "servicio no encontrado.",
        });
      }

      res.json({
        estado: true,
        servicio: servicio,
      });
    } catch (err) {
      console.log("Error en GET /servicios/:servicio_id", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  editarServicio = async (req, res) => {
    try {
      const servicio_id = req.params.servicio_id;
      const datos = req.body;

      const servicioModificado = await this.serviciosServicio.editarServicio(
        servicio_id,
        datos
      );

      if (!servicioModificado) {
        return res.status(404).json({
          estado: false,
          mensaje: "servicio no encontrado para ser modificado.",
        });
      }

      res.json({
        estado: true,
        mensaje: "servicio modificado!",
        servicio: servicioModificado,
      });
    } catch (err) {
      console.log("Error en PUT /servicios/:servicio_id", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  agregarServicio = async (req, res) => {
    try {
      const { descripcion, importe } = req.body;
      const servicio = {descripcion,importe};
      const nuevoServicio = await this.serviciosServicio.agregarServicio(servicio);

      if (!nuevoServicio) {
        return res.status(404).json({
          estado: false,
          mensaje: "servicio no creado",
        });
      }

      res.status(201).json({
        estado: true,
        mensaje: `Servicio agregado con éxito. Su id es: ${nuevoServicio.servicio_id}`,
        servicio: nuevoServicio
      });
    } catch (err) {
      console.log("Error en POST /servicios/", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor."
      });
    }
  };

  eliminarServicio = async (req, res) => {
    //DELETE para eliminar logicamente a un servicio
    try {
      const servicio_id = req.params.servicio_id;
      const dato = await this.serviciosServicio.buscarServicio(servicio_id);
      const eliminado = await this.serviciosServicio.eliminarServicio(servicio_id);

      if (!dato) {
        return res.status(404).json({
         estado: false,
         mensaje: 'Servicio no encontrado en la base de datos.'
        });
      
      }
    res.json({
      estado: true,
      mensaje: "Se eliminó al siguiente servicio.",
      servicio: dato,
      });
      
    } catch (error) {
      console.log("Error en DELETE /servicios/:servicio_id", error);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };
}
