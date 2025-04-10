const mongoose = require('mongoose');
const { Schema } = mongoose;

const quiz_schema = new mongoose.Schema({
  title: { type: String, required: [true, 'Quiz title is required'], trim: true },
  description: { type: String, trim: true },
  category: { type: String, trim: true },
  timeLimit: { type: Number, min: [0, 'Time limit cannot be negative'] },
  questions: [{ 
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Quiz must have a creator']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

quiz_schema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

quiz_schema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Quiz = mongoose.model('Quiz', quiz_schema);

module.exports = Quiz;