const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MesaAyuda = sequelize.define('MesaAyuda', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  problema: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  solucion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  palabras_clave: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'mesa_ayuda'
});

module.exports = MesaAyuda;
