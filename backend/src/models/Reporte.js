const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reporte = sequelize.define('Reporte', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_atencion: {
    type: DataTypes.ENUM('Remoto', 'Presencial'),
    allowNull: false
  },
  oficina: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  area: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contacto: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  tecnico: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  medio: {
    type: DataTypes.ENUM('Correo', 'Teléfono', 'Presencial', 'Chat'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Abierto', 'En proceso', 'Cerrado'),
    defaultValue: 'Abierto'
  },
  categoria: {
    type: DataTypes.ENUM('Hardware', 'Software', 'Red', 'Seguridad', 'Otro'),
    allowNull: false
  },
  prioridad: {
    type: DataTypes.ENUM('Baja', 'Media', 'Alta', 'Crítica'),
    defaultValue: 'Media'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notificado_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notificado_usuario: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cerrado_por: {
    type: DataTypes.ENUM('admin', 'usuario'),
    allowNull: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'reportes_soporte',
  timestamps: false // AGREGAR ESTA LÍNEA
});

module.exports = Reporte;
