const { Reporte } = require('../models');
const { Op } = require('sequelize');

const obtenerEstadisticas = async (req, res) => {
  try {
    const fechaActual = new Date();
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

    // Reportes por área
    const reportesPorArea = await Reporte.findAll({
      attributes: [
        'area',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'cantidad']
      ],
      where: {
        createdAt: {
          [Op.between]: [primerDiaMes, ultimoDiaMes]
        }
      },
      group: ['area']
    });

    // Reportes por categoría
    const reportesPorCategoria = await Reporte.findAll({
      attributes: [
        'categoria',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'cantidad']
      ],
      where: {
        createdAt: {
          [Op.between]: [primerDiaMes, ultimoDiaMes]
        }
      },
      group: ['categoria']
    });

    // Reportes por estado
    const reportesPorEstado = await Reporte.findAll({
      attributes: [
        'estado',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'cantidad']
      ],
      where: {
        createdAt: {
          [Op.between]: [primerDiaMes, ultimoDiaMes]
        }
      },
      group: ['estado']
    });

    // Volumen diario del mes
    const volumenMensual = await Reporte.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'fecha'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'cantidad']
      ],
      where: {
        createdAt: {
          [Op.between]: [primerDiaMes, ultimoDiaMes]
        }
      },
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
    });

    // Formatear datos para el frontend
    const formatearDatos = (datos) => {
      return datos.reduce((acc, item) => {
        const key = item.dataValues.area || item.dataValues.categoria || item.dataValues.estado;
        acc[key] = parseInt(item.dataValues.cantidad);
        return acc;
      }, {});
    };

    res.json({
      reportes_por_area: formatearDatos(reportesPorArea),
      reportes_por_categoria: formatearDatos(reportesPorCategoria),
      reportes_por_estado: formatearDatos(reportesPorEstado),
      volumen_mensual: volumenMensual.map(item => ({
        fecha: item.dataValues.fecha,
        cantidad: parseInt(item.dataValues.cantidad)
      })),
      mes_actual: {
        nombre: fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        inicio: primerDiaMes,
        fin: ultimoDiaMes
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const exportarEstadisticas = async (req, res) => {
  try {
    const { formato = 'pdf' } = req.query;
    
    // Obtener estadísticas del mes actual
    const estadisticas = await obtenerEstadisticas(req, res);
    
    if (formato === 'pdf') {
      // Aquí implementarías la generación de PDF
      res.json({ 
        message: 'Funcionalidad de PDF en desarrollo',
        tipo: 'pdf',
        datos: estadisticas
      });
    } else if (formato === 'excel') {
      // Aquí implementarías la generación de Excel
      res.json({ 
        message: 'Funcionalidad de Excel en desarrollo',
        tipo: 'excel',
        datos: estadisticas
      });
    } else {
      res.status(400).json({ message: 'Formato no válido. Use pdf o excel' });
    }

  } catch (error) {
    console.error('Error exportando estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { obtenerEstadisticas, exportarEstadisticas };
