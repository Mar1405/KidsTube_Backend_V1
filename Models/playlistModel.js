const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usersKids'
  }]
});

module.exports = mongoose.model('Playlist', playlistSchema);