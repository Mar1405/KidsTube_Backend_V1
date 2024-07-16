const Users = require('../Models/usersModel');


const AdminPost = async (req, res) => {
    const { pin, userid } = req.body;

    try {
        const user = await Users.findOne({ userid});
        if (!user) {
            return res.status(404).json({ error: 'Pin incorrecto' });
            
        }
        if ((pin === user.pin)) {
             return res.status(200).json({ message: 'Pin correcto', userid: user._id });
            
        }
        return res.status(401).json({ error: 'Datos erroneos ,verifica tus datos!!!' });
   
    } catch (error) {
        console.error('Error al intentar acceder como administrador', error);
        return res.status(500).json({ error: 'Hubo un error al intentar acceder como administrador' });
    }
};

module.exports = {
    AdminPost
};