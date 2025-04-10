const mongoose = require("mongoose");
const { Schema } = mongoose;
const quiz_schema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  timeLimit: Number,
  questions: [
    {
      question: { type: Schema.Types.ObjectId, ref: "Question", required:true },
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model("Quiz", quiz_schema);

module.exports = Quiz;