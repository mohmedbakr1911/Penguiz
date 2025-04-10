const { body, validationResult } = require('express-validator');
const User = require('../../DB/schemas/user.schema');

const checkUsernameExists = async (username) => {
  const user = await User.findOne({ username: username.toLowerCase() });
  if (user) {
    throw new Error('Username already in use');
  }
};

const checkEmailExists = async (email) => {
  const user = await User.findOne({ email: email });
  if (user) {
    throw new Error('Email already in use');
  }
};

const registerUserValidationRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
    .custom(checkUsernameExists),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.')
    .normalizeEmail()
    .custom(checkEmailExists),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];

const loginUserValidationRules = [
  body('username')
    .notEmpty().withMessage('Username is required.'),

  body('password')
    .notEmpty().withMessage('Password is required.')
];

module.exports = {
  registerUserValidationRules,
  loginUserValidationRules,
};
