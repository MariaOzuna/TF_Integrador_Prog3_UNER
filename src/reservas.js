import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';
import passport from 'passport';
import morgan from 'morgan';
import fs from 'fs';

import { estrategia, validacion} from './config/passport.js';


import { router as v1UsuariosRutas } from './v1/rutas/usuariosRutas.js'; //importo rutas
import { router as v1ServiciosRutas} from './v1/rutas/serviciosRutas.js'
import { router as v1ReservasRutas } from './v1/rutas/reservasRutas.js';
import { router as v1SalonesRutas } from './v1/rutas/salonesRutas.js';
import { router as v1TurnosRutas } from './v1/rutas/turnosRutas.js';
import { router as v1AuthRouter} from './v1/rutas/authRoutes.js';

const app = express();

// CONFIGURACION PASSPORT
passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());


// morgan
let log = fs.createWriteStream('./access.log', { flags: 'a' })
app.use(morgan('combined')) // en consola
app.use(morgan('combined', { stream: log })) // en el archivo

app.use(express.json());

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Rutas api
app.use('/api/v1/usuarios', v1UsuariosRutas); //cuando haya una consulta a usuarios la ruta que se va a usar es v1UsuariosRutas
app.use('/api/v1/servicios', v1ServiciosRutas);//creamos la ruta servicios
app.use('/api/v1/reservas', passport.authenticate('jwt', { session: false }), v1ReservasRutas);
app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/turnos', v1TurnosRutas);
app.use('/api/v1/auth', v1AuthRouter); // AUTENTICACIÓN     


process.loadEnvFile();
app.listen(process.env.PUERTO, () => {
    console.log(`Servidor iniciado en ${process.env.PUERTO}!!`);
})