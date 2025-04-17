const express = require("express");
const Router = express.Router();
const Quiz_attempt = require("../controllers/quiz_attempt.controller");
const { authorization } = require("../middlewares/auth.middleware");
const { validate } = require("../DB/schemas/quiz.schema");
Router.get("/", Quiz_attempt.get_all_attempts);
Router.get("/:id", Quiz_attempt.get_attempt);
Router.post("/:quiz_id", Quiz_attempt.createAttempt);
Router.put("/:attempt_id", Quiz_attempt.updateAttempt);
Router.post("/start/:id", authorization ,Quiz_attempt.start);
Router.post("/submit/:id", authorization, Quiz_attempt.submit_quiz);
Router.delete("/:attempt_id", Quiz_attempt.delete_attempt);

module.exports = Router;
