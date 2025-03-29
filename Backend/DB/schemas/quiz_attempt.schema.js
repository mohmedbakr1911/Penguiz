const mongoose = require('mongoose');

const quiz_attempt_schame = mongoose.Schema(
 {
  user: ObjectId,
  quiz: ObjectId,
  answers: [{ question: ObjectId, answer: String }],
  mohsens: Number,
  startTime: Date,
  endTime: Date,
  completed: Boolean
}
)

const Quiz_attempt = mongoose.model('Quiz-Attempt', quiz_attempt_schame)