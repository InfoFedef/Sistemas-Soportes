const { MesaAyuda } = require('../models');
const { Op } = require('sequelize');

const buscarSoluciones = async (req, res) => {
  try {
    const { palabra_clave } = req.query;

    if (!palabra_clave) {
      return res.status(400).json({ message: 'Palabra clave es requerida' });
    }

    const soluciones = await MesaAyuda.findAll({
      where: {
        activo: true,
        [Op.or]: [
          { problema: { [Op.like]: `%${palabra_clave}%` } },
          { solucion: { [Op.like]: `%${palabra_clave}%` } },
          { palabras_clave: { [Op.like]: `%${palabra_clave}%` } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(soluciones);

  } catch (error) {
    console.error('Error buscando soluciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const obtenerTodasSoluciones = async (req, res) => {
  try {
    const soluciones = await MesaAyuda.findAll({
      where: { activo: true },
      order: [['categoria', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json(soluciones);

  } catch (error) {
    console.error('Error obteniendo soluciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const crearSolucion = async (req, res) => {
  try {
    const { problema, solucion, palabras_clave, categoria } = req.body;

    if (!problema || !solucion || !palabras_clave || !categoria) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos' 
      });
    }

    const nuevaSolucion = await MesaAyuda.create({
      problema,
      solucion,
      palabras_clave,
      categoria
    });

    res.status(201).json({
      message: 'Solución creada exitosamente',
      solucion: nuevaSolucion
    });

  } catch (error) {
    console.error('Error creando solución:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { buscarSoluciones, obtenerTodasSoluciones, crearSolucion };
