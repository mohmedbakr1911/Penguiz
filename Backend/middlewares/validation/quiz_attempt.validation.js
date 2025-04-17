const { body, param, validationResult } = require('express-validator');
const QuizAttempt = require('../../DB/schemas/quiz_attempt.schema');
const mongoose = require('mongoose');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateSubmitQuiz = [
    body('user_answers')
        .isArray({ min: 1 })
        .withMessage('user_answers must be a non-empty array.'),
    body('user_answers.*.question')
        .notEmpty().withMessage('Question ID cannot be empty.')
        .isMongoId().withMessage('Invalid Question ID format.'),
    body('user_answers.*.answer')
        .exists()
        .withMessage('Answer field must be present for each question.'),

    param('id')
        .isMongoId().withMessage('Invalid Attempt ID format.')
        .custom(async (value, { req }) => {
            const attempt_id = value;
            const attempt = await QuizAttempt.findById(attempt_id).populate('quiz');

            if (!attempt) {
                throw new Error('Attempt not found.');
            }

            if (attempt.completed) {
                throw new Error('This quiz has already been submitted.');
            }

            const startTime = attempt.startTime;
            if (!attempt.quiz || typeof attempt.quiz.timeLimit === 'undefined') {
                console.error(`Quiz details or time limit missing for attempt ${attempt_id}`);
                throw new Error('Cannot validate quiz submission time.');
            }
            const timeLimitInMs = attempt.quiz.timeLimit * 60 * 1000;
            const currentTime = new Date();

            if (currentTime - startTime > timeLimitInMs) {
                throw new Error('Time limit exceeded. Cannot submit quiz.');
            }

            req.attempt = attempt;
            return true;
        }),

    handleValidationErrors
];

module.exports = {
    validateSubmitQuiz
};
