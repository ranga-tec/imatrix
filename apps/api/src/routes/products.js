// ===============================
//  PRODUCTS ROUTES (products.js)
// ===============================
//imatrix-website/apps/api/src/routes/products.js

import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { auditLog } from '../utils/audit.js';
import { createSlug } from '../utils/slug.js';

const router = express.Router();
const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(1),
  summary: z.string().optional(),
  description: z.string().optional(),
  specs: z.any().optional(),
  price: z.string().optional(),
  featured: z.boolean().optional()
});

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { featured, search, limit = 50 } = req.query;
    
    const where = {};
    if (featured === 'true') where.featured = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        media: {
          select: { id: true, url: true, alt: true, type: true }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: parseInt(limit)
    });

    res.json({ ok: true, data: products });
  } catch (error) {
    throw error;
  }
});


// Get product by ID (for admin editing)
router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        media: {
          select: { id: true, url: true, alt: true, caption: true, type: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ ok: false, error: 'Product not found' });
    }

    res.json({ ok: true, data: product });
  } catch (error) {
    throw error;
  }
});
// Get product by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        media: {
          select: { id: true, url: true, alt: true, caption: true, type: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ ok: false, error: 'Product not found' });
    }

    res.json({ ok: true, data: product });
  } catch (error) {
    throw error;
  }
});

// Create product (Admin/Editor)
router.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const data = productSchema.parse(req.body);
    const slug = await createSlug(data.name, 'product');

    const product = await prisma.product.create({
      data: { ...data, slug },
      include: {
        media: {
          select: { id: true, url: true, alt: true, type: true }
        }
      }
    });

    await auditLog(req.user.email, 'CREATE', 'Product', product.id, { name: product.name });

    res.status(201).json({ ok: true, data: product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Update product (Admin/Editor)
router.patch('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = productSchema.partial().parse(req.body);
    
    if (data.name) {
      data.slug = await createSlug(data.name, 'product', parseInt(id));
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data,
      include: {
        media: {
          select: { id: true, url: true, alt: true, type: true }
        }
      }
    });

    await auditLog(req.user.email, 'UPDATE', 'Product', product.id, { name: product.name });

    res.json({ ok: true, data: product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      select: { name: true }
    });

    if (!product) {
      return res.status(404).json({ ok: false, error: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    await auditLog(req.user.email, 'DELETE', 'Product', parseInt(id), { name: product.name });

    res.json({ ok: true, message: 'Product deleted' });
  } catch (error) {
    throw error;
  }
});

// Add media to product (Admin/Editor)
router.post('/:id/media', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaId } = req.body;

    await prisma.media.update({
      where: { id: parseInt(mediaId) },
      data: { productId: parseInt(id) }
    });

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        media: {
          select: { id: true, url: true, alt: true, type: true }
        }
      }
    });

    await auditLog(req.user.email, 'UPDATE', 'Product', parseInt(id), { action: 'Added media', mediaId });

    res.json({ ok: true, data: product });
  } catch (error) {
    throw error;
  }
});

export default router;