const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
  name: { 
    require:true,
    type: String 
  },
  code: { 
    require:true,
    type: Number
   },
  description: { 
    require:true,
    type: String
   },
});

module.exports = mongoose.model('Course', courseSchema);