const mongoose = require('mongoose');


const videosSchema = new mongoose.Schema({
  name: { 
    require:true,
    type: String 
  },
  url: { 
    require:true,
    type: String
   },
  description: { 
    require:true,
    type: String
   },
});

module.exports = mongoose.model('videos', videosSchema);