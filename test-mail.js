require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERCORREO,
    pass: process.env.PASSCORREO,
  },
});

async function testMail() {
  try {
    await transporter.sendMail({
      from: `"Test App" <${process.env.USERCORREO}>`,
      to: "vickybraidyavalos@gmail.com",
      subject: "🧪 Prueba de correo",
      text: "Este es un correo de prueba desde Node.js",
    });
    console.log("✅ Correo enviado correctamente");
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
  }
}

testMail();
