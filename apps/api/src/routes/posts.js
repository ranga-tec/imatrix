// ===============================
// POSTS ROUTES (posts.js)
// ===============================
import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { auditLog } from '../utils/audit.js';
import { createSlug } from '../utils/slug.js';

const router = express.Router();
const prisma = new PrismaClient();

const postSchema = z.object({
  title: z.string().min(1),
  body: z.string().optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional()
});


// Get all posts (public - only published, admin - all)
router.get('/', async (req, res) => {
  try {
    const { published, search, limit = 50, categoryId } = req.query;
    
    const where = {};
    
    // Public route only shows published posts unless authenticated
    const isAuthenticated = req.headers.authorization;
    if (!isAuthenticated && published !== 'false') {
      where.published = true;
    } else if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      where.categories = {
        some: { id: parseInt(categoryId) }
      };
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        categories: true,
        media: {
          select: { id: true, url: true, alt: true, type: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ ok: true, data: posts });
  } catch (error) {
    throw error;
  }
});


// Get post by ID (for admin editing)
router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: true,
        media: {
          select: { id: true, url: true, alt: true, caption: true, type: true }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ ok: false, error: 'Post not found' });
    }

    res.json({ ok: true, data: post });
  } catch (error) {
    throw error;
  }
});
// Get post by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const where = { slug };
    // Only show published posts to non-authenticated users
    const isAuthenticated = req.headers.authorization;
    if (!isAuthenticated) {
      where.published = true;
    }
    
    const post = await prisma.post.findFirst({
      where,
      include: {
        categories: true,
        media: {
          select: { id: true, url: true, alt: true, caption: true, type: true }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ ok: false, error: 'Post not found' });
    }

    res.json({ ok: true, data: post });
  } catch (error) {
    throw error;
  }
});

// Create post (Admin/Editor)
router.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const data = postSchema.parse(req.body);
    const { categoryIds, ...postData } = data;
    const slug = await createSlug(data.title, 'post');

    const post = await prisma.post.create({
      data: {
        ...postData,
        slug,
        categories: categoryIds ? {
          connect: categoryIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        categories: true,
        media: {
          select: { id: true, url: true, alt: true, type: true }
        }
      }
    });

    await auditLog(req.user.email, 'CREATE', 'Post', post.id, { title: post.title });

    res.status(201).json({ ok: true, data: post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Update post (Admin/Editor)
router.patch('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = postSchema.partial().parse(req.body);
    const { categoryIds, ...updateData } = data;
    
    if (data.title) {
      updateData.slug = await createSlug(data.title, 'post', parseInt(id));
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        categories: categoryIds ? {
          set: categoryIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        categories: true,
        media: {
          select: { id: true, url: true, alt: true, type: true }
        }
      }
    });

    await auditLog(req.user.email, 'UPDATE', 'Post', post.id, { title: post.title });

    res.json({ ok: true, data: post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Delete post (Admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      select: { title: true }
    });

    if (!post) {
      return res.status(404).json({ ok: false, error: 'Post not found' });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) }
    });

    await auditLog(req.user.email, 'DELETE', 'Post', parseInt(id), { title: post.title });

    res.json({ ok: true, message: 'Post deleted' });
  } catch (error) {
    throw error;
  }
});

export default router;