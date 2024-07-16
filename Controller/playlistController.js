// playlistController.js
const Playlist = require('../Models/playlistModel');

// Crear nueva playlist
const createPlaylist = async (req, res) => {
  const { name, profiles, videos } = req.body;

  try {
    const existingPlaylist = await Playlist.findOne({ name });
    if (existingPlaylist) {
      return res.status(400).json({ message: 'El nombre de la playlist ya existe' });
    }

    const playlist = new Playlist({
      name,
      profiles,
      videos
    });

    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una playlist existente
const updatePlaylist = async (req, res) => {
  const { id } = req.params;
  const { name, profiles, videos } = req.body;

  try {
    const existingPlaylist = await Playlist.findOne({ name, _id: { $ne: id } });
    if (existingPlaylist) {
      return res.status(400).json({ message: 'El nombre de la playlist ya existe' });
    }

    const playlist = await Playlist.findByIdAndUpdate(id, { name, profiles, videos }, { new: true });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una playlist
const deletePlaylist = async (req, res) => {
  const { id } = req.params;

  try {
    const playlist = await Playlist.findByIdAndDelete(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }
    res.json({ message: 'Playlist eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las playlists
const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('profiles').populate('videos');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylists
};
