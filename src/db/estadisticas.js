import { conexion } from "./conexion.js";

// Esta clase habla con la base de datos
export default class Estadisticas {
    llamarSP = async () => {
        const sql = 'CALL sp_estadisticas_salon()';
        
        // Ejecutamos la llamada
        const [rows] = await conexion.execute(sql);
        return rows[0]; 
    }
}