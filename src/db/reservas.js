import { conexion } from "./conexion.js";

export default class Reservas {
    
    //Browse: Obtiene todas las reservas
    buscarTodasLasReservas = async () => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1';
        const [reservas] = await conexion.execute(sql);
        return reservas; 
    }

    //Read: Obtiene reserva por id
    buscarReserva = async (reserva_id) => {
        const sql = `SELECT * FROM reservas WHERE activo = 1 AND reserva_id = ?`;
        const [reserva] = await conexion.execute(sql, [reserva_id]);
        if(reserva.length === 0) {
            return null;
        }
        return reserva[0]; 
    }

    //Add: Agrega nueva reserva
    agregarReserva = async (reserva) => {
        const {fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total} = reserva;
        const sql = `INSERT INTO reservas (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) VALUES(?,?,?,?,?,?,?,?)`;
        
        const [resultado] = await conexion.execute(sql, [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]);
        if(resultado.affectedRows === 0){
            return null;
        }

        return this.buscarReserva(resultado.insertId);
    }
    //Edit: modifica una reserva
    editarReserva = async (reserva_id, valores) => {
        const clavesParaEditar = Object.keys(valores);
        const valoresParaEditar = Object.values(valores);
        const setValores = clavesParaEditar.map((clave) => `${clave} = ?`).join(', ');
        const parametros = [...valoresParaEditar, reserva_id];
        const sql = `UPDATE reservas
                        SET ${setValores}
                        WHERE reserva_id = ?`;
        
        const [resultado] = await conexion.execute(sql, parametros);
        
        if(resultado.affectedRows === 0) {
            return null;
        }
        // retornamos la reserva actualizada
        return this.buscarReserva(reserva_id);
    }
    
    //Delete: Eliminado lógico de reserva
    eliminarReserva = async (reserva_id) => {
        const sql = `UPDATE reservas 
                        SET activo = 0
                        WHERE reserva_id = ?`;
        const [reservaEliminada] = await conexion.execute(sql, [reserva_id]);
        return reservaEliminada;
    }

    // Busca datos
    buscarDatosReporte = async () => {
        const sql = 'CALL sp_reporte_reservas_detalle()'; 
        const [rows] = await conexion.execute(sql);
        return rows[0]; 
    }

    datosParaNotificacion = async (reserva_id) => {
        const sql = `CALL obtenerDatosNotificacion(?)`;

        const [reserva] = await conexion.execute(sql, [reserva_id]);
        if(reserva.length === 0){
            return null;
        }
        return reserva;
    }
}
