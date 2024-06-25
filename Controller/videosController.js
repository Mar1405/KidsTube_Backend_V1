const Video = require('../Models/videosModel');

// Controladores
const videoPost = async (req, res) => {
    const { nombre, url, descripcion } = req.body;
    try {
        const newVideo = new Video({ nombre, url, descripcion });
        const savedVideo = await newVideo.save();
        res.status(201).json({ video: savedVideo, location: `/api/videos/${savedVideo._id}` });
    } catch (error) {
        console.error('Error al guardar el video:', error);
        res.status(500).json({ error: 'Hubo un error al guardar el video. Por favor, intenta de nuevo más tarde.' });
    }
};

const videoGet = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error('Error al obtener videos:', error);
    res.status(500).json({ error: 'Hubo un error al obtener los videos. Por favor, intenta de nuevo más tarde.' });
  }
};

const videoDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedVideo = await Video.findByIdAndDelete(id);
    if (!deletedVideo) {
      res.status(404).json({ error: 'El video que intentas eliminar no existe.' });
    } else {
      res.json({ message: 'El video ha sido eliminado correctamente' });
    }
  } catch (error) {
    console.error('Error al eliminar el video:', error);
    res.status(500).json({ error: 'Hubo un error al eliminar el video. Por favor, intenta de nuevo más tarde.' });
  }
};

const videoUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, nombre, descripcion } = req.body;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: 'El video que intentas actualizar no existe.' });
    }

    if (url !== undefined && url.trim() !== '') {
      video.url = url.trim();
    }

    if (nombre) {
      video.nombre = nombre;
    }

    if (descripcion) {
      video.descripcion = descripcion;
    }

    await video.save();

    return res.status(200).json({ message: 'Video actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el video:', error);
    return res.status(500).json({ error: 'Hubo un error al actualizar el video. Por favor, intenta de nuevo más tarde.' });
  }
};

module.exports = {
  videoPost,
  videoGet,
  videoDelete,
  videoUpdate
};
