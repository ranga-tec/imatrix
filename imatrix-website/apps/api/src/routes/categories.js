// ===============================
// CATEGORIES ROUTES (categories.js)
// ===============================
import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { auditLog } from '../utils/audit.js';
import { createSlug } from '../utils/slug.js';

const categoryRouter = express.Router();
const categoryPrisma = new PrismaClient();

const categorySchema = z.object({
  name: z.string().min(1)
});

// Get all categories (public)
categoryRouter.get('/', async (req, res) => {
  try {
    const categories = await categoryPrisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ ok: true, data: categories });
  } catch (error) {
    throw error;
  }
});

// Create category (Admin/Editor)
categoryRouter.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const data = categorySchema.parse(req.body);
    const slug = await createSlug(data.name, 'category');

    const category = await categoryPrisma.category.create({
      data: { ...data, slug }
    });

    await auditLog(req.user.email, 'CREATE', 'Category', category.id, { name: category.name });

    res.status(201).json({ ok: true, data: category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Update category (Admin/Editor)
categoryRouter.patch('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = categorySchema.partial().parse(req.body);
    
    if (data.name) {
      data.slug = await createSlug(data.name, 'category', parseInt(id));
    }

    const category = await categoryPrisma.category.update({
      where: { id: parseInt(id) },
      data
    });

    await auditLog(req.user.email, 'UPDATE', 'Category', category.id, { name: category.name });

    res.json({ ok: true, data: category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Delete category (Admin only)
categoryRouter.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await categoryPrisma.category.findUnique({
      where: { id: parseInt(id) },
      select: { name: true }
    });

    if (!category) {
      return res.status(404).json({ ok: false, error: 'Category not found' });
    }

    await categoryPrisma.category.delete({
      where: { id: parseInt(id) }
    });

    await auditLog(req.user.email, 'DELETE', 'Category', parseInt(id), { name: category.name });

    res.json({ ok: true, message: 'Category deleted' });
  } catch (error) {
    throw error;
  }
});

export default categoryRouter;