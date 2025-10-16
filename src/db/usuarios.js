import { conexion } from "./conexion.js";

export default class Usuarios {
    buscarTodosUsuarios = async () => {
        //GET de todos los usuarios
        const sql = 'SELECT * FROM usuarios WHERE activo = 1';
        const usuarios = await conexion.execute(sql);
        return usuarios; //se lo retorna al servicio
    }

    buscarUsuario = async (usuario_id) => {
        //GET para obtener un usuario por id
        //recibe por parametro el id que viene de los params
        const sql = `SELECT * FROM usuarios WHERE activo = 1 AND usuario_id = ?`;
        const [usuario] = await conexion.execute(sql, [usuario_id]);
        if(usuario.length === 0) {
            return null;
        }
        return usuario[0];
    }

    editarUsuario = async (usuario_id, valores) => {
        const clavesParaEditar = Object.keys(valores); //me quedo con las claves que mande el cliente
        const valoresParaEditar = Object.values(valores); //me quedo con los valores que mande el cliente
        const setValores = clavesParaEditar.map((clave) => `${clave} = ?`).join(', '); //armo la consulta set en base a lo recibido
        const parametros = [...valoresParaEditar, usuario_id];

        const sql = `UPDATE usuarios
                        SET ${setValores}
                        WHERE usuario_id = ?`;
        const [resultado] = await conexion.execute(sql, parametros);
        if(resultado.affectedRows === 0) {
            return null;
        }
        return this.buscarUsuario(usuario_id);
    }

    eliminarUsuario = async (usuario_id) => {
        const sql = `UPDATE usuarios 
                        SET activo = 0
                        WHERE usuario_id = ?`;
        const [usuarioEliminado] = await conexion.execute(sql, [usuario_id]);
        return usuarioEliminado; //modifiqué esto para que muestre el borrado
    }

    agregarUsuario = async (valores) => {
        const sql = `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario) VALUES(?,?,?,?,?);`
        const nuevoUsuario = await conexion.execute(sql, valores);
        return nuevoUsuario;
    }
}