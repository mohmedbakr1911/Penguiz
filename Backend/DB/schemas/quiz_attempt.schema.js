const mongoose = require('mongoose')
const User = require('./user.schema')
const quiz_attempt_schame = new mongoose.Schema(
  {
    user: Number,
    quiz: Number,
    answers: [{ question: Number, answer: String }],
    mohsens: Number,
    startTime: Date,
    endTime: Date,
    completed: Boolean
  }
)

const Quiz_attempt = mongoose.model('Quiz-Attempt', quiz_attempt_schame)

module.exports = Quiz_attempt