const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user.schema");

const quiz_attempt_schame = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
  user_answers: [
    {
      question: { type: Schema.Types.ObjectId, ref: "Question" },
      answer: String,
    },
  ],
  mohsens: Number,
  startTime: Date,
  completed: Boolean,
});

const Quiz_attempt = mongoose.model("Quiz-Attempt", quiz_attempt_schame);

module.exports = Quiz_attempt;