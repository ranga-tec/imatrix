// ===============================
// MEDIA ROUTES (media.js) - WITHOUT SHARP
// ===============================
import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { auditLog } from '../utils/audit.js';
// import sharp from 'sharp'; // ❌ Remove this import
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const mediaRouter = express.Router();
const mediaPrisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(__dirname, '..', '..', 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  }
});

const mediaSchema = z.object({
  alt: z.string().optional(),
  caption: z.string().optional(),
  type: z.enum(['image', 'video', 'file']).optional()
});

// Get media by ID (for admin editing)
mediaRouter.get('/id/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const media = await mediaPrisma.media.findUnique({
      where: { id: parseInt(id) }
    });

    if (!media) {
      return res.status(404).json({ ok: false, error: 'Media not found' });
    }

    res.json({ ok: true, data: media });
  } catch (error) {
    throw error;
  }
});

// Get all media (Admin/Editor)
mediaRouter.get('/', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { type, search, limit = 50 } = req.query;
    
    const where = {};
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } }
      ];
    }

    const media = await mediaPrisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ ok: true, data: media });
  } catch (error) {
    throw error;
  }
});

// Upload media (Admin/Editor) - WITHOUT SHARP THUMBNAIL GENERATION
mediaRouter.post('/upload', authenticate, requireRole('ADMIN', 'EDITOR'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    const { alt, caption, type } = mediaSchema.parse(req.body);
    
    // Determine file type
    let fileType = type || 'file';
    if (req.file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (req.file.mimetype.startsWith('video/')) {
      fileType = 'video';
    }

    // ❌ Remove Sharp thumbnail generation for now
    // TODO: Add back thumbnail generation once Sharp is working on Railway
    
    const media = await mediaPrisma.media.create({
      data: {
        url: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        type: fileType,
        alt: alt || req.file.originalname,
        caption
      }
    });

    await auditLog(req.user.email, 'CREATE', 'Media', media.id, { fileName: media.fileName });

    res.status(201).json({ ok: true, data: media });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Update media (Admin/Editor)
mediaRouter.patch('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = mediaSchema.parse(req.body);

    const media = await mediaPrisma.media.update({
      where: { id: parseInt(id) },
      data
    });

    await auditLog(req.user.email, 'UPDATE', 'Media', media.id, { fileName: media.fileName });

    res.json({ ok: true, data: media });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Delete media (Admin/Editor)
mediaRouter.delete('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const media = await mediaPrisma.media.findUnique({
      where: { id: parseInt(id) }
    });

    if (!media) {
      return res.status(404).json({ ok: false, error: 'Media not found' });
    }

    // Delete physical file
    const filePath = join(__dirname, '..', '..', 'public', media.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // ❌ Remove thumbnail deletion since we're not generating them
    // TODO: Add back when Sharp is working

    await mediaPrisma.media.delete({
      where: { id: parseInt(id) }
    });

    await auditLog(req.user.email, 'DELETE', 'Media', parseInt(id), { fileName: media.fileName });

    res.json({ ok: true, message: 'Media deleted' });
  } catch (error) {
    throw error;
  }
});

export default mediaRouter;