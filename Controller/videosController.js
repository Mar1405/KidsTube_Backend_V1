const express = require('express');
const Model = require('..//Models/videosModel');
const router = express.Router()
//Post Method
router.post('/post', async (req, res) => {
    try {
        // Verificar si ya existe un documento con el mismo 'code'
        const existingCourse = await Model.findOne({ code: req.body.code});
        const existingname = await Model.findOne({name: req.body.name});
        if (existingCourse) {
            return res.status(400).json({ message: 'El código del curso ya existe, favor ingrese uno nuevo' });
        }
        else if(existingname){
            return res.status(400).json({ message: 'El nombre del curso ya existe, favor ingrese uno nuevo' });
        }

        // Crear un nuevo documento
        const data = new Model({
            name: req.body.name,
            code: req.body.code,
            description: req.body.description,
        });

        // Guardar el nuevo documento en la base de datos
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Get all Method
router.get('/getAll', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


//Update by ID Method
//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get by ID Method
//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
module.exports = router;
