const mongoose = require('mongoose');
const User = require('./schemas/user.schema');
const Quiz = require('./schemas/quiz.schema');
const Question = require('./schemas/qestion.schema');
const Quiz_attempt = require('./schemas/quiz_attempt.schema')

const db_connection = mongoose.connect('mongodb+srv://2022170867:ThHQGXYDaExNyIge@penguiz.7vkhzdf.mongodb.net/?retryWrites=true&w=majority&appName=Penguiz'
    
).then(()=>{console.log("db connected")}).catch((err)=>{console.log(`error: ${err}`)});

module.exports = db_connection;