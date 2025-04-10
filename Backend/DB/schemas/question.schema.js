const mongoose = require('mongoose');
const { Schema } = mongoose;

const question_schema = new mongoose.Schema({
  text: { type: String, required: [true, 'Question text is required'], trim: true },
  options: { type: [String], default: [] },
  correctAnswer: { type: String, required: [true, 'Correct answer is required'] },
  category: { type: String, trim: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Question must have a creator']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

question_schema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

question_schema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});


const Question = mongoose.model("Question", question_schema);

module.exports = Question;