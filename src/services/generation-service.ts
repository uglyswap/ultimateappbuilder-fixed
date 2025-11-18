import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GenerationService {
  async list(userId: string) {
    return prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getById(id: string) {
    return prisma.generation.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });
  }
}
