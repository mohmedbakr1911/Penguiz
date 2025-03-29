const mongoose = require('mongoose');

const question_schema = new mongoose.Schema(
{
  text: String,
  type: String, // 'multiple-choice' or 'text'
  options: [String],
  correctAnswer: String,
  category: String,
  createdAt: Date
});

const Question = mongoose.model('Question', question_schema);


module.exports = question_schema;