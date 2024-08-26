const Users = require('../Models/usersModel');
const { logout } = require('../Controller/sesionController');


const AdminPost = async (req, res) => {
    const { userId, pin } = req.body;

    try {
        const user = await Users.findOne({"_id": userId});

        // Verificar el jwt primeramente
        const verificacion_jwt = await fetch('http://localhost:3001/api/authenticate-jwt', {
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + user.jwt
            }
        });

        const result = await verificacion_jwt.json();
        // Si el resultado de la llamada al endpoint de verificación de token es exitosa, proceda con la validación del pin
        // Si no, devuelva un error con el mismo mensaje que devuelve el endpoint de authenticate-jwt
        if (verificacion_jwt.ok) {

            if (!user) {
                return res.status(404).json({ error: 'Pin incorrecto' });
                
            }
            if ((pin === user.pin)) {
                return res.status(200).json({ message: 'Pin correcto', userid: user._id });
                
            }
            return res.status(401).json({ error: 'Datos erroneos ,verifica tus datos!!!' });
        }
        else {
            return logout(req, res);
            
        }
   
    } catch (error) {
        console.error('Error al intentar acceder como administrador', error);
        return res.status(500).json({ error: 'Hubo un error al intentar acceder como administrador' });
    }
};

module.exports = {
    AdminPost
};