const express = require('express');
const { login, register } = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register', authenticateToken, requireAdmin, register);

module.exports = router;