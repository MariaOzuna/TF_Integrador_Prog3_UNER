//importo para enviar mail y leer archivo
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import path, { dirname } from 'path';
import handlebars from 'handlebars';

export default class NotificacionesServicio{

    enviarCorreo = async (datosCorreo) => {
        process.loadEnvFile();
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename); //obtener ruta del archivo
        const plantilla = path.join(__dirname, '..', 'utiles', 'handlebars', 'plantilla.hbs');

        // leo la plantilla handlebars, compilo y le paso los datos que llegaron
        const archivoHbs = await readFile(plantilla, 'utf-8');
        const template = handlebars.compile(archivoHbs);

        const datos = {
            fecha: datosCorreo[0].map(a => a.fecha),
            salon: datosCorreo[0].map(a => a.salon),
            turno: datosCorreo[0].map(a => a.turno)
        };

        const correoHtml = template(datos);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USERCORREO,
                pass: process.env.PASSCORREO
            }
        });

        const correoAdmin = datosCorreo[1].map(a => a.correoAdmin);
        const correoCliente = datosCorreo[0].map(a => a.correoCliente).join();
        const destinatarios = correoAdmin.join(', ');

        const opciones = {
            from: process.env.USERCORREO,
            to: correoCliente, 
            cc: destinatarios,
            subject: 'Notificacion de reserva creada',
            html: correoHtml
        }

        transporter.sendMail(opciones, (error, info) => {
            // envío el correo electronico
            if(error){
                console.log(`Error enviado el correo`, error);       
                return false;
            }
            return true;
        });
    }
}