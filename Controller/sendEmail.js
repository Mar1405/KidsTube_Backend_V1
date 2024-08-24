const sgMail = require('@sendgrid/mail');//modificar karen
sgMail.setApiKey(process.env.SENDGRID_API_KEY);//modificar karen

const sendVerificationEmail = async (toEmail, verificationLink) => {
    const msg = {
        to: toEmail,
        from: process.env.EMAIL_USER, // El correo que desees utilizar como remitente
        subject: 'Verificación de correo electrónico',
        text: `Por favor, verifique su correo electrónico haciendo clic en el siguiente enlace: ${verificationLink}`,
        html: `<strong>Por favor, verifique su correo electrónico haciendo clic en el siguiente enlace:</strong> <a href="${verificationLink}">${verificationLink}</a>`,
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        // Registrar el error sin detalles del destinatario
        console.error('Error al enviar el correo de verificación:', error.message);

        // Verifica si el error proviene de la respuesta de SendGrid
        if (error.response) {
            console.error('Detalles del error de SendGrid:', error.response.body.errors);
        }
    }
};

module.exports = { sendVerificationEmail };
