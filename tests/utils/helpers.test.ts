import { describe, it, expect } from 'vitest';
import {
  slugify,
  generateId,
  formatBytes,
  formatDuration,
  chunkArray,
} from '@/utils/helpers';

describe('Helpers', () => {
  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test Project 123')).toBe('test-project-123');
      expect(slugify('Special!@#Characters')).toBe('specialcharacters');
    });

    it('should handle edge cases', () => {
      expect(slugify('   spaces   ')).toBe('spaces');
      expect(slugify('multiple---dashes')).toBe('multiple-dashes');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
    });

    it('should support prefixes', () => {
      const id = generateId('test');
      expect(id).toContain('test_');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(formatDuration(500)).toBe('500ms');
      expect(formatDuration(2000)).toBe('2.0s');
      expect(formatDuration(60000)).toBe('1.0m');
      expect(formatDuration(3600000)).toBe('1.0h');
    });
  });

  describe('chunkArray', () => {
    it('should split array into chunks', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      const chunks = chunkArray(arr, 3);

      expect(chunks.length).toBe(3);
      expect(chunks[0]).toEqual([1, 2, 3]);
      expect(chunks[1]).toEqual([4, 5, 6]);
      expect(chunks[2]).toEqual([7]);
    });

    it('should handle empty arrays', () => {
      expect(chunkArray([], 3)).toEqual([]);
    });
  });
});
