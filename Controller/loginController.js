const Users = require('../Models/usersModel');


const loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log(user);
            return res.status(404).json({ error: 'Credenciales inválidas' });
            
        }

        if ((password === user.password)) {
             return res.status(200).json({ message: 'Login exitoso', userid: user._id });
            
        }
        return res.status(401).json({ error: 'Credenciales inválidas, verifica tus datos!!!' });
   
    } catch (error) {
        console.error('Error al intentar hacer login:', error);
        console.log("back end");
        return res.status(500).json({ error: 'Hubo un error al intentar hacer login' });
    }
};

module.exports = {
    loginPost
};
