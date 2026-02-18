import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth.routes';
import { usersRouter } from './routes/users.routes';
import { worldsRouter } from './routes/worlds.routes';
import { chaptersRouter } from './routes/chapters.routes';
import { missionsRouter } from './routes/missions.routes';
import { questionsRouter } from './routes/questions.routes';
import { quizRouter } from './routes/quiz.routes';
import { arenaRouter } from './routes/arena.routes';
import { progressRouter } from './routes/progress.routes';
import { cosmeticsRouter } from './routes/cosmetics.routes';
import { achievementsRouter } from './routes/achievements.routes';
import { setupSwagger } from './config/swagger';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import { setupSocketIO } from './socket/socketHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});
app.use('/api/', limiter);

// ─── Swagger ──────────────────────────────────────────────────────────────────
setupSwagger(app);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/worlds', worldsRouter);
app.use('/api/chapters', chaptersRouter);
app.use('/api/missions', missionsRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/arena', arenaRouter);
app.use('/api/progress', progressRouter);
app.use('/api/cosmetics', cosmeticsRouter);
app.use('/api/achievements', achievementsRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    project: 'DevBuPlaytime API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Socket.IO ────────────────────────────────────────────────────────────────
setupSocketIO(io);

// ─── Start Server ─────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  logger.info(`DevBuPlaytime API running on port ${PORT}`);
  logger.info(`Swagger UI: http://localhost:${PORT}/api-docs`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

export { app, io };
