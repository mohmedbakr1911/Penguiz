const authController = require('../controllers/auth.controller')
const { isGuest, authorization } = require('../middlewares/auth.middleware')
const { validate } = require('../middlewares/validation/common.validation')
const express = require('express')

const {
    registerUserValidationRules,
    loginUserValidationRules
} = require('../middlewares/validation/auth.validation')

const router = express.Router()

router.post('/register',
    registerUserValidationRules,
    validate,
    authController.register
)

router.post('/login',
    isGuest,
    loginUserValidationRules,
    validate,
    authController.login
)

router.post('/logout', authorization, authController.logout)

module.exports = router
