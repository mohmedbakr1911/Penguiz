const express = require('express')
const router = express.Router();
const submit = require('../controllers/timeLimit.controller')
router.post('/submit_quiz', submit.submit_quiz);