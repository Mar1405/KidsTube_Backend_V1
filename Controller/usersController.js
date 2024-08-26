const Users = require('../Models/usersModel');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sendVerificationEmail } = require('./sendEmail'); 
// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Función middleware para verificar el token JWT
 */
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'secreto');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Controlador para obtener usuarios
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

// Función para validar los datos del usuario
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

// Controlador para crear un nuevo usuario
const usersPost = async (req, res) => {
  const { name, last_name, pin, country, birthDate, email, number_phone, password, password2 } = req.body;

  const errors = validateUserData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Verificar si el correo electrónico o el número de teléfono ya están registrados
    const existingUser = await Users.findOne({ $or: [{ email }, { number_phone }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      }
      if (existingUser.number_phone === number_phone) {
        return res.status(400).json({ error: 'El número de teléfono ya está registrado.' });
      }
    }

    // Crear un token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Crear nuevo usuario
    const newUser = new Users({
      name,
      last_name,
      pin,
      country,
      birthDate,
      email,
      number_phone,
      password,
      status: 'pending',
      verificationToken,
    });

    // Guardar el usuario en la base de datos
    const savedUser = await newUser.save();

    // Enviar correo de verificación usando SendGrid
    const verificationLink = `http://localhost:3001/api/users/verify/${verificationToken}`;

    await sendVerificationEmail(email, verificationLink); // Llamada a la función de envío de correo

    return res.status(201).json({ message: 'Usuario registrado. Verifique su correo electrónico.' });
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para actualizar un usuario
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

    // Verificar si el nuevo correo o número de teléfono ya están en uso por otro usuario
    const existingUser = await Users.findOne({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ email }, { number_phone }] }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico o el número de teléfono ya están en uso.' });
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
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para eliminar un usuario
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
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para verificar un usuario
const verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await Users.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Token de verificación inválido.' });
    }

    user.status = 'active';
    user.verificationToken = undefined; // Limpiar el token después de la verificación
    await user.save();

    return res.status(200).json({ message: 'Correo electrónico verificado con éxito.' });
  } catch (error) {
    console.error('Error al verificar el usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  verifyUser,
};