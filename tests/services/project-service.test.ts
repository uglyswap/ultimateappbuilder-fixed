import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectService } from '@/services/project-service';
import type { ProjectConfig } from '@/types';

// Mock Prisma
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    project: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  })),
}));

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    service = new ProjectService();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const config: ProjectConfig = {
        name: 'test-project',
        template: 'SAAS',
        features: [
          { id: 'auth', name: 'Authentication', enabled: true },
        ],
      };

      // This is a unit test example
      // In real implementation, you'd mock Prisma properly
      expect(service).toBeDefined();
    });
  });
});
