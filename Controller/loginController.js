const crypto = require('crypto');
const Users = require('../Models/usersModel');
const { sendSMS } = require('./sendSms');

const generateVerificationCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // Código de 6 dígitos
};

const loginPost = async (req, res) => {
    const { email, password, verificationCode } = req.body;

    try {
        const user = await Users.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        if (user.status === 'pending') {
            return res.status(403).json({ error: 'Tu cuenta está pendiente de verificación. Por favor, verifica tu correo electrónico.' });
        }

        if (user.status === 'verified') {
            return res.status(200).json({ message: 'Login exitoso. Tu cuenta ya está verificada.', userId: user._id });
        }

        if (user.status === 'active') {
            if (verificationCode) {
                // Imprimir ambos códigos para depuración
                console.log('Código ingresado:', verificationCode);
                console.log('Código guardado:', user.verificationCode);
        
                // Aquí se verifica el código si ya fue ingresado
                if (user.verificationCode !== verificationCode) {
                    return res.status(400).json({ error: 'Código de verificación incorrecto' });
                }
        
                if (Date.now() > user.verificationCodeExpiration) {
                    return res.status(400).json({ error: 'El código de verificación ha expirado' });
                }
        
                // Limpiar el código de verificación y su expiración
                user.verificationCode = null;
                user.verificationCodeExpiration = null;
        
                // Cambiar el estado del usuario a 'verified'
                user.status = 'verified';
                await user.save();
        
                return res.status(200).json({ message: 'Código de verificación exitoso. Tu cuenta ha sido activada.' });
            } else {
                // Generar y enviar un nuevo código si el usuario está "active" y no ha ingresado uno
                const newVerificationCode = generateVerificationCode();
                user.verificationCode = newVerificationCode;
                user.verificationCodeExpiration = Date.now() + 15 * 60 * 1000; // Expira en 15 minutos
                await user.save();
        
                const smsMessage = `Tu código de verificación es: ${newVerificationCode}`;
                const formattedPhoneNumber = `+${user.number_phone.replace(/\s+/g, '')}`;
                await sendSMS(formattedPhoneNumber, smsMessage);
        
                return res.status(200).json({ message: 'Se ha enviado un SMS con el código de verificación. Por favor, ingresa el código para completar la verificación.', userId: user._id });
            }
        }

        return res.status(400).json({ error: 'Estado del usuario no válido para verificación' });

    } catch (error) {
        console.error('Error al intentar hacer login:', error);
        return res.status(500).json({ error: `Hubo un error al intentar hacer login: ${error.message}` });
    }
};

module.exports = {
    loginPost
};
