// ===============================
// SERVER SETUP (server.js)
// ===============================
// imatrix-website/apps/api/src/server.js

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import pino from 'pino';
import fs from 'fs';

// Import routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import solutionRoutes from './routes/solutions.js';
import downloadRoutes from './routes/downloads.js';
import mediaRoutes from './routes/media.js';
import contactRoutes from './routes/contact.js';
import auditRoutes from './routes/audit.js';

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

const app = express();
const PORT = process.env.PORT || 8080;

// Ensure upload directory exists
const uploadDir = join(__dirname, '..', process.env.UPLOAD_PATH || 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ===============================
// CORS (ONLY SECTION CHANGED)
// ===============================

// Regex to allow any Netlify deploy-preview for this site:
// e.g., https://<hash>--imatix.netlify.app
const netlifyPreview = /^https:\/\/[a-z0-9-]+--imatix\.netlify\.app$/i;

// Build a static allowlist from env + some sensible defaults
const staticAllows = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  // stable production/staging domains (add what you actually use)
  'https://imatix.netlify.app',         // main Netlify site (stable)
  // 'https://www.imatrix.lk',           // example custom domain (uncomment if/when used)
]);

// Support comma-separated env var: CORS_ORIGIN="https://foo.com,https://bar.com"
if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(o => staticAllows.add(o));
}

const corsOptions = {
  origin(origin, cb) {
    // Allow non-browser tools / same-origin / server-to-server
    if (!origin) return cb(null, true);
    if (staticAllows.has(origin) || netlifyPreview.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error(`CORS: Origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Ensure every preflight gets CORS headers (important with rate limiters/middleware order)
app.options('*', cors(corsOptions));

// Rate limiting
// Rate limiting - More permissive for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Higher limit for development
  message: { ok: false, error: 'Too many requests' },
  skip: (req) => process.env.NODE_ENV !== 'production' && (req.ip === '::1' || req.ip === '127.0.0.1') // Skip rate limiting for localhost in development
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 50, // Much higher for development
  message: { ok: false, error: 'Too many auth attempts' },
  skip: (req) => process.env.NODE_ENV !== 'production' && (req.ip === '::1' || req.ip === '127.0.0.1')
});

app.use('/auth', authLimiter);
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(join(__dirname, '..', 'public/uploads')));

// Request logging
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip }, 'Request');
  next();
});


app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'iMatrix API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      posts: '/posts',
      products: '/products',
      solutions: '/solutions',
      categories: '/categories',
      downloads: '/downloads',
      media: '/media',
      contact: '/contact',
      audit: '/audit',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/solutions', solutionRoutes);
app.use('/downloads', downloadRoutes);
app.use('/media', mediaRoutes);
app.use('/users', authRoutes);
app.use('/contact', contactRoutes);
app.use('/audit', auditRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({
    ok: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ ok: false, error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
