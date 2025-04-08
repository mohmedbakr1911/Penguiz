const mongoose = require('mongoose')

const quiz_schema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    timeLimit: Number,
    questions: [Number],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }
)

const Quiz = mongoose.model('Quiz', quiz_schema)


module.exports = Quiz