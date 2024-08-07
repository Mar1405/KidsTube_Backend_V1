const Users = require('../Models/usersModel');

const usersGet = async (req, res) => {
  try {
    if (req.query.id) {
      const user = await Users.findById(req.query.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      return res.json(user);
    } else if (req.query.email && req.query.password) {
      const user = await Users.findOne({
        email: req.query.email,
        password: req.query.password,
      });
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      return res.json(user);
    } else {
      const users = await Users.find();
      return res.json(users);
    }
  } catch (error) {
    console.error('Error al encontrar usuarios:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const validateUserData = (data) => {
  const { name, last_name, pin, country, birthDate, email, number_phone, password, password2 } = data;
  const errors = [];

  if (password !== password2) {
    errors.push('Las contraseñas no coinciden');
  }

  if (!/^\d+$/.test(number_phone)) {
    errors.push('El número de teléfono debe contener solo dígitos');
  }

  if (!/^[A-Za-z\s]+$/.test(name) || !/^[A-Za-z\s]+$/.test(last_name)) {
    errors.push('El nombre debe contener solo letras');
  }

  if (!/^[A-Za-z\s]+$/.test(country)) {
    errors.push('El país debe contener solo letras');
  }

  return errors;
};

const usersPost = async (req, res) => {
  const { name, last_name, pin, country, birthDate, email, number_phone, password, password2 } = req.body;

  const errors = validateUserData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Verificar si ya existe un usuario en la base de datos
    const existingUser = await Users.findOne({});
    if (existingUser) {
      return res.status(400).json({ error: 'Ya existe un usuario administrador en la base de datos' });
    }

    const newUser = new Users({
      name,
      last_name,
      pin,
      country,
      birthDate,
      email,
      number_phone,
      password,
    });

    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    return res.status(400).json({ error: error.message });
  }
};


const usersPut = async (req, res) => {
  const { name, last_name, pin, country, birthDate, email, number_phone, password } = req.body;
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: 'Se requiere el ID del usuario' });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    user.name = name || user.name;
    user.last_name = last_name || user.last_name;
    user.pin = pin || user.pin;
    user.country = country || user.country;
    user.birthDate = birthDate || user.birthDate;
    user.email = email || user.email;
    user.number_phone = number_phone || user.number_phone;
    user.password = password || user.password;

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error:', error);
    return res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};

const usersDelete = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: 'Se requiere el ID del usuario' });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await user.deleteOne();
    return res.status(204).json({});
  } catch (error) {
    console.error('Error:', error);
    return res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
};
