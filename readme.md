#      - Gestión de Reservas

Este proyecto es el backend de una aplicación para la gestión de reservas de salones y servicios. Ha sido desarrollado como **Trabajo Final Integrador** para la materia **Programación 3** de la **UNER**.

La aplicación expone una **API RESTful** para administrar usuarios, salones, servicios, turnos y las reservas asociadas.

## ✨ Características Principales

* **Gestión de Usuarios:** Autenticación y registro de usuarios (clientes y administradores) usando Passport.js con JSON Web Tokens (JWT).
* **Gestión de Salones:** CRUD completo para administrar los salones disponibles.
* **Gestión de Servicios:** CRUD para los servicios adicionales que se pueden contratar (ej. catering, sonido).
* **Gestión de Turnos:** Administración de los turnos (mañana, tarde, noche) disponibles para reservar.
* **Sistema de Reservas:** Lógica para crear, consultar, actualizar y cancelar reservas, vinculando salones, servicios y usuarios.
* **Notificaciones por Email:** Envío automático de correos electrónicos (usando **Nodemailer**) para confirmación de registro y detalles de reservas.
* **Documentación de API:** Documentación automática y navegable de todos los endpoints usando **Swagger**.
* **Validación:** Validación de los datos de entrada en las rutas usando `express-validator`.
* **Caché:** Implementación de caché en ciertas rutas (ej. listado de salones) para mejorar el rendimiento usando `apicache`.

## 🛠️ Stack Tecnológico

* **Backend:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MySQL (con el driver `mysql2`)
* **Autenticación:** Passport.js (`passport-jwt`)
* **Documentación API:** `swagger-jsdoc` y `swagger-ui-express`
* **Envío de Emails:** Nodemailer
* **Plantillas de Email:** Handlebars
* **Validación:** `express-validator`

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para levantar el proyecto en un entorno local.

### 1. Prerrequisitos

* Tener instalado [Node.js](https://nodejs.org/) (versión 18+ recomendada).
* Tener una instancia de MySQL en ejecución.

### 2. Instalación

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/usuario/tf_integrador_prog3_uner.git](https://github.com/usuario/tf_integrador_prog3_uner.git)
    cd tf_integrador_prog3_uner
    ```

2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

### 3. Configuración de Entorno

Este proyecto requiere variables de entorno para funcionar. Crea un archivo `.env` en la raíz del proyecto (puedes duplicar y renombrar el archivo `.env.example` si existe).

Tu archivo `.env` debería verse así:

```env
# Configuración del Servidor
PUERTO=3000

# Configuración de la Base de Datos
HOST='localhost'
USER=tu_usuario_sql
PASSWORD=tu_contraseña_mysql
DATABASE=nombre_de_tu_base_de_datos

# Secret para JSON Web Token (JWT)
JWT_SECRET=tu_palabra_secreta_para_jwt

# Configuración de Nodemailer (ej. para Gmail)
USERCORREO=tu_correo@gmail.com
PASSCORREO=tu_contraseña_de_aplicacion_de_google

### 4. Instalación Procedimientos almacenados en la base de datos
Procedimiento obtenerDatosNotificacion (parametro p_reserva_id tipo INT):
BEGIN
	SELECT 
		r.fecha_reserva as fecha,
    	s.titulo as salon,
    	t.orden as turno,
        u.nombre_usuario as correoCliente
	FROM 
    	reservas as r
	INNER JOIN
		salones as s ON s.salon_id = r.salon_id
	INNER JOIN
		turnos as t ON t.turno_id = r.turno_id
    INNER JOIN
		usuarios as u ON u.usuario_id = r.usuario_id
	WHERE
		r.activo = 1 AND r.reserva_id = p_reserva_id;

	SELECT u.nombre_usuario AS correoAdmin
		FROM
    		usuarios AS u
    	WHERE 
    		u.tipo_usuario = 1 AND u.activo = 1;
END

Procedimiento sp_estadisticas_salon:
BEGIN
	SELECT
    	s.titulo AS salon_titulo,
        COUNT(r.reserva_id) AS cantidad_reservas,
        SUM(r.importe_total) AS total_facturado
    FROM reservas AS r
    JOIN salones AS s ON r.salon_id = s.salon_id
    WHERE r.activo = 1
    GROUP BY s.titulo
    ORDER BY total_facturado DESC;
END

Procedimiento sp_reporte_reservas_detalle:
BEGIN
    SELECT
        r.reserva_id,
        r.fecha_reserva,
        r.importe_total,
        r.tematica,
        s.titulo AS salon_titulo,
        CONCAT(t.hora_desde, ' - ', t.hora_hasta) AS turno_horario,
        CONCAT(u.nombre, ' ', u.apellido) AS cliente_nombre,
        u.nombre_usuario AS cliente_email,
        u.celular AS cliente_celular,

        (SELECT GROUP_CONCAT(serv.descripcion SEPARATOR ', ') 
         FROM reservas_servicios rs
         JOIN servicios serv ON rs.servicio_id = serv.servicio_id
         WHERE rs.reserva_id = r.reserva_id) AS servicios_contratados

    FROM reservas r
    JOIN salones s ON r.salon_id = s.salon_id
    JOIN turnos t ON r.turno_id = t.turno_id
    JOIN usuarios u ON r.usuario_id = u.usuario_id
    WHERE r.activo = 1
    GROUP BY r.reserva_id
    ORDER BY r.fecha_reserva;
END


Url para ver el Swagger: http://localhost:3000/api-docs/