const nodemailer = require('nodemailer');

// Configura el transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail', // Cambia esto según tu proveedor de correo
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para enviar correo
const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
};

module.exports = sendEmail;
