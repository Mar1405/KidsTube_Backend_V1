const Users = require('../Models/usersModel');


const loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ error: 'Credenciales inválidas' });
        }

        const isMatch = bcryptjs.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        res.status(200).json({ message: 'Login exitoso', userid: user._id });
    } catch (error) {
        console.error('Error al intentar hacer login:', error);
        res.status(500).json({ error: 'Hubo un error al intentar hacer login' });
    }
};

module.exports = {
    loginPost
};
