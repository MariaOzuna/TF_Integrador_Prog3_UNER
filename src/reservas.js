import express from 'express';
import { router as v1UsuariosRutas } from './v1/rutas/usuariosRutas.js'; //importo rutas
import { router as v1ServiciosRutas} from './v1/rutas/serviciosRutas.js'
import { router as v1ReservasRutas } from './v1/rutas/reservasRutas.js';
import { router as v1SalonesRutas } from './v1/rutas/salonesRutas.js';
import { router as v1TurnosRutas } from './v1/rutas/turnosRutas.js';

const app = express();

app.use(express.json());

app.use('/api/v1/usuarios', v1UsuariosRutas); //cuando haya una consulta a usuarios la ruta que se va a usar es v1UsuariosRutas
app.use('/api/v1/servicios', v1ServiciosRutas);//creamos la ruta servicios
app.use('/api/v1/reservas', v1ReservasRutas);
app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/turnos', v1TurnosRutas);

process.loadEnvFile();
app.listen(process.env.PUERTO, () => {
    console.log(`Servidor iniciado en ${process.env.PUERTO}!!`);
})