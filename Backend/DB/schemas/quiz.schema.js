const mongoose = require('mongoose');

const quiz_schema = new mongoose.Schema(
{
  title: String,
  description: String,
  category: String,
  timeLimit: Number,
  questions: [Number],
  createdBy: Number,
  createdAt: Date
});

const Quiz = mongoose.model('Quiz', quiz_schema);


module.exports = Quiz;