// ===============================
//  AUTH MIDDLEWARE
// ===============================
// imatrix-website/apps/api/src/middleware/auth.js 
// Middleware for handling authentication and authorization using JWT and Prisma.

import jwt from 'jsonwebtoken';

let prisma;

// Initialize Prisma client lazily
async function getPrismaClient() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}

export function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ ok: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, error: 'Invalid token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: 'Insufficient permissions' });
    }

    next();
  };
}

export async function getCurrentUser(req, res, next) {
  if (!req.user) {
    return next();
  }

  try {
    const prismaClient = await getPrismaClient();
    const user = await prismaClient.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return res.status(401).json({ ok: false, error: 'User not found' });
    }

    req.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
}