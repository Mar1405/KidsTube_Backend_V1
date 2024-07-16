const Playlist = require('../Models/playlistModel');
const User = require('../Models/usersKidsModels');

const getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las playlists' });
    }
};

const createPlaylist = async (req, res) => {
    const { name, users, videos } = req.body;
  
    try {
      const newPlaylist = new Playlist({ name, users, videos });
      await newPlaylist.save();
      res.status(201).json(newPlaylist);
    } catch (error) {
      console.error('Error al crear la playlist:', error);
      res.status(400).json({ message: 'Error al crear la playlist' });
    }
  };
  
  // Controlador para actualizar una playlist existente
const updatePlaylist = async (req, res) => {
const { id } = req.params;
const { name, users, videos } = req.body;

try {
    let playlist = await Playlist.findById(id);
    if (!playlist) {
    return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    // Actualizar los campos de la playlist
    playlist.name = name;
    playlist.users = users;
    playlist.videos = videos;

    // Guardar la playlist actualizada
    await playlist.save();
    res.json(playlist);
} catch (error) {
    console.error('Error al actualizar la playlist:', error);
    res.status(400).json({ message: 'Error al actualizar la playlist' });
}
  };
  
const deletePlaylist = async (req, res) => {
    const { id } = req.params;
    try {
        const playlist = await Playlist.findByIdAndDelete(id);
        if (!playlist) return res.status(404).json({ message: 'Playlist no encontrada' });
        res.json({ message: 'Playlist eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la playlist' });
    }
};

const addVideo = async (req, res) => {
    const { id } = req.params;
    const { nombre, url, descripcion } = req.body;
    try {
        const playlist = await Playlist.findById(id);
        if (!playlist) return res.status(404).json({ message: 'Playlist no encontrada' });
        playlist.videos.push({ nombre, url, descripcion });
        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        res.status(400).json({ message: 'Error al agregar el video' });
    }
};

const deleteVideo = async (req, res) => {
    const { playlistId, videoId } = req.params;
    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) return res.status(404).json({ message: 'Playlist no encontrada' });
        playlist.videos.id(videoId).remove();
        await playlist.save();
        res.json({ message: 'Video eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar el video' });
    }
};

module.exports = {
    getPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideo,
    deleteVideo
};
