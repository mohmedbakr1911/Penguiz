const express = require("express");
const QuizAttempt = require("../DB/schemas/quiz_attempt.schema");
const Quiz = require("../DB/schemas/quiz.schema");

const get_all_attempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find();
    if (!attempts) {
      res.status(404).json({ message: "Attempts not found" });
    }

    res.status(200).json({ message: attempts });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const get_attempt = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = QuizAttempt.findById(id);
    if (!attempt) {
      res.status(404).json({ message: "attempt is not found" });
    }
    res.status(200).json({ message: attempt });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const createAttempt = async (req, res) => {
  try {
    const { quiz_id } = req.params;
    const {
      user,
      quiz,
      user_answers,
      quiz_attempts,
      mohsens,
      startTime,
      endTime,
      completed,
    } = req.body;
    const new_attempt = new QuizAttempt({
      user,
      quiz,
      user_answers,
      quiz_attempts,
      mohsens,
      startTime,
      endTime,
      completed,
    });

    await new_attempt.save();
    await new_attempt.populate("quiz", "Quiz");
    res.status(200).json({ message: new_attempt });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updateAttempt = async (req, res) => {
  try {
    const { attempt_id } = req.params;
    const { user_answers, mohsens, completed, quiz_attempts } = req.body;
    const updated_attempt = await QuizAttempt.findByIdAndUpdate(attempt_id, {
      user_answers,
      mohsens,
      completed,
      quiz_attempts,
    });
    if (!updated_attempt) {
      res.status(404).json({ message: "attempt can not be found" });
    }

    res.status(200).json({ message: updated_attempt });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const delete_attempt = async (req, res) => {
  try {
    const { attempt_id } = req.params;

    const deleted_attempt = await QuizAttempt.findByIdAndDelete(attempt_id);

    if (!deleted_attempt) {
      res.status(404).json("attempt can not be found");
    }

    res.status(200).json({ message: deleted_attempt });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const start = async (req, res) => {
  try {
    const quiz_id = req.params.id;
    const newAttempt = new QuizAttempt({
      user: req.user.id,
      quiz: quiz_id,
      startTime: Date.now(),
    });
    await newAttempt.save();

    const quiz = await Quiz.findById(quiz_id).populate("questions");
    res.status(200).json({
      quiz: quiz,
      Attempt: newAttempt,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const submit_quiz = async (req, res) => {
  try {
    const attempt_id = req.params.id;
    const user_answers = req.body;
    const attempt = QuizAttempt.findByIdAndUpdate(attempt_id, {
      user_answers: user_answers,
    }).populate("attempt.user_answers");
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    const startTime = attempt.startTime;
    const timeLimitInMs = attempt.quiz.timeLimit * 60 * 1000;
    const currentTime = new Date();

    if (currentTime - startTime > timeLimitInMs) {
      throw new Error("Time limit exceeded. Cannot submit quiz.");
    }

    let correctCount = 0;

    for (const userAnswer of attempt.user_answers) {
      const question = userAnswer.question;
      if (question && userAnswer.answer === question.correctAnswer) {
        correctCount++;
      }
    }

    // Save the mohsens (score) to the attempt
    attempt.mohsens = correctCount;
    await attempt.save();

    return res.status(200).json({ message: attempt });
  } catch (error) {
    res.status(500).json({message: error});
  }
};

module.exports = {
  get_all_attempts,
  get_attempt,
  createAttempt,
  updateAttempt,
  delete_attempt,
  start,
  submit_quiz,
};
