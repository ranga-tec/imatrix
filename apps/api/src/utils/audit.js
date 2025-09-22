import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function auditLog(actorEmail, action, entity, entityId = null, meta = null) {
  try {
    await prisma.auditLog.create({
      data: {
        actorEmail,
        action,
        entity,
        entityId,
        meta: meta ? JSON.stringify(meta) : null
      }
    });
  } catch (error) {
    console.error('Audit log failed:', error);
    // Don't throw - audit failures shouldn't break the main operation
  }
}