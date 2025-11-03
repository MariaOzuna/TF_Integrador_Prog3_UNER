import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import turnosRoutes from './src/routes/turnos.routes.js';
import pool from './src/db/connection.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'API Turnos funcionando ✅' });
});

// optional test connection
async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('✅ Conexión MySQL OK. Resultado:', rows[0].result);
  } catch (error) {
    console.error('❌ Error conectando con MySQL:', error.message);
  }
}

testConnection();

app.use('/api/turnos', turnosRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
