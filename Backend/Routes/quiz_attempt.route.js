const express = require("express");
const Router = express.Router();
const Quiz_attempt = require("../controllers/quiz_attempt.controller");
const { authorization } = require("../middlewares/auth.middleware");
const { validateSubmitQuiz } = require("../middlewares/validation/quiz_attempt.validation");

/**
 * @swagger
 * tags:
 *   name: Quiz Attempts
 *   description: Endpoints for managing quiz attempts
 */

/**
 * @swagger
 * /attempts:
 *   get:
 *     summary: Get all quiz attempts (Admin/Debug purposes likely)
 *     tags: [Quiz Attempts]
 *     security:
 *       - cookieAuth: [] # Assuming admin or specific authorization needed
 *     responses:
 *       200:
 *         description: A list of all quiz attempts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 attempts: # Assuming the controller returns 'attempts'
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuizAttempt' # Assuming a QuizAttempt schema definition exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
Router.get("/", Quiz_attempt.get_all_attempts); // Might need admin middleware

/**
 * @swagger
 * /attempts/start/{id}:
 *   post:
 *     summary: Start a new attempt for a specific quiz
 *     tags: [Quiz Attempts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The ID of the Quiz to start an attempt for
 *     responses:
 *       201: # Assuming 201 for creation
 *         description: Quiz attempt started successfully. Returns the new attempt details.
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
 *                   example: Quiz attempt started
 *                 attempt:
 *                   $ref: '#/components/schemas/QuizAttempt'
 *       400:
 *         description: Invalid Quiz ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error (e.g., failed to create attempt)
 */
Router.post("/start/:id", authorization ,Quiz_attempt.start);

/**
 * @swagger
 * /attempts/submit/{id}:
 *   post:
 *     summary: Submit answers for an ongoing quiz attempt
 *     tags: [Quiz Attempts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The ID of the Quiz Attempt being submitted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_answers
 *             properties:
 *               user_answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question
 *                     - answer
 *                   properties:
 *                     question:
 *                       type: string
 *                       format: ObjectId
 *                       description: The ID of the question being answered
 *                     answer:
 *                       type: string # Or appropriate type based on question format
 *                       description: The user's selected answer
 *                 description: Array of user answers
 *                 example: [{ "question": "60d5ecf31c9d440000a1b2c3", "answer": "Paris" }]
 *     responses:
 *       200:
 *         description: Quiz submitted successfully. Returns the completed attempt details with score.
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
 *                   example: Quiz submitted successfully
 *                 attempt:
 *                   $ref: '#/components/schemas/QuizAttempt' # Should include score now
 *       400:
 *         description: Validation failed (Invalid Attempt ID, already submitted, time limit exceeded, invalid answers format)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attempt not found
 *       500:
 *         description: Server error during submission/scoring
 */
Router.post("/submit/:id", authorization, validateSubmitQuiz, Quiz_attempt.submit_quiz);

/**
 * @swagger
 * /attempts/{id}:
 *   get:
 *     summary: Get a specific quiz attempt by ID
 *     tags: [Quiz Attempts]
 *     security:
 *       - cookieAuth: [] # Assuming user can get their own or admin can get any
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The quiz attempt ID
 *     responses:
 *       200:
 *         description: Quiz attempt details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 attempt: # Assuming controller returns 'attempt'
 *                   $ref: '#/components/schemas/QuizAttempt'
 *       400:
 *         description: Invalid attempt ID format
 *       401:
 *         description: Unauthorized (or not owner/admin)
 *       404:
 *         description: Attempt not found
 *       500:
 *         description: Server error
 */
Router.get("/:id", Quiz_attempt.get_attempt); // Might need authorization middleware

/**
 * @swagger
 * /attempts/{id}:
 *   post:
 *     summary: Create a quiz attempt (Potentially redundant/unclear purpose)
 *     description: The purpose of this endpoint is unclear compared to `/start/{id}`. Documenting as found.
 *     tags: [Quiz Attempts]
 *     security:
 *       - cookieAuth: [] # Assuming authorization needed
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: ID related to the attempt creation (Quiz ID? User ID?) - Needs clarification
 *     responses:
 *       201:
 *         description: Attempt created (if successful).
 *       400:
 *         description: Invalid ID or other error.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
Router.post("/:id", Quiz_attempt.createAttempt); // Might need authorization middleware

/**
 * @swagger
 * /attempts/{id}:
 *   put:
 *     summary: Update a quiz attempt (Purpose unclear)
 *     description: The specific use case for updating an attempt is unclear. Documenting as found.
 *     tags: [Quiz Attempts]
 *     security:
 *       - cookieAuth: [] # Assuming authorization needed
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The quiz attempt ID to update
 *     requestBody:
 *       description: Fields to update (schema unknown)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             # Add properties here based on what can be updated
 *     responses:
 *       200:
 *         description: Attempt updated successfully.
 *       400:
 *         description: Invalid ID or validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Attempt not found.
 *       500:
 *         description: Server error.
 */
Router.put("/:id", Quiz_attempt.updateAttempt); // Might need authorization middleware

/**
 * @swagger
 * /attempts/{id}:
 *   delete:
 *     summary: Delete a quiz attempt (Admin/Owner likely)
 *     tags: [Quiz Attempts]
 *     security:
 *       - cookieAuth: [] # Assuming authorization needed
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The quiz attempt ID to delete
 *     responses:
 *       200:
 *         description: Attempt deleted successfully.
 *       400:
 *         description: Invalid attempt ID format.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Attempt not found.
 *       500:
 *         description: Server error.
 */
Router.delete("/:id", Quiz_attempt.delete_attempt); // Might need authorization middleware

module.exports = Router;
