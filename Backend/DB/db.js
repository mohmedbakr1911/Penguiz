const mongoose = require('mongoose');
const User = require('./schemas/user.schema');
const Quiz = require('./schemas/quiz.schema');
const Question = require('./schemas/question.schema');
const Quiz_attempt = require('./schemas/quiz_attempt.schema');

const db_connection = mongoose.connect('mongodb://localhost:27017/')
    .then(() => { console.log("db connected") })
    .catch((err) => { console.log(`error: ${err}`) })

module.exports = db_connection