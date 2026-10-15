const express = require('express');
const router = express.Router();
const authController = require('../control/authController');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/forgot-password', authController.requestResetPassword);
router.post('/reset-password', authController.resetPassword);

router.get('/profile', authController.getProfile);
router.put('/profile', authController.editProfile);

router.get('/users', authController.getAllUsers);
router.delete('/users/:id', authController.delete_user);
router.put('/users/:id', authController.edit_user);
router.patch('/users/:id', authController.patch_user);
module.exports = router;

