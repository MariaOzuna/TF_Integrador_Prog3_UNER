// src/utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERCORREO,
    pass: process.env.PASSCORREO,
  },
});

const enviarCorreoTurno = async (correoDestino, turno) => {
  try {
    const mailOptions = {
      from: `"Reservas de Casas de Cumpleaños 🎉" <${process.env.USERCORREO}>`,
      to: correoDestino,
      subject: 'Confirmación de nuevo turno',
      html: `
        <div style="font-family: Arial; padding: 15px; border: 1px solid #ccc; border-radius: 10px;">
          <h2 style="color: green;">🎉 Confirmación de tu turno</h2>
          <p><b>Fecha:</b> ${turno.fecha}</p>
          <p><b>Hora:</b> ${turno.hora_desde} - ${turno.hora_hasta}</p>
          <p><b>Servicio:</b> ${turno.servicio}</p>
          <p><b>Estado:</b> ${turno.estado}</p>
          <br>
          <p>Gracias por reservar con nosotros 💚</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('📩 Correo enviado a:', correoDestino);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error.message);
  }
};

// 🔹 Exportar correctamente:
module.exports = { enviarCorreoTurno };
