// ===============================
// COMPLETE SERVER.JS WITH FIXED CORS
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
// ENHANCED CORS CONFIGURATION
// ===============================

// Regex patterns for dynamic deployments
const netlifyPreview = /^https:\/\/[a-z0-9-]+--imatix\.netlify\.app$/i;
const surgeImatrix = /^https:\/\/imatrix[a-z0-9-]*\.surge\.sh$/i;

// Build allowed origins list
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://imatix.netlify.app',
  'https://imatrix-light-theme.surge.sh',
];

// Add from environment variable
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',')
    .map(s => s.trim())
    .filter(Boolean);
  allowedOrigins.push(...envOrigins);
}

// Remove duplicates
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log('🔐 CORS Configuration:');
console.log('  Allowed Origins:', uniqueOrigins);
console.log('  Environment:', process.env.NODE_ENV || 'development');

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Check static list
    if (uniqueOrigins.includes(origin)) {
      console.log(`✅ CORS allowed (static): ${origin}`);
      return callback(null, true);
    }

    // Check regex patterns
    if (netlifyPreview.test(origin)) {
      console.log(`✅ CORS allowed (Netlify preview): ${origin}`);
      return callback(null, true);
    }

    if (surgeImatrix.test(origin)) {
      console.log(`✅ CORS allowed (Surge): ${origin}`);
      return callback(null, true);
    }

    // Log rejected origins for debugging
    console.warn(`❌ CORS rejected origin: ${origin}`);
    callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

// Apply CORS before any routes
app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// Add CORS headers manually as additional fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin && (
    uniqueOrigins.includes(origin) || 
    netlifyPreview.test(origin) || 
    surgeImatrix.test(origin)
  )) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
    res.header('Access-Control-Expose-Headers', 'Content-Range,X-Content-Range');
  }
  
  next();
});

// ===============================
// RATE LIMITING
// ===============================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { ok: false, error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  skip: (req) => {
    const isDev = process.env.NODE_ENV !== 'production';
    const isLocal = req.ip === '::1' || req.ip === '127.0.0.1';
    return isDev && isLocal;
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 50,
  message: { ok: false, error: 'Too many auth attempts' },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  skip: (req) => {
    const isDev = process.env.NODE_ENV !== 'production';
    const isLocal = req.ip === '::1' || req.ip === '127.0.0.1';
    return isDev && isLocal;
  }
});

app.use('/auth', authLimiter);
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===============================
// STATIC FILE SERVING
// ===============================

// Determine upload path
const staticUploadPath = join(__dirname, '..', 'public', 'uploads');
console.log('📁 Upload directory path:', staticUploadPath);

// Ensure upload directory exists
if (!fs.existsSync(staticUploadPath)) {
  console.log('📁 Creating upload directory:', staticUploadPath);
  fs.mkdirSync(staticUploadPath, { recursive: true });
} else {
  console.log('📁 Upload directory exists');
  try {
    const files = fs.readdirSync(staticUploadPath);
    console.log('📁 Files in upload directory:', files.length, 'files');
    if (files.length > 0) {
      console.log('📁 First few files:', files.slice(0, 5));
    }
  } catch (err) {
    console.error('❌ Error reading upload directory:', err);
  }
}

// Serve static files with proper CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  console.log('📄 File request:', req.method, req.url);
  next();
}, express.static(staticUploadPath, {
  maxAge: '1d',
  etag: false,
  lastModified: true
}));

// Directory listing route (for debugging)
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
    console.error('❌ Error listing upload directory:', error);
    res.status(500).json({
      ok: false,
      error: 'Could not list upload directory',
      uploadPath: staticUploadPath,
      details: error.message
    });
  }
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info({ 
    method: req.method, 
    url: req.url, 
    ip: req.ip,
    origin: req.headers.origin 
  }, 'Request');
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
    timestamp: new Date().toISOString(),
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
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
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

// ===============================
// ERROR HANDLING
// ===============================

// Error handling middleware
app.use((err, req, res, next) => {
  // Handle CORS errors specifically
  if (err.message && err.message.includes('CORS')) {
    logger.error({ err, origin: req.headers.origin }, 'CORS Error');
    return res.status(403).json({
      ok: false,
      error: 'CORS policy violation',
      message: process.env.NODE_ENV === 'production' 
        ? 'Access denied' 
        : err.message
    });
  }

  logger.error({ err, method: req.method, url: req.url }, 'Server Error');
  res.status(500).json({
    ok: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    ok: false, 
    error: 'Route not found',
    path: req.originalUrl
  });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ================================');
  console.log(`🚀 iMatrix API Server Running`);
  console.log('🚀 ================================');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Upload path: ${staticUploadPath}`);
  console.log(`🔐 CORS Origins: ${uniqueOrigins.length} configured`);
  console.log('🚀 ================================');
  console.log('');
});

export default app;