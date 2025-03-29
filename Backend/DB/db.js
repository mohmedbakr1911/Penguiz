const mongoose = require('mongoose');

const db_connection = mongoose.connect('mongodb+srv://2022170867:ThHQGXYDaExNyIge@penguiz.7vkhzdf.mongodb.net/?retryWrites=true&w=majority&appName=Penguiz'
    
).then(()=>{console.log("db connected")}).catch((err)=>{console.log(`error: ${err}`)});

module.exports = db_connection;