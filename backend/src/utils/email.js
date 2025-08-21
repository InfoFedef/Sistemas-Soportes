const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const enviarNotificacionReporte = async (reporte, usuario) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Nuevo Reporte de Soporte Creado</h2>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
        <p><strong>ID del Reporte:</strong> #${reporte.id}</p>
        <p><strong>Contacto:</strong> ${reporte.contacto}</p>
        <p><strong>Área:</strong> ${reporte.area}</p>
        <p><strong>Categoría:</strong> ${reporte.categoria}</p>
        <p><strong>Prioridad:</strong> ${reporte.prioridad}</p>
        <p><strong>Descripción:</strong> ${reporte.descripcion}</p>
        <p><strong>Estado:</strong> ${reporte.estado}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
      </div>
      <p style="margin-top: 20px;">Este reporte ha sido registrado en el sistema de soporte técnico.</p>
    </div>
  `;

  try {
    // Notificar al usuario
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: usuario.email,
      subject: `Reporte #${reporte.id} - Creado exitosamente`,
      html: htmlTemplate
    });

    // Notificar al administrador (buscar admin activo)
    const admin = await require('../models').User.findOne({ 
      where: { rol: 'admin', activo: true }
    });

    if (admin) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: `Nuevo Reporte #${reporte.id} - Requiere Atención`,
        html: htmlTemplate
      });
    }

    return true;
  } catch (error) {
    console.error('Error enviando notificaciones:', error);
    return false;
  }
};

module.exports = { enviarNotificacionReporte };