import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { auditLog } from '../utils/audit.js';
import { createSlug } from '../utils/slug.js';

const router = express.Router();
const prisma = new PrismaClient();

const solutionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  benefits: z.any().optional(),
  features: z.any().optional()
});

// Get all solutions (public)
router.get('/', async (req, res) => {
  try {
    const { search, limit = 50 } = req.query;
    
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const solutions = await prisma.solution.findMany({
      where,
      include: {
        media: {
          select: { id: true, url: true, alt: true, type: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ ok: true, data: solutions });
  } catch (error) {
    throw error;
  }
});

// Get solution by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const solution = await prisma.solution.findUnique({
      where: { slug },
      include: {
        media: {
          select: { id: true, url: true, alt: true, caption: true, type: true }
        }
      }
    });

    if (!solution) {
      return res.status(404).json({ ok: false, error: 'Solution not found' });
    }

    res.json({ ok: true, data: solution });
  } catch (error) {
    throw error;
  }
});

// Create solution (Admin/Editor)
router.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const data = solutionSchema.parse(req.body);
    const slug = await createSlug(data.name, 'solution');

    const solution = await prisma.solution.create({
      data: { ...data, slug },
      include: {
        media: {
          select: { id: true, url: true, alt: true, type: true }
        }
      }
    });

    await auditLog(req.user.email, 'CREATE', 'Solution', solution.id, { name: solution.name });

    res.status(201).json({ ok: true, data: solution });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Update solution (Admin/Editor)
router.patch('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = solutionSchema.partial().parse(req.body);
    
    if (data.name) {
      data.slug = await createSlug(data.name, 'solution', parseInt(id));
    }

    const solution = await prisma.solution.update({
      where: { id: parseInt(id) },
      data,
      include: {
        media: {
          select: { id: true, url: true, alt: true, type: true }
        }
      }
    });

    await auditLog(req.user.email, 'UPDATE', 'Solution', solution.id, { name: solution.name });

    res.json({ ok: true, data: solution });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Delete solution (Admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const solution = await prisma.solution.findUnique({
      where: { id: parseInt(id) },
      select: { name: true }
    });

    if (!solution) {
      return res.status(404).json({ ok: false, error: 'Solution not found' });
    }

    await prisma.solution.delete({
      where: { id: parseInt(id) }
    });

    await auditLog(req.user.email, 'DELETE', 'Solution', parseInt(id), { name: solution.name });

    res.json({ ok: true, message: 'Solution deleted' });
  } catch (error) {
    throw error;
  }
});

export default router;