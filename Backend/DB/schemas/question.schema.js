const mongoose = require('mongoose')

const question_schema = new mongoose.Schema(
  {
    text: String,
    options: [String],
    correctAnswer: String,
    category: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }
)

const Question = mongoose.model('Question', question_schema)


module.exports = Question