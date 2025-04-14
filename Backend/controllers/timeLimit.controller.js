const express = require("express");
const Attempt = require("../DB/schemas/quiz_attempt.schema");
const Question = require("../DB/schemas/question.schema");
const Quiz_attempt = require("../DB/schemas/quiz_attempt.schema");

const submit_quiz = async (req, res) => {
  try {
    const { attempt_id, userAnswers } = req.body;
    const attempt = await Quiz_attempt.findById(attempt_id);

    if (!attempt || attempt.completed) {
      res.status(400).json({ message: "Quiz not found or already submitted." });
    }

    const now = new Date();

    if (now > attempt.endTime) {
      attempt.completed = true;
      await attempt.save();
      return res.status(403).json({ message: "Time is up! Quiz ended." });
    }

    attempt.user_answers = userAnswers;
    attempt.completed = true;

    let score = 0;

    for (let user_answers of userAnswrs) {
      const question = await Question.findById(userAnswrs.question);

      if (
        question &&
        question.correctAnswer.trim().toLowerCase() ===
          userAnswers.answer.trim().toLowerCase()
      ) {
        score++;
      }
    }

    attempt.mohsens = score;
    await attempt.save();

    res.json({
      message: "Quiz submitted successfully.",
      score,
      total: userAnswers.length,
    });
  } catch (error) {
     console.error("Error submitting quiz:", error);
     res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {submit_quiz};
