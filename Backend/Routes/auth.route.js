const authController = require("../controllers/auth.controller");
const { isGuest, authorization } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation/common.validation");
const express = require("express");

const {
  registerUserValidationRules,
  loginUserValidationRules,
} = require("../middlewares/validation/auth.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoint for user authentication (login, registration, logout)
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Desired username (min 3 characters, unique)
 *                 example: testuser
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (unique)
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (min 6 characters)
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully.
 *       400:
 *         description: Validation failed (e.g., missing fields, invalid format)
 *       409:
 *         description: Username or email already exists
 *       500:
 *         description: Server error during registration
 */
router.post(
  "/register",
  registerUserValidationRules,
  validate,
  authController.register
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Registered username
 *                 example: testuser
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in. Sets an HTTP-only cookie 'token'.
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
 *                   example: Successfully logged in.
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error during login
 */
router.post(
  "/login",
  isGuest,
  loginUserValidationRules,
  validate,
  authController.login
);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: [] # Indicates this route requires the 'token' cookie
 *     responses:
 *       200:
 *         description: Successfully logged out. Clears the 'token' cookie.
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
 *                   example: Successfully logged out.
 *       500:
 *         description: Server error during logout
 */
router.post("/logout", authorization, authController.logout);

module.exports = router;
