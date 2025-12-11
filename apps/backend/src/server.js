import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { cartController } from './controllers/cartController.js';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);

// Handlers de erro
app.use(notFoundHandler);
app.use(errorHandler);

// Job de limpeza de reservas expiradas (roda a cada 5 minutos)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

setInterval(async () => {
  await cartController.cleanupExpiredReservations();
}, CLEANUP_INTERVAL_MS);

// Executar limpeza inicial ao iniciar
cartController.cleanupExpiredReservations();

// Start
app.listen(config.port, () => {
  console.log(`🚀 Backend running on http://localhost:${config.port}`);
  console.log(`📦 Environment: ${config.nodeEnv}`);
  console.log(`🧹 Job de limpeza de carrinho: a cada 5 minutos`);
});
