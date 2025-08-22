# Sistema de Gestión de Soporte Técnico

## 📋 Descripción
Sistema web completo para la gestión centralizada de reportes de soporte técnico, con notificaciones automáticas por correo, dashboards estadísticos y base de conocimiento.

## 🚀 Características Principales
- ✅ Autenticación JWT con roles (admin/user)
- ✅ Registro de reportes por usuarios y administradores
- ✅ Notificaciones automáticas por correo electrónico
- ✅ Dashboard con estadísticas y gráficas interactivas
- ✅ Sistema de seguimiento y cierre de casos
- ✅ Mesa de ayuda con base de conocimiento
- ✅ Exportación de reportes (PDF/Excel)
- ✅ Interfaz responsive con Tailwind CSS

## 🛠 Tecnologías Utilizadas

### Backend
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT para autenticación
- Nodemailer para envío de correos
- Bcrypt para encriptación

### Frontend
- React 18 + Vite
- Tailwind CSS
- Recharts para gráficas
- React Hook Form
- Axios para peticiones HTTP

## 📦 Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- MySQL (v8 o superior)
- Git

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd sistema-gestion-soporte
```

### 2. Instalar dependencias
```bash
npm run install:all
```

### 3. Configurar base de datos
```sql
CREATE DATABASE soporte_tecnico CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Configurar variables de entorno
Crear archivo `backend/.env`:
```env
# Configuración del servidor
PORT=3000

# Configuración de la base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=soporte_tecnico

# JWT Secret
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_cambiar_en_produccion

# Configuración de correo
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# URL del frontend
FRONTEND_URL=http://localhost:5173
```

### 5. Inicializar base de datos
```bash
cd backend
npm run init
```

### 6. Ejecutar el proyecto
```bash
# Desde la raíz del proyecto
npm run dev
```

## 🔐 Credenciales por Defecto
- **Administrador**: admin@empresa.com / password123
- **Usuario**: user@empresa.com / password123

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (solo admin)

### Reportes
- `GET /api/reportes` - Obtener reportes
- `POST /api/reportes` - Crear nuevo reporte
- `GET /api/reportes/:id` - Obtener reporte específico
- `PUT /api/reportes/:id/cerrar` - Cerrar reporte

### Dashboard
- `GET /api/dashboard` - Obtener estadísticas
- `GET /api/dashboard/export` - Exportar estadísticas

### Mesa de Ayuda
- `GET /api/mesa-ayuda` - Buscar soluciones
- `GET /api/mesa-ayuda/todas` - Obtener todas las soluciones
- `POST /api/mesa-ayuda` - Crear nueva solución (solo admin)

## 🌐 URLs de Acceso
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

## 📊 Funcionalidades Detalladas

### Dashboard Administrativo
- Estadísticas mensuales con auto-reset
- Gráficas por área, categoría y estado
- Volumen de reportes diarios
- Exportación en PDF y Excel

### Sistema de Reportes
- Registro por usuarios finales
- Asignación automática de técnicos
- Estados: Abierto, En proceso, Cerrado
- Prioridades: Baja, Media, Alta, Crítica
- Notificaciones automáticas por email

### Mesa de Ayuda
- Base de conocimiento searchable
- Categorización de soluciones
- Gestión de contenido por administradores
- Búsqueda por palabras clave

## 🔧 Configuración Adicional

### Configuración de Correo
Para Gmail, usar contraseñas de aplicación:
1. Activar autenticación de 2 factores
2. Generar contraseña de aplicación
3. Usar la contraseña generada en EMAIL_PASS

### Base de Datos
El sistema incluye script de inicialización que:
- Crea tablas automáticamente
- Inserta usuarios por defecto
- Agrega soluciones de ejemplo

## 🚀 Despliegue en Producción

### Variables de Entorno Adicionales
```env
NODE_ENV=production
DB_SSL=true
FRONTEND_URL=https://tu-dominio.com
```

### Comandos de Producción
```bash
# Construir frontend
cd frontend
npm run build

# Iniciar backend en producción
cd backend
npm start
```