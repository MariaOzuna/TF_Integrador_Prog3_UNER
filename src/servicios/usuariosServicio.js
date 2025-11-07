import Usuarios from "../db/usuarios.js";

export default class UsuariosServicio{
    constructor(){
        this.usuarios = new Usuarios(); //instancio la clase usuarios de db
    }

    buscar = (nombre_usuario, contrasenia) => {
        return this.usuarios.buscar(nombre_usuario, contrasenia);
    }

    buscarPorId = (usuario_id) => {
        return this.usuarios.buscarPorId(usuario_id);
    }

    buscarTodosUsuarios = (rolSolicitante) => {
        //GET de todos los usuarios
        //defino este metodo para que sea usado por el controlador
        //pasamos el rol del solicitante a la capa de BD
        return this.usuarios.buscarTodosUsuarios(rolSolicitante);
    }

    buscarUsuario = (usuario_id) => {
        //se va pasando el usuario id por parametro
        return this.usuarios.buscarUsuario(usuario_id);
    }

    editarUsuario = (usuario_id, valores) => {
        const existe = this.usuarios.buscarUsuario(usuario_id);
        if (!existe) {
            return null;
        }
        return this.usuarios.editarUsuario(usuario_id, valores);
    }

    eliminarUsuario = (usuario_id) => {
        const existe = this.usuarios.buscarUsuario(usuario_id);
        if (!existe) {
            return null;
        }
        return this.usuarios.eliminarUsuario(usuario_id);
    }

    agregarUsuario = (valores) => {
        return this.usuarios.agregarUsuario(valores);
    }
}