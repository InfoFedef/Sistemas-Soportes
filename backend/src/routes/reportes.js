const express = require('express');
const {
  crearReporte,
  obtenerReportes,
  obtenerReportePorId,
  cerrarReporte
} = require('../controllers/reporteController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.post('/', crearReporte);
router.get('/', obtenerReportes);
router.get('/:id', obtenerReportePorId);
router.put('/:id/cerrar', cerrarReporte);

module.exports = router;