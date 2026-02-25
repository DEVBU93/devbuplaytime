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

// BLINDAJE: Validar variables de entorno criticas al arrancar
dotenv.config();

const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Variable de entorno ${envVar} no configurada. El servidor no puede arrancar.`);
    process.exit(1);
  }
}

if ((process.env.JWT_SECRET || '').length < 32) {
  logger.error('JWT_SECRET debe tener al menos 32 caracteres.');
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
const isDev = process.env.NODE_ENV !== 'production';

// BLINDAJE: Socket.IO con CORS restrictivo
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || (isDev ? 'http://localhost:5173' : undefined),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

// ─── Middlewares ──────────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || (isDev ? 'http://localhost:5173' : false),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Request-ID'],
  credentials: true,
  maxAge: 600,
}));

app.use(compression());
app.use(morgan(isDev ? 'dev' : 'combined'));
app.use(express.json({ limit: '1mb' })); // BLINDAJE: 10mb -> 1mb (prevenir DoS)
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Rate limiting ───────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,    // BLINDAJE: Enviar RateLimit-* headers RFC
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});

// Rate limiter estricto para auth endpoints (anti-brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Solo 10 intentos de login por 15min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de autenticacion. Espera 15 minutos.' },
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);   // BLINDAJE: anti-brute force login
app.use('/api/auth/register', authLimiter); // BLINDAJE: anti-spam registro

// ─── Swagger (solo en desarrollo) ─────────────────────────────────────────────
if (isDev) {
  setupSwagger(app); // BLINDAJE: Swagger SOLO en desarrollo
  logger.info(`Swagger UI: http://localhost:${PORT}/api-docs`);
}

// ─── Routes ─────────────────────────────────────────────────────────────────
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

// ─── Health Check (publico, sin rate limit estricto) ────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    project: 'DevBuPlaytime API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Error Handler (siempre al final) ───────────────────────────────────────────
app.use(errorHandler);

// ─── Socket.IO ─────────────────────────────────────────────────────────────────
setupSocketIO(io);

// ─── Start Server ────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  logger.info(`DevBuPlaytime API running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  if (isDev) logger.info('Development mode: extra logging enabled');
});

export { app, io };
