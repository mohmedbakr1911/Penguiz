const { body } = require('express-validator');

const createQuizValidationRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string'),
    body('description')
        .optional().trim().isString(),
    body('category')
        .optional().trim().isString(),
    body('timeLimit')
        .optional().isInt({ gt: 0 }).withMessage('Time limit must be a positive integer'),
    body('questions')
        .isArray({ min: 1 }).withMessage('Questions must be an array with at least one question ID'),
    body('questions.*')
        .isMongoId().withMessage('Each item in questions must be a valid Question ID format'),
];

const updateQuizValidationRules = [
        body('title')
                .optional()
                .trim()
                .notEmpty().withMessage('Title cannot be empty if provided')
                .isString().withMessage('Title must be a string'),
        body('description')
                .optional().trim().isString(),
        body('category')
                .optional().trim().isString(),
        body('timeLimit')
                .optional().isInt({ gt: 0 }).withMessage('Time limit must be a positive integer'),
        body('questions')
                .optional()
                .isArray().withMessage('Questions must be an array if provided'),
        body('questions.*')
                .optional()
                .isMongoId().withMessage('Each item in questions must be a valid Question ID format'),
];

module.exports = {
    createQuizValidationRules,
    updateQuizValidationRules,
};
