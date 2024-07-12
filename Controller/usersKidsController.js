const UserKids = require('../Models/usersKidsModels');

// USERKIDS POST
const UserKidsPost = async (req, res) => {
    const { name, password } = req.body;
    try {
        const newUser = new UserKids({ name,password });
        const saveduser = await newUser.save();
        res.status(201).json({ users: saveduser, location: `/api/usersKids/${saveduser._id}` });
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        res.status(500).json({ error: 'Hubo un error al guardar el usuario infantil. Por favor, intenta de nuevo más tarde.' });
    }
};

//USERKIDS GET
const UserKidsGet = async (req, res) => {
  try {
    const users = await UserKids.find();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios infantiles:', error);
    res.status(500).json({ error: 'Hubo un error al obtener los usuarios. Por favor, intenta de nuevo más tarde.' });
  }
};
//DELETE USERKIDS 
const UserKidsDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await UserKids.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).json({ error: 'El usuario que intentas eliminar no existe.' });
    } else {
      res.json({ message: 'El usuario ha sido eliminado correctamente' });
    }
  } catch (error) {
    console.error('Error al eliminar el usuario infantil:', error);
    res.status(500).json({ error: 'Hubo un error al eliminar el usuario infantil. Por favor, intenta de nuevo más tarde.' });
  }
};
//UPDATE USERKIDS
const UserKidsUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name,password } = req.body;

    const user = await UserKids.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'El usuario que intentas actualizar no existe.' });
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    return res.status(200).json({ message: 'Usuario infantil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return res.status(500).json({ error: 'Hubo un error al actualizar el usuario infantil. Por favor, intenta de nuevo más tarde.' });
  }
};

module.exports = {
  UserKidsPost,
  UserKidsGet,
  UserKidsDelete,
  UserKidsUpdate
};