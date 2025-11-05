import { conexion } from "./conexion.js";

export default class Turnos {

    buscarTodosTurnos = async () => {
        //GET de todos los turnos
        const sql = 'SELECT * FROM turnos WHERE activo = 1';
        const [turnos] = await conexion.execute(sql);
        return turnos; //se lo retorna al servicio
    }

    buscarPorId = async (turno_id) => {
        //GET para obtener un turno por id
        const sql = `SELECT * FROM turnos WHERE activo = 1 AND turno_id = ?`;
        const [turno] = await conexion.execute(sql, [turno_id]);
        if(turno.length === 0) {
            return null;
        }
        return turno[0];
    }

    crearTurno = async (turno) =>{
        const { descripcion } = turno;
        const sql = `INSERT INTO turnos (descripcion) VALUES(?);`
        const [nuevoTurno] = await conexion.execute(sql, [descripcion]);

        if (nuevoTurno.affectedRows === 0) {
            return null;
        }
        return this.buscarPorId(nuevoTurno.insertId);
    }

    modificarTurno = async (turno_id, datos) =>{
        const clavesParaEditar = Object.keys(datos); 
        const valoresParaEditar = Object.values(datos); 
        const setValores = clavesParaEditar.map((clave) => `${clave} = ?`).join(', ');
        const parametros = [...valoresParaEditar, turno_id];

        const sql = `UPDATE turnos
                        SET ${setValores}
                        WHERE turno_id = ?`;
        const [resultado] = await conexion.execute(sql, parametros);
        if(resultado.affectedRows === 0) {
            return null;
        }
        return this.buscarPorId(turno_id);
    }
    
    eliminarTurno = async (turno_id) => {
        const sql = `UPDATE turnos
                        SET activo = 0
                        WHERE turno_id = ?`;
        const [turnoEliminado] = await conexion.execute(sql, [turno_id]);
        return turnoEliminado; 
    }
}