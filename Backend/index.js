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

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Penguiz API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Penguiz application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./Routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
