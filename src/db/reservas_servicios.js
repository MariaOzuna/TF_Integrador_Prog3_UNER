//completar clase ReservasServicios
import { conexion } from "./conexion.js";

export default class ReservasServicios{
    //esta clase se corresponde con la tabla reservas_servicios (tiene reserva_servicio_id, reserva_id, servicio_id, importe)

    agregarServicios = async (reserva_id, servicios) => {
        try{
            await conexion.beginTransaction();

            for(const servicio of servicios){
                const sql = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?,?,?);`;
                conexion.execute(sql, [reserva_id, servicio.servicio_id, servicio.importe]);
            }

            await conexion.commit();
            
            return true; //por ahora
        } catch (error){
            await conexion.rollback();
            console.log(`El error es: ${error}`);
            return false;
        }
    }
}