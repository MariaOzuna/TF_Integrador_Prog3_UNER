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

  buscarTodosUsuarios = async (rolSolicitante) => {
    //GET de todos los usuarios
    let sql = "";

    if (rolSolicitante === 1) {
        // Rol 1 (Admin) ve a TODOS los usuarios activos
        sql = "SELECT * FROM usuarios WHERE activo = 1";
    } else {
        // Rol 2 (Empleado) ve SOLO a los Clientes (Rol 3) activos
        sql = "SELECT * FROM usuarios WHERE activo = 1 AND tipo_usuario = 3";
    }

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
    const clavesParaEditar = Object.keys(valores); //me quedo con las claves que mande el cliente
    const valoresParaEditar = Object.values(valores); //me quedo con los valores que mande el cliente
    const setValores = clavesParaEditar
      .map((clave) => `${clave} = ?`)
      .join(", "); //armo la consulta set en base a lo recibido
    const parametros = [...valoresParaEditar, usuario_id];

    const sql = `UPDATE usuarios
                        SET ${setValores}
                        WHERE usuario_id = ?`;
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
    const sql = `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario) VALUES(?,?,?,?,?);`;
    const nuevoUsuario = await conexion.execute(sql, valores);
    return nuevoUsuario;
  };
}
