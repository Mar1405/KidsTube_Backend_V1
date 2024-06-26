require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = mongoose.connect("mongodb://0.0.0.0:27017/tubekids"); 

const database = mongoose.connection;

database.on("error", (error) => {
  console.error("Error en la conexión a la base de datos:", error);
});

database.once("open", () => {
  console.log("Base de datos conectada correctamente");
});

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors()); // Ajusta las opciones de CORS según tus necesidades

// Importar y definir los controladores aquí
const {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
} = require("./Controller/usersController");

const {
  videoPost,
  videoGet,
  videoDelete,
  videoUpdate
} = require("./Controller/videosController");

// Rutas para los endpoints de videos
app.get("/api/videos", videoGet); // Obtener todos los videos
app.post("/api/videos", videoPost); // Crear un nuevo video
app.put("/api/videos/:id", videoUpdate); // Actualizar un video por su ID
app.delete("/api/videos/:id", videoDelete); // Eliminar un video por su ID

app.get("/api/users", usersGet);
app.post("/api/users", usersPost);
app.put("/api/users", usersPut);
app.delete("/api/users", usersDelete);

app.listen(3001, () => {
    console.log(`Server Started at ${3001}`);
});
