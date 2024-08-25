const crypto = require('crypto');
const Users = require('../Models/usersModel');
const { sendSMS } = require('./sendSms');

const generateVerificationCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // Código alfanumérico de 6 caracteres
};

const generateCode = async (req, res) => {
    const { userId } = req.body;

    try {
        // Buscar el usuario en la base de datos por ID
        const user = await Users.findById(userId);

        if (!user) {
            console.log('Usuario no encontrado:', userId);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Generar y enviar un nuevo código si el usuario está "active" y no ha ingresado uno
        const newVerificationCode = generateVerificationCode();
        user.verificationCode = newVerificationCode;
        user.verificationCodeExpiration = Date.now() + 15 * 60 * 1000; // Expira en 15 minutos
        await user.save();

        const smsMessage = `Tu código de verificación es: ${newVerificationCode}`;
        const formattedPhoneNumber = `+${user.number_phone.replace(/\s+/g, '')}`;
        await sendSMS(formattedPhoneNumber, smsMessage);

        return res.status(200).json({ message: 'Se ha enviado un SMS con el código de verificación. Por favor, ingresa el código para completar la verificación.', userId: user._id });
    } catch (error) {
        console.error('Error al intentar hacer login:', error.message);
        return res.status(500).json({ error: `Hubo un error al intentar hacer login: ${error.message}` });
    }
};

module.exports = {
    generateCode
};