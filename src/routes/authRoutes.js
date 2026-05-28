const express = require('express');
const router = express.Router();
const { 
  showLogin, 
  login, 
  showRegister, 
  register, 
  logout 
} = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/authMiddleware');

router.route('/login')
  .get(redirectIfAuthenticated, showLogin)
  .post(redirectIfAuthenticated, login);

router.route('/register')
  .get(redirectIfAuthenticated, showRegister)
  .post(redirectIfAuthenticated, register);

router.get('/logout', logout);

module.exports = router;