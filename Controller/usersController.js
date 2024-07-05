const Users = require('../models/usersModel');

/**
 * Obtener todos los usuarios o un usuario por ID/email
 */
const usersGet = async (req, res) => {
  try {
    if (req.query.id) {
      const user = await Users.findById(req.query.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } else if (req.query.email && req.query.password) {
      const user = await Users.findOne({
        email: req.query.email,
        password: req.query.password,
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } else {
      const users = await Users.find();
      return res.json(users);
    }
  } catch (error) {
    console.error('Error finding users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Validar los datos de un usuario
 */
const validateUserData = (data) => {
  const { name, last_name, pin, country, birthDate, email, number_phone, password, password2 } = data;
  const errors = [];

  if (password !== password2) {
    errors.push('Passwords do not match');
  }

  if (!/^\d+$/.test(number_phone)) {
    errors.push('Phone number must contain only digits');
  }

  if (!/^[A-Za-z\s]+$/.test(name) || !/^[A-Za-z\s]+$/.test(last_name)) {
    errors.push('Name must contain only letters');
  }

  if (!/^[A-Za-z\s]+$/.test(country)) {
    errors.push('Country must contain only letters');
  }

  return errors;
};

/**
 * Crear un nuevo usuario
 */
const usersPost = async (req, res) => {
  const { name, last_name, pin, country, birthDate, email, number_phone, password, password2 } = req.body;

  const errors = validateUserData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
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
    console.error('Error while saving user:', error);
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Actualizar un usuario por su ID
 */
const usersPut = async (req, res) => {
  const { name, last_name, pin, country, birthDate, email, number_phone, password } = req.body;
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
    return res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
};

/**
 * Eliminar un usuario por su ID
 */
const usersDelete = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.deleteOne();
    return res.status(204).json({});
  } catch (error) {
    console.error('Error:', error);
    return res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
};
