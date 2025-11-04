import { conexion } from "./conexion.js";

export default class Servicios {
    buscarTodosServicios = async () => {
        //GET de todos los servicios
        const sql = 'SELECT * FROM servicios WHERE activo = 1';
        const [servicios] = await conexion.execute(sql);
        return servicios; //se lo retorna al servicio
    }

    buscarServicio = async (servicio_id) => {
        //GET para obtener un servicio por id
        //recibe por parametro el id que viene de los params
        const sql = `SELECT * FROM servicios WHERE activo = 1 AND servicio_id = ?`;
        const [servicio] = await conexion.execute(sql, [servicio_id]);
        if(servicio.length === 0) {
            return null;
        }
        return servicio[0];
    }

    editarServicio = async (servicio_id, valores) => {
        const clavesParaEditar = Object.keys(valores); //me quedo con las claves que mande el cliente
        const valoresParaEditar = Object.values(valores); //me quedo con los valores que mande el cliente
        const setValores = clavesParaEditar.map((clave) => `${clave} = ?`).join(', '); //armo la consulta set en base a lo recibido
        const parametros = [...valoresParaEditar, servicio_id];

        const sql = `UPDATE servicios
                        SET ${setValores}
                        WHERE servicio_id = ?`;
        const [resultado] = await conexion.execute(sql, parametros);
        if(resultado.affectedRows === 0) {
            return null;
        }
        return this.buscarServicio(servicio_id);
    }

    eliminarServicio = async (servicio_id) => {
        const sql = `UPDATE servicios
                        SET activo = 0
                        WHERE servicio_id = ?`;
        const [servicioEliminado] = await conexion.execute(sql, [servicio_id]);
        return servicioEliminado; 
    }

    agregarServicio = async (servicio) => {
        const { descripcion, importe } = servicio;
        const sql = `INSERT INTO servicios (descripcion, importe) VALUES(?,?);`
        const [nuevoServicio] = await conexion.execute(sql, [descripcion, importe]);

        if (nuevoServicio.affectedRows === 0) {
            return null;
        }
        return this.buscarServicio(nuevoServicio.insertId);
    
    }
}