const jwt = require('jsonwebtoken');
const Users = require('../Models/usersModel');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, SECRET_KEY, async (err, user) => {
                if (err) {
                    return res.status(403).json({ error: 'JWT Inválido.' });
                }

                user = await Users.findOne({jwt: token});

                // Si no encuentra un usuario con este jwt, devuelve error
                if (!user) {
                    return res.status(404).json({ error: 'No existe este JWT' });
                    
                }
                else {
                    return res.status(200).json({ message: 'JWT existente y correcto.' });
                }
            });
        } else {
            res.status(401).json({ error: 'JWT no encontrado' });
        }
    } catch (error) {
        console.error('Error al verificar el JWT:', error.message);
        return res.status(500).json({ error: `Hubo un error al verificar el JWT: ${error.message}` });
    }
};

module.exports = { authenticateJWT };
