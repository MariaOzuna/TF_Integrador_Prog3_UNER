import express from 'express';
import { router as v1UsuariosRutas } from './v1/rutas/usuariosRutas.js'; //importo rutas
import { router as v1ServiciosRutas} from './v1/rutas/serviciosRutas.js'


const app = express();

app.use(express.json());

app.use('/api/v1/usuarios', v1UsuariosRutas); //cuando haya una consulta a usuarios la ruta que se va a usar es v1UsuariosRutas
app.use('/api/v1/servicios', v1ServiciosRutas);//creamos la ruta servicios


process.loadEnvFile();
app.listen(process.env.PUERTO, () => {
    console.log(`Servidor iniciado en ${process.env.PUERTO}!!`);
})