const express = require("express");
const QuizAttempt = require("../DB/schemas/quiz_attempt.schema");
const Quiz = require("../DB/schemas/quiz.schema");
const Question = require("../DB/schemas/question.schema");
const User = require("../DB/schemas/user.schema"); // Import User model

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
    const quiz_id = req.params.id;
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
    const attempt_id  = req.params.id;
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
    const attempt_id = req.params.id;

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
    const { attempt } = req;
    const submitted_answers = req.body.user_answers;

    const questionIds = submitted_answers.map(ua => ua.question);

    const questions = await Question.find({ '_id': { $in: questionIds } }).select('correctAnswer');
    const correctAnswersMap = questions.reduce((map, q) => {
        map[q._id.toString()] = q.correctAnswer;
        return map;
    }, {});

    let correctCount = 0;
    for (const userAnswer of submitted_answers) {
      const correctAnswer = correctAnswersMap[userAnswer.question];
      if (correctAnswer !== undefined && userAnswer.answer === correctAnswer) {
        correctCount++;
      }
    }

    const updatedAttempt = await QuizAttempt.findByIdAndUpdate(
      attempt_id,
      {
        user_answers: submitted_answers,
        mohsens: correctCount,
        completed: true
      },
      { new: true }
    );

    if (!updatedAttempt) {
        return res.status(404).json({ message: "Attempt not found during final update." });
    }

    try {
      const userUpdateResult = await User.findByIdAndUpdate(
        attempt.user,
        {
          $push: { quiz_attempts: updatedAttempt._id },
          $inc: { mohsens: correctCount }
        },
        { new: true }
      );
      if (!userUpdateResult) {
        console.error(`User not found for update: ${attempt.user}`);
      }
    } catch (userUpdateError) {
      console.error("Error updating user record:", userUpdateError);
    }

    return res.status(200).json(updatedAttempt);

  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "An internal server error occurred while processing the quiz submission." });
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
