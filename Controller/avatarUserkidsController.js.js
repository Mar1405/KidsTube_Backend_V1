const Users = require('../Models/usersKidsModels');

const AvatarPost = async (req, res) => {
    const { avatarName, password } = req.body;

    try {
        // Busca el usuario por el nombre del avatar y la contraseña proporcionada
        const user = await Users.findOne({name: avatarName, password });
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'Nombre de avatar o contraseña incorrectos' });
        }

        // Si se encuentra el usuario con el nombre de avatar y la contraseña coincidente
        return res.status(200).json({ message: 'Contraseña correcta!' });
        

    } catch (error) {
        console.error('Error al intentar acceder como avatar', error);
        return res.status(500).json({ error: 'Hubo un error al intentar acceder como avatar' });
    }
};

module.exports = {
    AvatarPost
};
