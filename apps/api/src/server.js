// ===============================
// COMPLETE SERVER.JS WITH FIXED STATIC FILE SERVING
// ===============================
// apps/api/src/server.js

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
// Trust proxy for Railway
app.set('trust proxy', true);
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ===============================
// CORS CONFIGURATION
// ===============================

// Regex to allow any Netlify deploy-preview for this site:
// e.g., https://<hash>--imatix.netlify.app
const netlifyPreview = /^https:\/\/[a-z0-9-]+--imatix\.netlify\.app$/i;

// Regex to allow any Surge.sh deploy for this site:
// e.g., https://imatrix-light-theme.surge.sh
const surgePreview = /^https:\/\/[a-z0-9-]+\.surge\.sh$/i;

// Build a static allowlist from env + some sensible defaults
const staticAllows = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  // stable production/staging domains (add what you actually use)
  'https://imatix.netlify.app',         // main Netlify site (stable)
  'https://imatrix-light-theme.surge.sh', // main Surge.sh site
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
    if (staticAllows.has(origin) || netlifyPreview.test(origin) || surgePreview.test(origin)) {
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

// Rate limiting - More permissive for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { ok: false, error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
  // Fix for Railway proxy setup
  trustProxy: true,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  skip: (req) => process.env.NODE_ENV !== 'production' && (req.ip === '::1' || req.ip === '127.0.0.1')
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 50,
  message: { ok: false, error: 'Too many auth attempts' },
  standardHeaders: true,
  legacyHeaders: false,
  // Fix for Railway proxy setup
  trustProxy: true,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  skip: (req) => process.env.NODE_ENV !== 'production' && (req.ip === '::1' || req.ip === '127.0.0.1')
});

app.use('/auth', authLimiter);
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===============================
// FIXED STATIC FILE SERVING
// ===============================

// Determine upload path
const staticUploadPath = join(__dirname, '..', 'public', 'uploads');
console.log('Upload directory path:', staticUploadPath);

// Ensure upload directory exists
if (!fs.existsSync(staticUploadPath)) {
  console.log('Creating upload directory:', staticUploadPath);
  fs.mkdirSync(staticUploadPath, { recursive: true });
} else {
  console.log('Upload directory exists');
  try {
    const files = fs.readdirSync(staticUploadPath);
    console.log('Files in upload directory:', files.length, 'files');
    if (files.length > 0) {
      console.log('First few files:', files.slice(0, 5));
    }
  } catch (err) {
    console.error('Error reading upload directory:', err);
  }
}

// Directory listing route (AFTER static files)
// This only runs if static file doesn't exist
app.get('/uploads', (req, res) => {
  try {
    const files = fs.readdirSync(staticUploadPath);
    res.json({
      ok: true,
      uploadPath: staticUploadPath,
      filesCount: files.length,
      files: files.map(file => {
        const filePath = join(staticUploadPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          modified: stats.mtime,
          url: `/uploads/${file}`
        };
      })
    });
  } catch (error) {
    console.error('Error listing upload directory:', error);
    res.status(500).json({
      ok: false,
      error: 'Could not list upload directory',
      uploadPath: staticUploadPath,
      details: error.message
    });
  }
});

// Serve static files with proper CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  console.log('File request:', req.method, req.url);
  next();
}, express.static(staticUploadPath, {
  maxAge: '1d',
  etag: false,
  lastModified: true
}));

// Request logging
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip }, 'Request');
  next();
});

// ===============================
// API ROUTES
// ===============================

// Health check route
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
  logger.info(`Upload path: ${staticUploadPath}`);
});

export default app;