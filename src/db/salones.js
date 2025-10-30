import { conexion } from "./conexion.js";

export default class Salones { 

    async buscarTodos() {
        const sql = 'SELECT * FROM salones WHERE activo = 1';
        return await conexion.execute(sql);
    }

    async buscarPorId(salon_id) {
        const sql = 'SELECT * FROM salones WHERE activo = 1 AND salon_id = ?';
        const [salon] = await conexion.execute(sql, [salon_id]);
        if (salon.length === 0) { return null; }
        return salon[0];
    }

    async crear(salon) {
        const { titulo, direccion, capacidad, importe } = salon;
        const sql = 'INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?,?,?,?)';
        const valores = [titulo, direccion, capacidad, importe];
        
        return await conexion.execute(sql, valores); 
    }

    async modificar(salon_id, datos) {
        const campos = Object.keys(datos);
        const valores = Object.values(datos);
        const setValores = campos.map(campo => `${campo} = ?`).join(', ');
        const parametros = [...valores, salon_id];

        const sql = `UPDATE salones SET ${setValores} WHERE salon_id = ?`;
        const [result] = await conexion.execute(sql, parametros);
        if (result.affectedRows === 0) { return null; }
        return this.buscarPorId(salon_id);
    }
    
    async eliminar(salon_id) {
        const sql = 'UPDATE salones SET activo = 0 WHERE salon_id = ?';
        const [result] = await conexion.execute(sql, [salon_id]);
        return result;
    }
}