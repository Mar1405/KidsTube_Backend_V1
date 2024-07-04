const Users = require('../Models/usersModel');

/**
 * Obtener todos los usuarios o un usuario por ID/email
 */
const usersGet = async (req, res) => {
  try {
    if (req.query.id) {
      // Obtener usuario por ID
      const user = await Users.findById(req.query.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } else if (req.query.email && req.query.password) {
      // Obtener usuario por email y contraseña
      const user = await Users.findOne({
        email: req.query.email,
        password: req.query.password,
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } else {
      // Obtener todos los usuarios
      const users = await Users.find();
      return res.json(users);
    }
  } catch (error) {
    console.error('Error finding users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Crear un nuevo usuario
 */
const usersPost = async (req, res) => {
  const { name, last_name, pin, country, birthDate, email, password, password2, number_phone } = req.body;
  const today = new Date();
  const userBirthDate = new Date(birthDate);
  const age = today.getFullYear() - userBirthDate.getFullYear();

  // Validar la edad mínima de 18 años
  if (age < 18) {
    return res.status(400).json({ error: 'User must be at least 18 years old' });
  }

  // Validar que las contraseñas coincidan
  if (password2 !== password) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Validar que el número de teléfono solo contenga dígitos
  if (!/^\d+$/.test(number_phone)) {
    return res.status(400).json({ error: 'Phone number must contain only digits' });
  }

  // Validar que el nombre solo contenga letras
  if (!/^[A-Za-z\s]+$/.test(name && last_name)) {
    return res.status(400).json({ error: 'Name must contain only letters' });
  }

  // Validar que el país solo contenga letras
  if (!/^[A-Za-z\s]+$/.test(country)) {
    return res.status(400).json({ error: 'Country must contain only letters' });
  }

  // Validar el formato de la fecha de nacimiento (yyyy-mm-dd)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return res.status(400).json({ error: 'Birth date must be in the format yyyy-mm-dd' });
  }

  try {
    const newUser = new Users({
      name,
      last_name,
      pin,
      country,
      birthDate,
      email,
      password,
      password2,
      number_phone,
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
  const { name, pin, country, birthDate, email, password } = req.body;
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
    user.pin = pin || user.pin;
    user.country = country || user.country;
    user.birthDate = birthDate || user.birthDate;
    user.email = email || user.email;
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
