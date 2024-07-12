const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('usersKids', usersSchema);