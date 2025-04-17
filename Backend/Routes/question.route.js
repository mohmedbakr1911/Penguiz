const express = require('express');
const questionController = require('../controllers/question.controller');
const { validate, idParamValidationRule } = require('../middlewares/validation/common.validation');
const { createQuestionValidationRules, updateQuestionValidationRules } = require('../middlewares/validation/question.validation');
const { authorization, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management endpoints
 */

// Apply authorization middleware to all routes in this file
router.use(authorization);

/**
 * @swagger
 * /questions/create:
 *   post:
 *     summary: Create a new question (Admin only)
 *     tags: [Questions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - options
 *               - correctAnswer
 *             properties:
 *               text:
 *                 type: string
 *                 description: The question text
 *                 example: What is the capital of France?
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 2
 *                 description: Array of possible answers (min 2)
 *                 example: ["Paris", "London", "Berlin", "Madrid"]
 *               correctAnswer:
 *                 type: string
 *                 description: The correct answer from the options array
 *                 example: Paris
 *               category:
 *                 type: string
 *                 description: Optional category for the question
 *                 example: Geography
 *     responses:
 *       201:
 *         description: Question created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Question created successfully
 *                 question:
 *                   $ref: '#/components/schemas/Question' # Assuming a Question schema definition exists
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User is not an admin)
 *       500:
 *         description: Server error
 */
router.post('/create', authorization, isAdmin, createQuestionValidationRules, validate, questionController.create_question);

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of all questions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authorization, questionController.get_all_questions);

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Get a specific question by ID
 *     tags: [Questions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The question ID
 *     responses:
 *       200:
 *         description: Question details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Invalid question ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authorization, idParamValidationRule, validate, questionController.get_question);

/**
 * @swagger
 * /questions/update/{id}:
 *   put:
 *     summary: Update a question's details (Admin only)
 *     tags: [Questions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The question ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: # Fields are optional based on validation
 *               text:
 *                 type: string
 *                 description: New question text
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 2
 *                 description: New array of possible answers (min 2)
 *               correctAnswer:
 *                 type: string
 *                 description: New correct answer
 *               category:
 *                 type: string
 *                 description: New category
 *     responses:
 *       200:
 *         description: Question updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Question updated successfully
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Invalid question ID format or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User is not an admin)
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.put('/update/:id', authorization, isAdmin, idParamValidationRule, updateQuestionValidationRules, validate, questionController.update_question); // Added authorization back as it was in the original code, assuming admin check is sufficient

/**
 * @swagger
 * /questions/delete/{id}:
 *   delete:
 *     summary: Delete a question (Admin only)
 *     tags: [Questions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The question ID to delete
 *     responses:
 *       200:
 *         description: Question deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Question deleted successfully
 *       400:
 *         description: Invalid question ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User is not an admin)
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:id', authorization, isAdmin, idParamValidationRule, validate, questionController.delete_question); // Added authorization back as it was in the original code, assuming admin check is sufficient


module.exports = router;
