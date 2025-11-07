import { conexion } from "./conexion.js";

export default class Usuarios {
  buscar = async (nombre_usuario, contrasenia) => {
    const sql = `SELECT u.usuario_id, CONCAT(u.nombre, ' ', u.apellido) as usuario, u.tipo_usuario
                            FROM usuarios  AS u
                            WHERE u.nombre_usuario = ? 
                                AND u.contrasenia = SHA2(?, 256) 
                                AND u.activo = 1;`;
    const [result] = await conexion.query(sql, [nombre_usuario, contrasenia]);
    return result[0];
  };

  buscarPorId = async (usuario_id) => {
    const sql = `SELECT CONCAT(u.nombre, ' ', u.apellido) as usuario, u.tipo_usuario, u.usuario_id
                            FROM usuarios  AS u
                            WHERE u.usuario_id = ? AND u.activo = 1;`;
    const [result] = await conexion.query(sql, [usuario_id]);
    return result[0];
  };

  buscarTodosUsuarios = async () => {
    //GET de todos los usuarios
    const sql = "SELECT * FROM usuarios WHERE activo = 1";
    const usuarios = await conexion.execute(sql);
    return usuarios; //se lo retorna al servicio
  };

  buscarUsuario = async (usuario_id) => {
    //GET para obtener un usuario por id
    //recibe por parametro el id que viene de los params
    const sql = `SELECT * FROM usuarios WHERE activo = 1 AND usuario_id = ?`;
    const [usuario] = await conexion.execute(sql, [usuario_id]);
    if (usuario.length === 0) {
      return null;
    }
    return usuario[0];
  };

  editarUsuario = async (usuario_id, valores) => {
    const clavesParaEditar = Object.keys(valores);
    const valoresParaEditar = Object.values(valores);

    // Modificar la consulta para aplicar SHA2 a la contraseña si está presente
    const setValores = clavesParaEditar.map((clave) => {
        if (clave === 'contrasenia') {
            return `${clave} = SHA2(?, 256)`; // Aplicar SHA2 a la contraseña
        } else {
            return `${clave} = ?`;
        }
    }).join(", ");

    const parametros = [...valoresParaEditar, usuario_id];
    const sql = `UPDATE usuarios SET ${setValores} WHERE usuario_id = ?`;

    const [resultado] = await conexion.execute(sql, parametros);
    if (resultado.affectedRows === 0) {
        return null;
    }
    return this.buscarUsuario(usuario_id);
  };

  eliminarUsuario = async (usuario_id) => {
    const sql = `UPDATE usuarios 
                        SET activo = 0
                        WHERE usuario_id = ?`;
    const [usuarioEliminado] = await conexion.execute(sql, [usuario_id]);
    return usuarioEliminado; //modifiqué esto para que muestre el borrado
  };

  agregarUsuario = async (valores) => {
    const sql = `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario)
                 VALUES(?, ?, ?, SHA2(?, 256), ?);`;
    const nuevoUsuario = await conexion.execute(sql, valores);
    return nuevoUsuario;
  };

}
