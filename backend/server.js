import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import leaderboardRoutes from './routes/leaderboard.js';
import userRoutes from './routes/user.js';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Restrict CORS to the explicit production frontend origin (or localhost for development)
const ALLOWED_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: ALLOWED_ORIGIN,
  credentials: true
}));

// Apply security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false, // Prevents blocking local Vite React frontend testing
}));
app.use(compression());
app.use(express.json());

// Express 5 Compatibility Layer: Make req.query mutable for mongoSanitize
app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
        value: { ...req.query },
        writable: true,
        configurable: true,
        enumerable: true
    });
    next();
});

app.use(mongoSanitize());

// Configure standard rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/user', userRoutes);

// Centralized Global Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Serve Frontend Static Assets
app.use(express.static(path.join(__dirname, '..', 'dist')));

// SPA Catch-All Routing
app.get('/{*splat}', (req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
    } else {
        next();
    }
});

// Connect to MongoDB — credentials loaded strictly from environment, never hardcoded
if (process.env.NODE_ENV !== 'test') {
  // Graceful error listener for unexpected post-connection failures
  mongoose.connection.on('error', err => console.error('Database connection error:', err));

  mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
    .then(() => {
      app.listen(PORT);
    })
    .catch(() => {
      process.exit(1);
    });
}

export default app;
