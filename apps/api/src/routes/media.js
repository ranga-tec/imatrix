// ===============================
// ENHANCED MEDIA ROUTES (media.js) - WITH RESOURCE ATTACHMENTS
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
  const allowedTypes = [
    'image/jpeg', 
    'image/jpg',     // Add this
    'image/png', 
    'image/gif', 
    'image/webp',
    'image/bmp',     // Add this if needed
    'application/pdf', 
    'video/mp4'
  ];
  const ext = file.originalname.toLowerCase().split('.').pop();
  const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'pdf', 'mp4'];
   if (allowedTypes.includes(file.mimetype) || allowedExts.includes(ext)) {
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

const attachmentSchema = z.object({
  mediaId: z.number(),
  resourceType: z.enum(['product', 'post', 'solution']),
  resourceId: z.number()
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

// Upload media (Admin/Editor) - EXISTING ROUTE
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

    const media = await mediaPrisma.media.create({
      data: {
        url: `${process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : ''}/uploads/${req.file.filename}`,
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

// ✅ NEW: Attach media to resource (product/post/solution)
mediaRouter.post('/attach', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { mediaId, resourceType, resourceId } = attachmentSchema.parse(req.body);

    // Verify media exists
    const media = await mediaPrisma.media.findUnique({
      where: { id: mediaId }
    });

    if (!media) {
      return res.status(404).json({ ok: false, error: 'Media not found' });
    }

    // Verify resource exists and attach media
    let result;
    switch (resourceType) {
      case 'product':
        // Check if product exists
        const product = await mediaPrisma.product.findUnique({
          where: { id: resourceId }
        });
        if (!product) {
          return res.status(404).json({ ok: false, error: 'Product not found' });
        }
        
        // Connect media to product
        result = await mediaPrisma.product.update({
          where: { id: resourceId },
          data: {
            media: {
              connect: { id: mediaId }
            }
          },
          include: {
            media: true
          }
        });
        break;

      case 'post':
        const post = await mediaPrisma.post.findUnique({
          where: { id: resourceId }
        });
        if (!post) {
          return res.status(404).json({ ok: false, error: 'Post not found' });
        }
        
        result = await mediaPrisma.post.update({
          where: { id: resourceId },
          data: {
            media: {
              connect: { id: mediaId }
            }
          },
          include: {
            media: true
          }
        });
        break;

      case 'solution':
        const solution = await mediaPrisma.solution.findUnique({
          where: { id: resourceId }
        });
        if (!solution) {
          return res.status(404).json({ ok: false, error: 'Solution not found' });
        }
        
        result = await mediaPrisma.solution.update({
          where: { id: resourceId },
          data: {
            media: {
              connect: { id: mediaId }
            }
          },
          include: {
            media: true
          }
        });
        break;

      default:
        return res.status(400).json({ ok: false, error: 'Invalid resource type' });
    }

    await auditLog(req.user.email, 'ATTACH', 'Media', mediaId, { 
      resourceType, 
      resourceId,
      fileName: media.fileName 
    });

    res.json({ ok: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    console.error('Media attachment error:', error);
    res.status(500).json({ ok: false, error: 'Failed to attach media' });
  }
});

// ✅ NEW: Detach media from resource
mediaRouter.delete('/detach', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { mediaId, resourceType, resourceId } = attachmentSchema.parse(req.body);

    let result;
    switch (resourceType) {
      case 'product':
        result = await mediaPrisma.product.update({
          where: { id: resourceId },
          data: {
            media: {
              disconnect: { id: mediaId }
            }
          }
        });
        break;

      case 'post':
        result = await mediaPrisma.post.update({
          where: { id: resourceId },
          data: {
            media: {
              disconnect: { id: mediaId }
            }
          }
        });
        break;

      case 'solution':
        result = await mediaPrisma.solution.update({
          where: { id: resourceId },
          data: {
            media: {
              disconnect: { id: mediaId }
            }
          }
        });
        break;

      default:
        return res.status(400).json({ ok: false, error: 'Invalid resource type' });
    }

    await auditLog(req.user.email, 'DETACH', 'Media', mediaId, { 
      resourceType, 
      resourceId 
    });

    res.json({ ok: true, message: 'Media detached successfully' });
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

    // Delete from database (this will also remove all relationships due to Prisma cascading)
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