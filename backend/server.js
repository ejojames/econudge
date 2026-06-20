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

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Apply security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false, // Prevents blocking local Vite React frontend testing
}));
app.use(compression());
app.use(express.json());
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

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecoNudge')
    .then(() => {
      console.log(`Connected to MongoDB (${process.env.MONGO_URI ? 'Cloud' : 'Local'})`);
      app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });
}

export default app;
