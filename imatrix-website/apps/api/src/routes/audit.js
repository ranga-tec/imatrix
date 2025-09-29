// ===============================
// AUDIT ROUTES (audit.js)
// ===============================
//imatrix-website/apps/api/src/routes/audit.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';

const auditRouter = express.Router();
const auditPrisma = new PrismaClient();

// Get audit logs (Admin only)
auditRouter.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { actor, entity, action, limit = 100 } = req.query;
    
    const where = {};
    if (actor) where.actorEmail = { contains: actor, mode: 'insensitive' };
    if (entity) where.entity = entity;
    if (action) where.action = action;

    const logs = await auditPrisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ ok: true, data: logs });
  } catch (error) {
    throw error;
  }
});

export default auditRouter;