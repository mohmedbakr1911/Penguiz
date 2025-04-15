const express = require('express');
const questionController = require('../controllers/question.controller');
const { validate, idParamValidationRule } = require('../middlewares/validation/common.validation');
const { createQuestionValidationRules, updateQuestionValidationRules } = require('../middlewares/validation/question.validation');
const { authorization, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authorization);

router.post('/create',authorization,isAdmin, createQuestionValidationRules, validate, questionController.create_question);
router.get('/', authorization, questionController.get_all_questions);

router.get('/:id', authorization, idParamValidationRule, validate, questionController.get_question);
router.put('/update/:id', isAdmin, idParamValidationRule, updateQuestionValidationRules, validate, questionController.update_question);
router.delete('/delete/:id', isAdmin, idParamValidationRule, validate, questionController.delete_question);


module.exports = router;