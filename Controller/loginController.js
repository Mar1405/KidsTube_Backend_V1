const Users = require('../Models/usersModel');
const crypto = require('crypto');
const { sendVerificationEmail } = require('./sendEmail'); // Asegúrate de importar tu módulo de envío de correos

const loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email: email.toLowerCase() });

        if (!user || user.password !== password) {
            return res.status(404).json({ error: 'Credenciales inválidas' });
        }

        // Verificar si el usuario está en estado pendiente
        if (user.status === 'pending') {
            return res.status(403).json({ error: 'Tu cuenta está pendiente de verificación. Por favor, verifica tu correo electrónico.' });
        }

        // Generar un código de verificación para 2FA
        const verificationCode = crypto.randomBytes(3).toString('hex'); // Código de 6 dígitos
        user.verificationCode = verificationCode;
        await user.save();

        // Enviar el código de verificación al correo del usuario
        const verificationLink = `http://localhost:3001/api/users/verify-code/${user._id}`;
        await sendVerificationEmail(user.email, verificationLink);

        return res.status(200).json({ message: 'Login exitoso. Verifica tu correo electrónico para continuar.', userId: user._id });
    } catch (error) {
        console.error('Error al intentar hacer login:', error);
        return res.status(500).json({ error: 'Hubo un error al intentar hacer login' });
    }
};

module.exports = {
    loginPost
};
