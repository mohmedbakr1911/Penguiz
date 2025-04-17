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
        url: `http://localhost:${5000}`, // Adjust if your server runs elsewhere
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: { // Name for the security scheme
          type: 'apiKey',
          in: 'cookie',
          name: 'token', // Name of the cookie
        },
      },
    },
    security: [ // Apply cookieAuth globally
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./Routes/*.js'], // Path to the API docs (your route files)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// --- End Swagger Setup ---


app.listen(5000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
