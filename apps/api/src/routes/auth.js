// ===============================
// AUTH ROUTES (auth.js)
// ===============================
//imatrix-website/apps/api/src/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { auditLog } from '../utils/audit.js';

const router = express.Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Register (Admin only)
router.post('/register', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { email, password, role = 'EDITOR' } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ ok: false, error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: { email, passwordHash, role },
      select: { id: true, email: true, role: true, createdAt: true }
    });

    await auditLog(req.user.email, 'CREATE', 'User', user.id, { newUserEmail: email, role });

    res.json({ ok: true, data: user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await auditLog(email, 'LOGIN', 'User', user.id);

    res.json({
      ok: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    res.json({ ok: true, data: user });
  } catch (error) {
    throw error;
  }
});

// List users (Admin only)
router.get('/users', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ ok: true, data: users });
  } catch (error) {
    throw error;
  }
});

// Update user role (Admin only)
router.patch('/users/:id/role', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = z.object({ role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']) }).parse(req.body);

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: { id: true, email: true, role: true, createdAt: true }
    });

    await auditLog(req.user.email, 'UPDATE', 'User', user.id, { newRole: role });

    res.json({ ok: true, data: user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Add these routes to your auth.js file:

// Get user by ID (for admin editing)
router.get('/users/id/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, email: true, name: true, role: true, verified: true, createdAt: true, updatedAt: true }
    });

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    res.json({ ok: true, data: user });
  } catch (error) {
    throw error;
  }
});

// Update user (Admin only)
router.patch('/users/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
      verified: z.boolean().optional()
    }).parse(req.body);

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, verified: true, createdAt: true }
    });

    await auditLog(req.user.email, 'UPDATE', 'User', user.id, updateData);

    res.json({ ok: true, data: user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Delete user (Admin only)
router.delete('/users/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent self-deletion
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ ok: false, error: 'Cannot delete your own account' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { email: true }
    });

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    await auditLog(req.user.email, 'DELETE', 'User', parseInt(id), { email: user.email });

    res.json({ ok: true, message: 'User deleted' });
  } catch (error) {
    throw error;
  }
});

export default router;