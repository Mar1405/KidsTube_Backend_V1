const jwt = require('jsonwebtoken');
const Users = require('../Models/usersModel');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

// Endpoint para cerrar sesión
const logout = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            // Intentar verificar el JWT
            const decoded = jwt.verify(token, SECRET_KEY);

            // Buscar el usuario por token JWT
            const user = await Users.findOne({ jwt: token });

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            // Vaciar el JWT almacenado en la base de datos
            user.jwt = '';
            await user.save();

            return res.status(200).json({ message: 'Sesión Expirada. Redirijase al login...' });

        } catch (error) {
            console.error('Error al intentar cerrar sesión:', error.message);

            // Si el JWT es inválido o ha expirado, intenta vaciar el JWT de la base de datos
            const user = await Users.findOne({ jwt: token });
            if (user) {
                user.jwt = null;
                await user.save();
            }

            // Considera el token como inválido o expirado y redirige al login
            return res.status(403).json({ error: 'JWT Inválido o expirado. Vueva a loguearse...' });
        }
    } else {
        res.status(401).json({ error: 'JWT no encontrado' });
    }
};

module.exports = {
    logout
};
