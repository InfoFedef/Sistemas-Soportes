const express = require('express');
const { obtenerEstadisticas, exportarEstadisticas } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', obtenerEstadisticas);
router.get('/export', exportarEstadisticas);

module.exports = router;