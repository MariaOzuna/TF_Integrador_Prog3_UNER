Este proyecto es el backend de una aplicación para la gestión de reservas de salones y servicios. Ha sido desarrollado como Trabajo Final Integrador para la materia Programación 3 de la UNER.

La aplicación expone una API RESTful para administrar usuarios, salones, servicios, turnos y las reservas asociadas.

** Características Principales
*Gestión de Usuarios: Autenticación y registro de usuarios (clientes y administradores) usando Passport.js con JSON Web Tokens (JWT).

*Gestión de Salones: CRUD completo para administrar los salones disponibles.

*Gestión de Servicios: CRUD para los servicios adicionales que se pueden contratar (ej. catering, sonido).

*Gestión de Turnos: Administración de los turnos (mañana, tarde, noche) disponibles para reservar.

*Sistema de Reservas: Lógica para crear, consultar, actualizar y cancelar reservas, vinculando salones, servicios y usuarios.

*Notificaciones por Email: Envío automático de correos electrónicos (usando Nodemailer) para confirmación de registro y detalles de reservas.

*Documentación de API: Documentación automática y navegable de todos los endpoints usando Swagger.

*Validación: Validación de los datos de entrada en las rutas usando express-validator.

*Caché: Implementación de caché en ciertas rutas (ej. listado de salones) para mejorar el rendimiento usando apicache.

** Stack Tecnológico
*Backend: Node.js

*Framework: Express.js

*Base de Datos: MySQL (con el driver mysql2)

*Autenticación: Passport.js (passport-jwt)

*Documentación API: swagger-jsdoc y swagger-ui-express

*Envío de Emails: Nodemailer

*Plantillas de Email: Handlebars

*Validación: express-validator

** Instalación y Puesta en Marcha
Sigue estos pasos para levantar el proyecto en un entorno local.

1. Prerrequisitos
Tener instalado Node.js (versión 18+ recomendada).

Tener una instancia de MySQL en ejecución.

2. Instalación
*Clona el repositorio:

git clone https://github.com/usuario/tf_integrador_prog3_uner.git
cd tf_integrador_prog3_uner

*Instala las dependencias del proyecto:

npm install

3. Configuración de Entorno
Este proyecto requiere variables de entorno para funcionar. Crea un archivo .env en la raíz del proyecto (puedes duplicar y renombrar el archivo .env.example si existe).

Tu archivo .env debería verse así:

Fragmento de código

# Configuración del Servidor
PORT=3000

# Configuración de la Base de Datos
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_DATABASE=nombre_de_tu_base_de_datos
DB_PORT=3306

# Secret para JSON Web Token (JWT)
JWT_SECRET=tu_palabra_secreta_para_jwt

# Configuración de Nodemailer (ej. para Gmail)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_de_google
Nota sobre EMAIL_PASS: Si usas Gmail, debes generar una "Contraseña de aplicación" desde la configuración de seguridad de tu cuenta de Google, no uses tu contraseña habitual.

4. Ejecutar la Aplicación

*Para iniciar el servidor en modo desarrollo (con recarga automática):

npm run dev

*Para iniciar el servidor en modo producción:

npm start

*El servidor estará corriendo en http://localhost:3000 (o el puerto que hayas definido en tu .env).
** Documentación de la API (Swagger)
Una vez que el servidor esté en funcionamiento, puedes acceder a la documentación interactiva de la API generada por Swagger en la siguiente ruta:

http://localhost:3000/api/v1/docs/

Desde allí podrás ver todos los endpoints disponibles, sus parámetros, respuestas esperadas e incluso probarlos directamente.

** Estructura del Proyecto
El proyecto sigue una arquitectura por capas para separar responsabilidades:

src/
├── config/          # Configuración de Passport.
├── controladores/   # Controladores: Manejan la lógica de las peticiones (req, res).
├── db/              # Acceso a Datos: Lógica de consultas directas a la BD (MySQL).
├── middlewares/     # Middlewares de Express (ej. autorización, validación de campos).
├── servicios/       # Capa de Servicio: Contiene la lógica de negocio principal.
├── utiles/          # Utilidades (ej. plantillas Handlebars para emails).
├── v1/              # Definición de las rutas de la API (versión 1).
├── reservas.js      # Archivo principal del servidor Express.
└── swaggerConfig.js # Configuración para swagger-jsdoc.