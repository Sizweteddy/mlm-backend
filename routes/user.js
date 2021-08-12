const express = require('express'),
  router = express.Router(),
  { register, login, logout, getMe } = require('../controllers/user'),
  { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
