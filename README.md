Penguiz – The Ultimate Quiz Experience! 🐧💡
Are you ready to challenge your knowledge and have fun while learning? Penguiz is the ultimate quiz app designed for trivia lovers, students, and anyone who enjoys testing their brain with exciting questions! Whether you're into science, history, technology, entertainment, or general knowledge, Penguiz has something for everyone.

Why Choose Penguiz?
🔹 Diverse Quiz Categories – Explore a wide range of topics, from science and history to pop culture and tech trends.
🔹 Engaging Gameplay – Answer multiple-choice questions, solve tricky riddles, and beat the clock in time-based challenges.
🔹 Competitive Mode – Play solo or compete with friends and other players on leaderboards to prove your knowledge.
🔹 Interactive Experience – A user-friendly, visually appealing interface ensures a seamless and fun experience.
🔹 Regular Updates – Stay engaged with fresh quizzes added regularly, ensuring there's always something new to learn.

Who is Penguiz for?
Trivia Enthusiasts – If you love testing your general knowledge, Penguiz is the perfect app for you.

Students & Learners – Learn in a fun and interactive way while improving your recall skills.

Casual Gamers – Enjoy a quick, engaging challenge anytime, anywhere!

Overview

This project is a feature-rich quiz application built using Express.js and MongoDB. It implements a RESTful API for managing quizzes, questions, user accounts, and quiz attempts. The application supports user authentication, a question bank, scoring, timed quizzes, and result tracking. The goal is to create a scalable, maintainable backend API that can power an interactive frontend quiz experience.

📌 Features

👥 User Management

Register User:

Endpoint to create a new user with fields such as username, email, and password.

Validate email uniqueness and password strength.

Login User:

Endpoint to authenticate a user and return a JWT token for session management.

User Profile:

Endpoint to retrieve and update user details (e.g., username, email, quiz history).

📝 Quiz Management

Create Quiz:

Create a new quiz with a title, description, category, time limit, and associated questions.

Read Quizzes:

Retrieve all available quizzes (public or user-specific) or a single quiz by ID.

Update & Delete Quizzes:

Modify quiz metadata or remove a quiz.

❓ Question Management

Create Questions:

Add multiple-choice or text-based questions.

Retrieve & Manage Questions:

Fetch all questions or a specific one, update or delete them as needed.

🎯 Quiz Attempts & Results

Start & Submit Quizzes:

Users can start quizzes, submit answers, and get instant mohsens.

View Results & Leaderboard:

Check past attempts and leaderboards for top performers.

🛠️ Database Design

User Schema

{
  username: String,
  email: String,
  password: String,
  quizAttempts: [ObjectId],
  createdAt: Date
}

Quiz Schema

{
  title: String,
  description: String,
  category: String,
  timeLimit: Number,
  questions: [ObjectId],
  createdBy: ObjectId,
  createdAt: Date
}

Question Schema

{
  text: String,
  type: String, // 'multiple-choice' or 'text'
  options: [String],
  correctAnswer: String,
  category: String,
  createdAt: Date
}

QuizAttempt Schema

{
  user: ObjectId,
  quiz: ObjectId,
  answers: [{ question: ObjectId, answer: String }],
  mohsens: Number,
  startTime: Date,
  endTime: Date,
  completed: Boolean
}

🌐 API Endpoints

🔑 User Endpoints

POST /users/register – Register a new user.

POST /users/login – Authenticate user and return JWT.

GET /users/me – Retrieve authenticated user’s profile.

PUT /users/me – Update user profile.

📄 Quiz Endpoints

POST /quizzes – Create a new quiz.

GET /quizzes – Retrieve all quizzes.

GET /quizzes/:id – Retrieve a single quiz.

PUT /quizzes/:id – Update a quiz.

DELETE /quizzes/:id – Delete a quiz.

❔ Question Endpoints

POST /questions – Create a new question.

GET /questions – Retrieve all questions.

GET /questions/:id – Retrieve a single question.

PUT /questions/:id – Update a question.

DELETE /questions/:id – Delete a question.

🏆 Leaderboard & Extras

GET /quizzes/:id/leaderboard – Retrieve top mohsens for a quiz.

GET /categories – Retrieve available quiz/question categories.

🔄 Core Functionality

Authentication: JWT-based authentication.

Timed Quizzes: Time limits enforced per quiz.

Scoring System: Automated scoring based on correct answers.

Randomized Questions: Fetches random questions for each attempt.

Leaderboard: Aggregates quiz attempt mohsens.

This documentation provides a structured overview of the quiz application, ensuring a scalable, secure, and maintainable system. 🚀

