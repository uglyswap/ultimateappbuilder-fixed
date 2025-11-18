import { PrismaClient } from '@prisma/client';
import { Orchestrator } from '@/orchestrator';
import { logger } from '@/utils/logger';
import { slugify, generateId } from '@/utils/helpers';
import type { ProjectConfig } from '@/types';
import archiver from 'archiver';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export class ProjectService {
  async create(userId: string, config: ProjectConfig) {
    logger.info('Creating project', { userId, config });

    const project = await prisma.project.create({
      data: {
        name: config.name,
        description: config.description,
        template: config.template,
        config: config as any,
        features: config.features.map(f => f.id),
        userId,
        status: 'DRAFT',
      },
    });

    return project;
  }

  async list(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        generations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async generateCode(projectId: string, userId: string) {
    logger.info('Starting code generation', { projectId });

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'GENERATING' },
    });

    try {
      // Get project config
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Create orchestrator
      const orchestrator = new Orchestrator(
        projectId,
        userId,
        project.config as unknown as ProjectConfig
      );

      // Generate project
      const generatedProject = await orchestrator.orchestrate();

      // Save generated files
      const outputDir = path.join(process.cwd(), 'generated', projectId);
      await this.saveGeneratedFiles(outputDir, generatedProject.structure);

      // Update project
      await prisma.project.update({
        where: { id: projectId },
        data: {
          status: 'READY',
          generatedPath: outputDir,
        },
      });

      logger.info('Code generation completed', { projectId, outputDir });

      return generatedProject;
    } catch (error) {
      logger.error('Code generation failed', { projectId, error });

      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'ERROR' },
      });

      throw error;
    }
  }

  async downloadProject(projectId: string): Promise<string> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || !project.generatedPath) {
      throw new Error('Project not ready for download');
    }

    // Create ZIP
    const zipPath = path.join(process.cwd(), 'temp', `${projectId}.zip`);
    await fs.mkdir(path.dirname(zipPath), { recursive: true });

    const output = require('fs').createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => resolve(zipPath));
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(project.generatedPath!, false);
      archive.finalize();
    });
  }

  private async saveGeneratedFiles(
    outputDir: string,
    files: { path: string; content: string }[]
  ) {
    await fs.mkdir(outputDir, { recursive: true });

    for (const file of files) {
      const filePath = path.join(outputDir, file.path);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, file.content, 'utf-8');
    }

    logger.info('Generated files saved', { outputDir, count: files.length });
  }
}
