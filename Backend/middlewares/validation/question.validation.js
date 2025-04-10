const { body } = require('express-validator');

const createQuestionValidationRules = [
  body('text')
    .trim()
    .notEmpty().withMessage('Question text is required')
    .isString().withMessage('Question text must be a string'),

  body('options')
    .isArray({ min: 2 }).withMessage('Options must be an array with at least 2 choices for MCQ'),
  body('options.*')
    .trim()
    .notEmpty().withMessage('Each option cannot be empty')
    .isString().withMessage('Each option must be a string'),

  body('correctAnswer')
    .trim()
    .notEmpty().withMessage('Correct answer is required')
    .isString().withMessage('Correct answer must be a string'),

  body('category')
    .optional()
    .trim()
    .isString().withMessage('Category must be a string'),
];

const updateQuestionValidationRules = [
  body('text')
    .optional()
    .trim()
    .notEmpty().withMessage('Question text cannot be empty if provided')
    .isString().withMessage('Question text must be a string'),

  body('options')
    .optional()
    .isArray({ min: 2 }).withMessage('Options must be an array with at least 2 choices if provided'),
  body('options.*')
    .optional()
    .trim()
    .notEmpty().withMessage('Each option cannot be empty')
    .isString().withMessage('Each option must be a string'),

  body('correctAnswer')
    .optional()
    .trim()
    .notEmpty().withMessage('Correct answer cannot be empty if provided')
    .isString().withMessage('Correct answer must be a string'),

  body('category')
    .optional()
    .trim()
    .isString().withMessage('Category must be a string'),
];

module.exports = {
  createQuestionValidationRules,
  updateQuestionValidationRules,
};
