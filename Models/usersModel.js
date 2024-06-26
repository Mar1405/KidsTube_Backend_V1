const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Correo electrónico inválido",
    },
  },
  password: {
    type: String,
    required: true,
  },
  repetirPassword: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return value === this.password;
      },
      message: "Las contraseñas no coinciden",
    },
  },
  telefono: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  nombre: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  pais: {
    type: String,
    required: false,
  },
  fechaNacimiento: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return validator.isDate(value.toString());
      },
      message: "Fecha de nacimiento inválida",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
