const express = require("express");
const Attempt = require("../DB/schemas/quiz_attempt.schema");
const Question = require("../DB/schemas/question.schema");
const Quiz_attempt = require("../DB/schemas/quiz_attempt.schema");
const Quiz = require("../DB/schemas/quiz.schema");

const start = async (req,res)=>
{
  try {
    const quiz_id = req.params.id;
    const timeLimit = req.id;
    const newAttempt = new Quiz_attempt({
      user: req.user.id,
      quiz: quiz_id,
      startTime: Date.now(),
      timeLimit: timeLimit,
    });
    await newAttempt.save();

    const quiz = await Quiz.findById(quiz_id).populate("questions");
    res.status(200).json({
      quiz: quiz,
      questions: quiz.questions.map((q)=>{
        return q._id
      }),
      Attempt: newAttempt
    });

  } catch (error) {
    res.status(500).json({message: error});
  }
  

  //quiz findbyid().populate("questions")
  //res.s.j -> quiz

 // catch
}
module.exports = {submit_quiz};
