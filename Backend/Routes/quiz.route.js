const express = require("express");
const quizController = require("../controllers/quiz.controller");
const { authorization, isAdmin } = require("../middlewares/auth.middleware");
const {
  createQuizValidationRules,
  updateQuizValidationRules,
} = require("../middlewares/validation/quiz.validation");

const {
  validate,
  idParamValidationRule,
} = require("../middlewares/validation/common.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management endpoints
 */

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of all quizzes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 quizzes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz' # Assuming a Quiz schema definition exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authorization, quizController.get_all_quizzes);

/**
 * @swagger
 * /quizzes/create:
 *   post:
 *     summary: Create a new quiz (Admin only)
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the quiz
 *                 example: General Knowledge Quiz
 *               description:
 *                 type: string
 *                 description: Optional description for the quiz
 *                 example: A fun quiz about various topics.
 *               category:
 *                 type: string
 *                 description: Optional category for the quiz
 *                 example: Trivia
 *               timeLimit:
 *                 type: integer
 *                 format: int32
 *                 description: Optional time limit in minutes
 *                 example: 10
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 description: Array of Question ObjectIds to include in the quiz (min 1)
 *                 example: ["60d5ecf31c9d440000a1b2c3", "60d5ecf31c9d440000a1b2c4"]
 *     responses:
 *       201:
 *         description: Quiz created successfully.
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
 *                   example: Quiz created successfully
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User is not an admin)
 *       500:
 *         description: Server error
 */
router.post(
  "/create",
  authorization,
  isAdmin,
  createQuizValidationRules,
  validate,
  quizController.create_quiz
);

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get a specific quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The quiz ID
 *     responses:
 *       200:
 *         description: Quiz details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid quiz ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  authorization,
  idParamValidationRule,
  validate,
  quizController.get_quiz
);

/**
 * @swagger
 * /quizzes/update/{id}:
 *   put:
 *     summary: Update a quiz's details (Admin only)
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The quiz ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: # Fields are optional based on validation
 *               title:
 *                 type: string
 *                 description: New title for the quiz
 *               description:
 *                 type: string
 *                 description: New description for the quiz
 *               category:
 *                 type: string
 *                 description: New category for the quiz
 *               timeLimit:
 *                 type: integer
 *                 format: int32
 *                 description: New time limit in minutes
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 description: New array of Question ObjectIds
 *     responses:
 *       200:
 *         description: Quiz updated successfully.
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
 *                   example: Quiz updated successfully
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid quiz ID format or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User is not an admin)
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.put(
  "/update/:id",
  authorization,
  isAdmin,
  idParamValidationRule,
  updateQuizValidationRules,
  validate,
  quizController.update_quiz
);

/**
 * @swagger
 * /quizzes/add_question/{id}:
 *   put:
 *     summary: Add questions to an existing quiz (Admin only)
 *     description: This endpoint likely merges new questions with existing ones, or replaces them. Check controller logic for specifics. The request body schema is similar to update.
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The quiz ID to add questions to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: # Assuming it primarily uses the 'questions' field
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 description: Array of Question ObjectIds to add/set
 *                 example: ["60d5ecf31c9d440000a1b2c5"]
 *     responses:
 *       200:
 *         description: Questions added/updated successfully.
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
 *                   example: Questions added successfully # Or similar based on controller
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid quiz ID format or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User is not an admin)
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.put(
  "/add_question/:id",
  authorization,
  isAdmin,
  idParamValidationRule,
  updateQuizValidationRules,
  validate,
  quizController.add_Question
);

/**
 * @swagger
 * /quizzes/delete/{id}:
 *   delete:
 *     summary: Delete a quiz (Admin only)
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: The quiz ID to delete
 *     responses:
 *       200:
 *         description: Quiz deleted successfully.
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
 *                   example: Quiz deleted successfully
 *       400:
 *         description: Invalid quiz ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User is not an admin)
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/delete/:id",
  authorization,
  isAdmin,
  idParamValidationRule,
  validate,
  quizController.delete_quiz
);

module.exports = router;
