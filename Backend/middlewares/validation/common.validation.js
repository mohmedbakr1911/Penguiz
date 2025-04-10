const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { param } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => {
      if (!extractedErrors.some(e => e[err.path])) {
          extractedErrors.push({ [err.path]: err.msg });
      }
    });

    return res.status(400).json({
        message: "Validation failed",
        errors: extractedErrors,
    });
};

const idParamValidationRule = [
    param('id').isMongoId().withMessage('Invalid ID format in URL parameter'),
];


module.exports = {
    validate,
    idParamValidationRule
};