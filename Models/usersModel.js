const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  last_name: {
    required: true,
    type: String,
  },
  pin: {
    required: true,
    type: String,
    minLength: 6,
    maxLength: 6,
  },
  country: {
    required: true,
    type: String,
  },
  birthDate: {
    required: true,
    type: Date,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('Users', usersSchema);
