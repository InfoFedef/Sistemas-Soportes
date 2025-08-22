const jwt = require('jsonwebtoken');
const { User } = require('../models');

const login = async (req, res) => {
  try {
    console.log('📥 Login request recibido:', req.body); // DEBUG
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Cambiar activo: true por activo: 1
    const user = await User.findOne({ where: { email, activo: 1 } });
    console.log('👤 Usuario encontrado:', user ? 'SÍ' : 'NO'); // DEBUG
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas - Usuario no encontrado' 
      });
    }

    console.log('📊 Datos del usuario:', {
      id: user.id,
      email: user.email,
      rol: user.rol,  // Cambiar 'role' por 'rol'
      activo: user.activo
    }); // DEBUG

    const isValidPassword = await user.validatePassword(password);
    console.log('🔐 Contraseña válida:', isValidPassword); // DEBUG
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas - Contraseña incorrecta' 
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        rol: user.rol  // Cambiar 'role' por 'rol'
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol  // Cambiar 'role' por 'rol'
      },
      expira_en: '30m'
    });

  } catch (error) {
    console.error('🔥 ERROR EN LOGIN:', error); // DEBUG MEJORADO
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, email, password, rol = 'usuario' } = req.body; // Cambiar 'role' por 'rol'

    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        message: 'Nombre, email y contraseña son requeridos' 
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'El email ya está registrado' 
      });
    }

    const user = await User.create({
      nombre,
      email,
      password,
      rol // Cambiar 'role' por 'rol'
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol // Cambiar 'role' por 'rol'
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login, register };