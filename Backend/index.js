const express = require("express");
const db_connection = require("./DB/db");
const app = express();
const cookieParser = require("cookie-parser");
const env = require('dotenv')

app.use(cookieParser());
app.use(express.json());
require("dotenv").config();

const authRouter = require("./Routes/auth.route");
const userRouter = require("./Routes/user.route");
const quizRouter = require("./Routes/quiz.route");
const questionRouter = require("./Routes/question.route");
const attemptRouter = require("./Routes/quiz_attempt.route");

app.use(authRouter);
app.use("/users", userRouter);
app.use("/quizzes", quizRouter);
app.use("/questions", questionRouter);
app.use("/attempts", attemptRouter);

app.listen(5000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
