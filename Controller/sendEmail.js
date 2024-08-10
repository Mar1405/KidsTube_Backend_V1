const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'marlenymolina39@example.com',
  subject: 'Prueba de Envío de Correo',
  text: 'Este es un correo de prueba para verificar el funcionamiento del servicio.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar correo:', error);
  } else {
    console.log('Correo enviado:', info.response);
  }
});
