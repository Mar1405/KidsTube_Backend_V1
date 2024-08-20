const Users = require('../Models/usersModel');

const verifyCode = async (req, res) => {
    const { userId, verificationCode } = req.body;

    try {
        // Buscar el usuario en la base de datos por ID
        const user = await Users.findById(userId);

        if (!user) {
            console.log('Usuario no encontrado:', userId);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log('Código de verificación en la base de datos:', user.verificationCode);
        console.log('Código de verificación recibido:', verificationCode);

        // Verificar si el código enviado coincide con el guardado
        if (user.verificationCode.trim() !== verificationCode.trim()) {
            return res.status(400).json({ error: 'Código de verificación incorrecto' });
        }
        // Verificar si el código ha expirado
        console.log('Fecha de expiración del código:', new Date(user.verificationCodeExpiration));
        console.log('Fecha actual:', new Date());

        if (Date.now() > user.verificationCodeExpiration) {
            return res.status(400).json({ error: 'El código de verificación ha expirado' });
        }

        // Limpiar el código de verificación y su expiración
        user.verificationCode = null;
        user.verificationCodeExpiration = null;

        // Cambiar el estado del usuario a 'verified'
        user.status = 'verified';

        // Guardar los cambios en la base de datos
        await user.save();

        return res.status(200).json({ message: 'Código de verificación exitoso. Tu cuenta ha sido activada.' });

    } catch (error) {
        console.error('Error al verificar el código:', error);
        return res.status(500).json({ error: `Hubo un error al verificar el código: ${error.message}` });
    }
};

module.exports = {
    verifyCode
};
