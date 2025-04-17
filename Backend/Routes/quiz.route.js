const express = require("express");
const quizController = require("../controllers/quiz.controller");
const { authorization, isAdmin } = require("../middlewares/auth.middleware");
const {
  createQuizValidationRules,
  updateQuizValidationRules,
} = require("../middlewares/validation/quiz.validation");

const {
  validate,
  idParamValidationRule,
} = require("../middlewares/validation/common.validation");

const router = express.Router();

router.get("/", authorization, quizController.get_all_quizzes);

router.post(
  "/create",
  authorization,
  isAdmin,
  createQuizValidationRules,
  validate,
  quizController.create_quiz
);

router.get(
  "/:id",
  authorization,
  idParamValidationRule,
  validate,
  quizController.get_quiz
);

router.put(
  "/update/:id",
  authorization,
  isAdmin,
  idParamValidationRule,
  updateQuizValidationRules,
  validate,
  quizController.update_quiz
);

router.put(
  "/add_question/:id",
  authorization,
  isAdmin,
  idParamValidationRule,
  updateQuizValidationRules,
  validate,
  quizController.add_Question
);

router.delete(
  "/delete/:id",
  authorization,
  isAdmin,
  idParamValidationRule,
  validate,
  quizController.delete_quiz
);

module.exports = router;
