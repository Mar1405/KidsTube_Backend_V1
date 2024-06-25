const mongoose = require("mongoose");

const videosSchema = new mongoose.Schema({
  nombre: {
    required: true,
    type: String,
  },
  url: {
    required: true,
    type: String,
  },
  descripcion: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("Video", videosSchema); 
