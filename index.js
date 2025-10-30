require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Ruta simple de prueba
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API PROGIII funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;

const pool = require('./src/db/connection');

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('✅ Conexión con MySQL exitosa. Resultado:', rows[0].result);
  } catch (error) {
    console.error('❌ Error conectando con MySQL:', error.message);
  }
}

testConnection();

const turnosRoutes = require('./src/routes/turnos.routes');
app.use('/api/turnos', turnosRoutes);

const usuariosRoutes = require('./src/routes/usuarios.routes');
app.use('/api/usuarios', usuariosRoutes);

//console.log(app._router.stack.map(r => r.route && r.route.path).filter(Boolean));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
