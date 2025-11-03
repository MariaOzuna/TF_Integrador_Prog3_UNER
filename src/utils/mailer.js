import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERCORREO,
    pass: process.env.PASSCORREO
  }
});

export const enviarCorreoTurno = async (correoDestino, turno) => {
  try {
    await transporter.sendMail({
      from: `"Reservas" <${process.env.USERCORREO}>`,
      to: correoDestino,
      subject: 'Confirmación de turno',
      html: `<div>
        <h3>Turno confirmado</h3>
        <p><b>Fecha:</b> ${turno.fecha}</p>
        <p><b>Hora:</b> ${turno.hora_desde} - ${turno.hora_hasta}</p>
        <p><b>Servicio:</b> ${turno.servicio}</p>
        <p><b>Estado:</b> ${turno.estado}</p>
      </div>`
    });
    console.log('📩 Correo enviado a', correoDestino);
  } catch (err) {
    console.error('❌ Error al enviar correo:', err.message);
  }
};
