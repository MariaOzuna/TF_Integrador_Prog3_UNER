//este archivo es para armar funciones para no repetir codigo en carpeta controlador para usuariosControlador.js

export const errorCatch = (metodo, error, res) => {
    //funcion para reutilizar en catch en base al metodo específico
    console.log(`Error en el método: ${metodo}`, error); 
    res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor.'
    });
}

export const usuarioNoEncontrado = (res) => {
    // funcion para reutilizar cuando no se encuentra un usuario, respuesta con 404
    res.status(404).json({
        estado: false,
        mensaje: 'Usuario no encontrado en la base de datos.'
    });
}

export const reservaNoEncontrada = (res) => {
    // funcion para reutilizar cuando no se encuentra una reserva, respuesta con 404
    res.status(404).json({
        estado: false,
        mensaje: 'Reserva no encontrada en la base de datos.'
    });
}
export const salonNoEncontrado = (res) => {
    res.status(404).json({
        estado: false,
        mensaje: 'Salón no encontrado en la base de datos.'
    });
}

export const turnoNoEncontrado = (res) => {
    // funcion para reutilizar cuando no se encuentra un turno, respuesta con 404
    res.status(404).json({
        estado: false,
        mensaje: 'Turno no encontrado en la base de datos.'
    });
}