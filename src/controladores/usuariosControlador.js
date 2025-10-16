import { escape } from "mysql2";
import UsuariosServicio from "../servicios/usuariosServicio.js";
import { errorCatch } from "./funciones.js";
import { usuarioNoEncontrado } from "./funciones.js";

export default class UsuariosControlador{
    constructor(){
        this.usuariosServicio = new UsuariosServicio();
    }

    buscarTodosUsuarios = async (req, res) => {
        //GET de todos los usuarios
        try{
            const [datos, campos] = await this.usuariosServicio.buscarTodosUsuarios();
            res.json({
                estado: true,
                usuarios: datos
            });
        } catch (error) {
            errorCatch('GET', error, res);
        }
    }

    buscarUsuario = async (req, res) => {
        //GET para obtener un usuario por id
        try {
            const usuario_id = req.params.usuario_id;
            const usuario = await this.usuariosServicio.buscarUsuario(usuario_id); //aca se envia por parametro el id del params

            if(!usuario){
                return usuarioNoEncontrado(res);
            }
            res.json({
                estado: true,
                usuario: usuario
            });
        } catch (error) {
            errorCatch('GET', error, res);
        }
    }

    editarUsuario = async(req, res) => {
        //PUT para editar los datos de un usuario
        try{
            const usuario_id = req.params.usuario_id;
            const valores = req.body;
            const usuarioEditado = await this.usuariosServicio.editarUsuario(usuario_id, valores);

            if(!usuarioEditado){
                return usuarioNoEncontrado(res);
            }
            res.json({
                estado: true,
                usuario: usuarioEditado,
                mensaje: "usuario modificado con éxito"
            });
        } catch (error) {
            errorCatch('PUT', error, res);
        }
    }

    eliminarUsuario = async (req, res) => {
        //DELETE para eliminar logicamente a un usuario
        try{
            const usuario_id = req.params.usuario_id;
            const dato = await this.usuariosServicio.buscarUsuario(usuario_id);
            const eliminado = await this.usuariosServicio.eliminarUsuario(usuario_id);

            if(!eliminado){
                //hacer funcion para esto
                return usuarioNoEncontrado(res);
            }
            res.json({
                estado: true,
                mensaje: "Se eliminó al siguiente usuario usuario eliminado.",
                usuario: dato
            })
        } catch (error) {
            errorCatch('DELETE', error, res);
        }
    }

    agregarUsuario = async (req, res) => {
        try {
            const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario} = req.body;
            const valores = [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario];
            const [agregado] = await this.usuariosServicio.agregarUsuario(valores);

            res.json({
                estado: true,
                mensaje: `usuario agregado con éxito. Su id es: ${agregado.insertId}`,
                usuario: agregado
            });
            
        } catch (error) {
            errorCatch('POST', error, res);
        }
    }
}