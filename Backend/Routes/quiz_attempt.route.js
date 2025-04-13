const express = require("express");
const Router = express.Router();
const Quiz_attempt = require("../controllers/quiz_attempt.controller");
Router.get("/", Quiz_attempt.get_all_attempts);
Router.get("/:id", Quiz_attempt.get_attempt);
Router.post("/:quiz_id", Quiz_attempt.createAttempt);
Router.put("/:attempt_id", Quiz_attempt.updateAttempt);
Router.delete("/:attempt_id", Quiz_attempt.delete_attempt);
