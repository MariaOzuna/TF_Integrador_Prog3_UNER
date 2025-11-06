import swaggerJSDoc from 'swagger-jsdoc';
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Reservas de Casas de Cumpleaños',
    version: '1.0.0',
    description: 'Documentación de la API para gestionar reservas, usuarios, salones y más.',
  },
  servers: [
    {
      url: '/api/v1', // El prefijo base de todas tus rutas
      description: 'Servidor de Desarrollo',
    },
  ],
  // Definición de "Schemas" y respuestas reutilizables
  components: {
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          usuario_id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Juan' },
          apellido: { type: 'string', example: 'Perez' },
          nombre_usuario: { type: 'string', format: 'email', example: 'juan.perez@example.com' },
          tipo_usuario: { type: 'integer', example: 2, description: '1: Admin, 2: Cliente, 3: Staff' },
          activo: { type: 'integer', example: 1 }
        }
      },
      NuevoUsuario: {
        type: 'object',
        required: ['nombre', 'apellido', 'nombre_usuario', 'contrasenia', 'tipo_usuario'],
        properties: {
          nombre: { type: 'string', example: 'Juan' },
          apellido: { type: 'string', example: 'Perez' },
          nombre_usuario: { type: 'string', format: 'email', example: 'juan.perez@example.com' },
          contrasenia: { type: 'string', format: 'password', example: 'mypassword123' },
          tipo_usuario: { type: 'integer', example: 2, description: 'Valores: 1, 2, o 3' },
        }
      },
      Servicio: {
        type: 'object',
        properties: {
          servicio_id: { type: 'integer', example: 1 },
          descripcion: { type: 'string', example: 'Servicio de Catering' },
          importe: { type: 'number', format: 'float', example: 150.50 },
          activo: { type: 'integer', example: 1 }
        }
      },
      NuevoServicio: {
        type: 'object',
        required: ['descripcion', 'importe'],
        properties: {
          descripcion: { type: 'string', example: 'Servicio de Catering' },
          importe: { type: 'number', format: 'float', example: 150.50 },
        }
      },
      Salon: {
        type: 'object',
        properties: {
          salon_id: { type: 'integer', example: 1 },
          titulo: { type: 'string', example: 'Salón Principal' },
          direccion: { type: 'string', example: 'Calle Falsa 123' },
          capacidad: { type: 'integer', example: 100 },
          importe: { type: 'number', format: 'float', example: 500.00 },
          activo: { type: 'integer', example: 1 }
        }
      },
      NuevoSalon: {
        type: 'object',
        required: ['titulo', 'direccion', 'capacidad', 'importe'],
        properties: {
          titulo: { type: 'string', example: 'Salón Principal' },
          direccion: { type: 'string', example: 'Calle Falsa 123' },
          capacidad: { type: 'integer', example: 100 },
          importe: { type: 'number', format: 'float', example: 500.00 },
        }
      },
      Turno: {
        type: 'object',
        properties: {
          turno_id: { type: 'integer', example: 1 },
          orden: { type: 'integer', example: 1 },
          hora_desde: { type: 'string', format: 'time', example: '09:00:00' },
          hora_hasta: { type: 'string', format: 'time', example: '12:00:00' },
          activo: { type: 'integer', example: 1 }
        }
      },
      NuevoTurno: {
        type: 'object',
        required: ['orden', 'hora_desde', 'hora_hasta'],
        properties: {
          orden: { type: 'integer', example: 1 },
          hora_desde: { type: 'string', format: 'time', example: '09:00' },
          hora_hasta: { type: 'string', format: 'time', example: '12:00' },
        }
      },
      Reserva: {
        type: 'object',
        properties: {
          reserva_id: { type: 'integer', example: 1 },
          fecha_reserva: { type: 'string', format: 'date-time', example: '2025-12-01T15:00:00Z' },
          salon_id: { type: 'integer', example: 1 },
          usuario_id: { type: 'integer', example: 2 },
          turno_id: { type: 'integer', example: 1 },
          tematica: { type: 'string', example: 'Superhéroes' },
          importe_salon: { type: 'number', format: 'float', example: 500.00 },
          importe_total: { type: 'number', format: 'float', example: 650.50 },
          activo: { type: 'integer', example: 1 }
        }
      },
      NuevaReserva: {
        type: 'object',
        required: ['fecha_reserva', 'salon_id', 'usuario_id', 'turno_id', 'importe_salon', 'importe_total', 'servicios'],
        properties: {
          fecha_reserva: { type: 'string', format: 'date-time', example: '2025-12-01T15:00:00Z' },
          salon_id: { type: 'integer', example: 1 },
          usuario_id: { type: 'integer', example: 2 },
          turno_id: { type: 'integer', example: 1 },
          tematica: { type: 'string', example: 'Superhéroes', description: 'Opcional' },
          importe_salon: { type: 'number', format: 'float', example: 500.00 },
          importe_total: { type: 'number', format: 'float', example: 650.50 },
          servicios: {
            type: 'array',
            description: 'Lista de servicios adicionales contratados.',
            items: {
              type: 'object',
              properties: {
                servicio_id: { type: 'integer', example: 1 },
                importe: { type: 'number', format: 'float', example: 150.50 }
              },
              required: ['servicio_id', 'importe']
            },
            example: [
              { servicio_id: 1, importe: 150.50 }],
          },
        },
      },
    },
    responses: {
      ErrorValidacion: {
        description: 'Error de validación de campos.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                estado: { type: 'string', example: 'Hubo una falla en la validación' },
                mensaje: { type: 'object', example: { campo: { msg: 'Descripción del error' } } }
              }
            }
          }
        }
      },
      ErrorNoEncontrado: {
        description: 'Recurso no encontrado.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                estado: { type: 'boolean', example: false },
                mensaje: { type: 'string', example: 'Recurso no encontrado en la base de datos.' }
              }
            }
          }
        }
      },
      ErrorServidor: {
        description: 'Error interno del servidor.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                estado: { type: 'boolean', example: false },
                mensaje: { type: 'string', example: 'Error interno del servidor.' }
              }
            }
          }
        }
      }
    }
  }
};


const options = {
  swaggerDefinition,
  apis: ['./src/v1/rutas/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;