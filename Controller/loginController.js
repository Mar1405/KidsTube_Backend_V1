const Users = require('../Models/usersModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

const loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar la contraseña de manera segura
        if (user.password !== password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '2m' });
        user.jwt = token;
        await user.save();

        // Validar el estado del usuario
        switch (user.status) {
            case 'pending':
                return res.status(403).json({ error: 'Tu cuenta está pendiente de verificación. Por favor, verifica tu correo electrónico.' });

            case 'verified':
                return res.status(200).json({ message: 'Login exitoso. Tu cuenta ya está verificada.', userId: user._id });
                

            case 'active':
                return res.status(200).json({ message: 'Se ha enviado un SMS con el código de verificación. Por favor, ingresa el código para completar la verificación.', userId: user._id });
                
            default:
                return res.status(400).json({ error: 'Estado del usuario no válido para verificación' });
        }
    } catch (error) {
        console.error('Error al intentar hacer login:', error.message);
        return res.status(500).json({ error: `Hubo un error al intentar hacer login: ${error.message}` });
    }
};

module.exports = {
    loginPost
};