const express = require('express');
const port = 3001;
const mongoose = require('mongoose');
const dotenv =require('dotenv').config();
const mongoString = process.env.DATABASE_URL
const routes = require('./Controller/videosController');



const app= express();

app.use(express.json());

// check for cors
const cors = require("cors");
app.use(cors({
    domains: '*',
    methods: "*"
}));


app.use('/api', routes);


const connect = async () => {
    try {
        await mongoose.connect(mongoString);
        console.log("Connected to MongoDB");
    } catch (error) {
        throw error;
    }
}


app.listen(port, () => {
    connect();
    console.log(`Server Started at ${port}`)
})
