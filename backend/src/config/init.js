const { sequelize } = require('./database');
const { User, Reporte, MesaAyuda } = require('../models');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Sincronizando base de datos...');

    // Sincronizar tablas
    await sequelize.sync({ force: false });
    console.log('✅ Base de datos sincronizada');

    // Verificar si existe usuario admin
    const adminExists = await User.findOne({ where: { rol: 'admin' } });

    if (!adminExists) {
      console.log('👤 Creando usuario administrador...');
      await User.create({
        nombre: 'Administrador',
        email: 'admin@empresa.com',
        password: 'password123', // será hasheada por el hook
        rol: 'admin'
      });
      console.log('✅ Usuario administrador creado');
      console.log('📧 Email: admin@empresa.com');
      console.log('🔑 Contraseña: password123');
    }

    // Verificar si existe usuario de prueba
    const userExists = await User.findOne({ where: { email: 'user@empresa.com' } });

    if (!userExists) {
      console.log('👤 Creando usuario de prueba...');
      await User.create({
        nombre: 'Usuario Prueba',
        email: 'user@empresa.com',
        password: 'password123', // será hasheada por el hook
        rol: 'user'
      });
      console.log('✅ Usuario de prueba creado');
      console.log('📧 Email: user@empresa.com');
      console.log('🔑 Contraseña: password123');
    }

    // Crear soluciones en mesa de ayuda
    const solucionesCount = await MesaAyuda.count();

    if (solucionesCount === 0) {
      console.log('💡 Creando soluciones de ejemplo...');
      const solucionesEjemplo = [
        {
          problema: 'La impresora no imprime',
          solucion: '1. Verificar que la impresora esté encendida\n2. Revisar conexión USB o red\n3. Verificar que tenga papel y tinta\n4. Reinstalar drivers si es necesario\n5. Reiniciar el spooler de impresión',
          palabras_clave: 'impresora, drivers, usb, papel, tinta',
          categoria: 'Hardware'
        },
        {
          problema: 'No puedo acceder al correo electrónico',
          solucion: '1. Verificar conexión a internet\n2. Comprobar configuración de servidor SMTP/POP3\n3. Verificar usuario y contraseña\n4. Revisar configuración de antivirus/firewall\n5. Contactar al administrador de red',
          palabras_clave: 'correo, email, smtp, pop3, contraseña',
          categoria: 'Software'
        },
        {
          problema: 'Internet muy lento',
          solucion: '1. Reiniciar el router/modem\n2. Verificar ancho de banda contratado\n3. Revisar número de dispositivos conectados\n4. Realizar test de velocidad\n5. Contactar al proveedor de internet si persiste',
          palabras_clave: 'internet, lento, router, ancho de banda, velocidad',
          categoria: 'Red'
        },
        {
          problema: 'El equipo se congela o funciona muy lento',
          solucion: '1. Verificar uso de CPU y RAM en el administrador de tareas\n2. Cerrar programas innecesarios\n3. Verificar espacio en disco duro\n4. Ejecutar antivirus completo\n5. Considerar actualización de hardware',
          palabras_clave: 'lento, congelado, ram, cpu, disco duro',
          categoria: 'Hardware'
        },
        {
          problema: 'No puedo conectarme a la red WiFi',
          solucion: '1. Verificar que el WiFi esté activado\n2. Comprobar contraseña de red\n3. Reiniciar adaptador de red\n4. Olvidar y reconectar a la red\n5. Actualizar drivers de red',
          palabras_clave: 'wifi, red, contraseña, adaptador, drivers',
          categoria: 'Red'
        }
      ];

      await MesaAyuda.bulkCreate(solucionesEjemplo);
      console.log('✅ Soluciones de ejemplo creadas');
    }

    console.log('🎉 Inicialización completada exitosamente');
  } catch (error) {
    console.error('❌ Error en la inicialización:', error);
    throw error;
  }
};

module.exports = { initializeDatabase };
