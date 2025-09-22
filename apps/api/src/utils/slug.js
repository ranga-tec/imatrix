import slugify from 'slugify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createSlug(text, entity, excludeId = null) {
  const baseSlug = slugify(text, { lower: true, strict: true });
  
  // Check if slug exists
  const where = { slug: baseSlug };
  if (excludeId) {
    where.id = { not: excludeId };
  }

  let existingRecord;
  switch (entity) {
    case 'post':
      existingRecord = await prisma.post.findFirst({ where });
      break;
    case 'product':
      existingRecord = await prisma.product.findFirst({ where });
      break;
    case 'solution':
      existingRecord = await prisma.solution.findFirst({ where });
      break;
    case 'category':
      existingRecord = await prisma.category.findFirst({ where });
      break;
    default:
      throw new Error(`Unknown entity type: ${entity}`);
  }

  if (!existingRecord) {
    return baseSlug;
  }

  // Generate unique slug with counter
  let counter = 1;
  let newSlug;
  do {
    newSlug = `${baseSlug}-${counter}`;
    const newWhere = { slug: newSlug };
    if (excludeId) {
      newWhere.id = { not: excludeId };
    }

    switch (entity) {
      case 'post':
        existingRecord = await prisma.post.findFirst({ where: newWhere });
        break;
      case 'product':
        existingRecord = await prisma.product.findFirst({ where: newWhere });
        break;
      case 'solution':
        existingRecord = await prisma.solution.findFirst({ where: newWhere });
        break;
      case 'category':
        existingRecord = await prisma.category.findFirst({ where: newWhere });
        break;
    }
    counter++;
  } while (existingRecord && counter < 100);

  return newSlug;
}