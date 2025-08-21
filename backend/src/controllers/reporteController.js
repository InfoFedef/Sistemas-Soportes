const { Reporte } = require('../models');
const { enviarNotificacionReporte } = require('../utils/email');

const crearReporte = async (req, res) => {
  try {
    const reporteData = {
      ...req.body,
      usuario_id: req.user.id
    };

    const reporte = await Reporte.create(reporteData);

    // Enviar notificaciones por correo
    const notificacionEnviada = await enviarNotificacionReporte(reporte, req.user);

    // Actualizar estado de notificaciones
    await reporte.update({
      notificado_admin: notificacionEnviada,
      notificado_usuario: notificacionEnviada
    });

    res.status(201).json({
      id: reporte.id,
      mensaje: 'Reporte creado correctamente',
      reporte: reporte,
      notificado_admin: notificacionEnviada,
      notificado_usuario: notificacionEnviada
    });

  } catch (error) {
    console.error('Error creando reporte:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const obtenerReportes = async (req, res) => {
  try {
    const where = {};
    
    // Si no es admin, solo mostrar sus propios reportes
    if (req.user.rol !== 'admin') {
      where.usuario_id = req.user.id;
    }

    const reportes = await Reporte.findAll({
      where,
      include: [{
        model: require('../models').User,
        attributes: ['nombre', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(reportes);

  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const obtenerReportePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const where = { id };

    // Si no es admin, solo puede ver sus propios reportes
    if (req.user.rol !== 'admin') {
      where.usuario_id = req.user.id;
    }

    const reporte = await Reporte.findOne({
      where,
      include: [{
        model: require('../models').User,
        attributes: ['nombre', 'email']
      }]
    });

    if (!reporte) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    res.json(reporte);

  } catch (error) {
    console.error('Error obteniendo reporte:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const cerrarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const { observaciones } = req.body;
    const cerrado_por = req.user.rol === 'admin' ? 'admin' : 'usuario';

    const where = { id };

    // Si no es admin, solo puede cerrar sus propios reportes
    if (req.user.rol !== 'admin') {
      where.usuario_id = req.user.id;
    }

    const reporte = await Reporte.findOne({ where });

    if (!reporte) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    if (reporte.estado === 'Cerrado') {
      return res.status(400).json({ message: 'El reporte ya está cerrado' });
    }

    await reporte.update({
      estado: 'Cerrado',
      cerrado_por,
      observaciones,
      fecha_fin: new Date()
    });

    res.json({
      id: reporte.id,
      estado: 'Cerrado',
      cerrado_por,
      mensaje: 'Caso cerrado exitosamente'
    });

  } catch (error) {
    console.error('Error cerrando reporte:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  crearReporte,
  obtenerReportes,
  obtenerReportePorId,
  cerrarReporte
};