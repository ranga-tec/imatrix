// ===============================
// DOWNLOADS ROUTES (downloads.js)
// ===============================
import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { auditLog } from '../utils/audit.js';

const router = express.Router();
const prisma = new PrismaClient();

const downloadSchema = z.object({
  title: z.string().min(1),
  fileUrl: z.string().min(1),
  fileName: z.string().optional(),
  fileSize: z.string().optional(),
  kind: z.enum(['manual', 'software', 'report', 'brochure'])
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

// Create download (Admin/Editor)
router.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const data = downloadSchema.parse(req.body);

    const download = await prisma.download.create({ data });

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
      select: { title: true }
    });

    if (!download) {
      return res.status(404).json({ ok: false, error: 'Download not found' });
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