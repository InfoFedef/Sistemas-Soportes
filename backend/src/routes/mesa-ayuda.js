const express = require('express');
const { 
  buscarSoluciones, 
  obtenerTodasSoluciones, 
  crearSolucion 
} = require('../controllers/mesaAyudaController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', buscarSoluciones);
router.get('/todas', obtenerTodasSoluciones);
router.post('/', requireAdmin, crearSolucion);

module.exports = router;