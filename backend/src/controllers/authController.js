const jwt = require('jsonwebtoken');
const { User } = require('../models');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }

    const user = await User.findOne({ where: { email, activo: true } });
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    const isValidPassword = await user.validatePassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        rol: user.rol 
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
        rol: user.rol
      },
      expira_en: '30m'
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, email, password, rol = 'user' } = req.body;

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
      rol
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login, register };
