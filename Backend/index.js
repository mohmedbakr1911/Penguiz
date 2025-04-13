const express = require("express");
const db_connection = require("./DB/db");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
require("dotenv").config();

const authRouter = require("./Routes/auth.route");
const userRouter = require("./Routes/user.route");
const quizRouter = require("./Routes/quiz.route");
const questionRouter = require("./Routes/question.route");

app.use(authRouter);
app.use("/users", userRouter);
app.use("/quizzes", quizRouter);
app.use("/questions", questionRouter);

app.listen(5000, () => {
  console.log("app is running on port 3001");
});
