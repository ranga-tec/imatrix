// ===============================
// CONTACT ROUTES (contact.js)
// ===============================
import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';

const contactRouter = express.Router();
const contactPrisma = new PrismaClient();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(1)
});

// Submit contact form (public)
contactRouter.post('/', async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);

    const message = await contactPrisma.contactMessage.create({
      data
    });

    // TODO: Send email notification here

    res.status(201).json({ ok: true, message: 'Message sent successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: error.errors });
    }
    throw error;
  }
});

// Get all contact messages (Admin/Editor)
contactRouter.get('/', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const messages = await contactPrisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({ ok: true, data: messages });
  } catch (error) {
    throw error;
  }
});

// Get contact message by ID (Admin/Editor)
contactRouter.get('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await contactPrisma.contactMessage.findUnique({
      where: { id: parseInt(id) }
    });

    if (!message) {
      return res.status(404).json({ ok: false, error: 'Message not found' });
    }

    res.json({ ok: true, data: message });
  } catch (error) {
    throw error;
  }
});

// Delete contact message (Admin only)
contactRouter.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    await contactPrisma.contactMessage.delete({
      where: { id: parseInt(id) }
    });

    res.json({ ok: true, message: 'Message deleted' });
  } catch (error) {
    throw error;
  }
});

export { contactRouter as default };