import { escape } from "mysql2";
import UsuariosServicio from "../servicios/usuariosServicio.js";
import { errorCatch } from "./funciones.js";
import { usuarioNoEncontrado } from "./funciones.js";
import apicache from 'apicache';

//para notificar mail
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import path, { dirname } from 'path';
import handlebars from 'handlebars';

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
            apicache.clear();
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

            if(!dato){
                //hacer funcion para esto
                return usuarioNoEncontrado(res);
            }
            res.json({
                estado: true,
                mensaje: "Se eliminó al siguiente usuario usuario eliminado.",
                usuario: dato
            })
            apicache.clear();
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
            apicache.clear();
            this.notificacionCreacion(nombre, apellido, nombre_usuario, tipo_usuario); //se envia notificacion al administrador
            
        } catch (error) {
            errorCatch('POST', error, res);
        }
    }

    notificacionCreacion = async (nombre, apellido, nombre_usuario, tipo_usuario) => {
        //envio de notificacion al administrador con posibilidad de eliminar creacion de usuario
        
        process.loadEnvFile();
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename); //obtener ruta del archivo
        const plantilla = path.join(__dirname, '..', 'utiles', 'handlebars', 'plantilla.hbs');

        // leo la plantilla handlebars, compilo y le paso los datos que llegaron
        const archivoHbs = await readFile(plantilla, 'utf-8');
        const template = handlebars.compile(archivoHbs);

        var html = template(
            {   nombre: nombre,
                apellido: apellido,
                nombre_usuario: nombre_usuario,
                tipo_usuario: tipo_usuario
            }
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USERCORREO,
                pass: process.env.PASSCORREO,
            },
        });

        const opciones = {
            to: nombre_usuario, //deberia ir dirigido al administrador
            subject: 'Notificacion nuevo usuario creado',
            html: html
        }

        transporter.sendMail(opciones, (error, info) => {
            // envío el correo electronico - revisar esta res.json
            if(error){
                res.json({
                    'ok': false, 
                    'mensaje': 'Error al enviar el correo.'
                });
            }
            res.json({
                'ok': true,
                'mensaje': 'Correo enviado!'
            });
        });
    }
}