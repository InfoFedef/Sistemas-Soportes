const User = require('./User');
const Reporte = require('./Reporte');
const MesaAyuda = require('./MesaAyuda');

// Definir asociaciones
User.hasMany(Reporte, { foreignKey: 'usuario_id' });
Reporte.belongsTo(User, { foreignKey: 'usuario_id' });

module.exports = {
  User,
  Reporte,
  MesaAyuda
};