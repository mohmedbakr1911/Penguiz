const express = require('express')
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()

router.get('/', authMiddleware.authorization, authMiddleware.isAdmin, userController.get_all_users);
router.get('/:id', authMiddleware.authorization, authMiddleware.isAdmin, userController.getUser);
router.put('/update/:id', authMiddleware.authorization, authMiddleware.isAdmin, userController.updateUser);
router.delete('/delete/:id', authMiddleware.authorization, authMiddleware.isAdmin, userController.deleteUser);

module.exports = router

