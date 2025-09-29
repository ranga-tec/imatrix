// ===============================
// ENHANCED DOWNLOADS ROUTES (downloads.js)
// ===============================
import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { auditLog } from '../utils/audit.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(__dirname, '..', '..', 'public', 'uploads', 'downloads');
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
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024 // 50MB for downloads
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed for downloads'), false);
    }
  }
});

const downloadSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  kind: z.enum(['manual', 'software', 'report', 'brochure']).optional(),
  // Either fileUrl OR file upload (handled separately)
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.string().optional()
});

// Get download by ID (for admin editing)
router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const download = await prisma.download.findUnique({
      where: { id: parseInt(id) }
    });

    if (!download) {
      return res.status(404).json({ ok: false, error: 'Download not found' });
    }

    res.json({ ok: true, data: download });
  } catch (error) {
    throw error;
  }
});

// Get all downloads (public)
router.get('/', async (req, res) => {
  try {
    const { kind, search, limit = 50 } = req.query;
    
    const where = {};
    if (kind) where.kind = kind;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const downloads = await prisma.download.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ ok: true, data: downloads });
  } catch (error) {
    throw error;
  }
});

// ✅ NEW: File upload endpoint for downloads
router.post('/upload', authenticate, requireRole('ADMIN', 'EDITOR'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    const { title, description, kind } = req.body;

    if (!title) {
      return res.status(400).json({ ok: false, error: 'Title is required' });
    }

    // Calculate file size in human readable format
    const fileSizeInBytes = req.file.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    const readableFileSize = fileSizeInMB > 1 ? `${fileSizeInMB} MB` : `${(fileSizeInBytes / 1024).toFixed(2)} KB`;

    const download = await prisma.download.create({
      data: {
        title,
        description: description || null,
        fileUrl: `https://imatrix-production.up.railway.app/uploads/downloads/${req.file.filename}`,
        fileName: req.file.originalname,
        fileSize: readableFileSize,
        kind: kind || 'manual'
      }
    });

    await auditLog(req.user.email, 'CREATE', 'Download', download.id, { 
      title: download.title, 
      fileName: download.fileName 
    });

    res.status(201).json({ ok: true, data: download });
  } catch (error) {
    console.error('Download upload error:', error);
    res.status(500).json({ ok: false, error: 'Failed to upload file' });
  }
});

// Create download (Admin/Editor) - for URL-based downloads
router.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const data = downloadSchema.parse(req.body);

    // Ensure either fileUrl is provided or this is being called after file upload
    if (!data.fileUrl) {
      return res.status(400).json({ ok: false, error: 'fileUrl is required for URL-based downloads' });
    }

    const download = await prisma.download.create({ 
      data: {
        ...data,
        kind: data.kind || 'manual'
      }
    });

    await auditLog(req.user.email, 'CREATE', 'Download', download.id, { title: download.title });

    res.status(201).json({ ok: true, data: download });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Update download (Admin/Editor)
router.patch('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = downloadSchema.partial().parse(req.body);

    const download = await prisma.download.update({
      where: { id: parseInt(id) },
      data
    });

    await auditLog(req.user.email, 'UPDATE', 'Download', download.id, { title: download.title });

    res.json({ ok: true, data: download });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Delete download (Admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const download = await prisma.download.findUnique({
      where: { id: parseInt(id) },
      select: { title: true, fileUrl: true }
    });

    if (!download) {
      return res.status(404).json({ ok: false, error: 'Download not found' });
    }

    // Delete physical file if it's an uploaded file (not external URL)
    if (download.fileUrl && download.fileUrl.startsWith('/uploads/')) {
      const filePath = join(__dirname, '..', '..', 'public', download.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.download.delete({
      where: { id: parseInt(id) }
    });

    await auditLog(req.user.email, 'DELETE', 'Download', parseInt(id), { title: download.title });

    res.json({ ok: true, message: 'Download deleted' });
  } catch (error) {
    throw error;
  }
});

export default router;