import { describe, it, expect } from 'vitest';
import {
  validateProjectConfig,
  validateEmail,
  validatePassword,
  validateUrl,
} from '@/utils/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('missing@domain')).toBe(false);
      expect(validateEmail('@nodomain.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123!');
      expect(result.valid).toBe(true);
    });

    it('should reject weak passwords', () => {
      const tooShort = validatePassword('Short1!');
      expect(tooShort.valid).toBe(false);
      expect(tooShort.errors).toBeDefined();

      const noUppercase = validatePassword('weakpass123!');
      expect(noUppercase.valid).toBe(false);

      const noSpecial = validatePassword('Weakpass123');
      expect(noSpecial.valid).toBe(false);
    });
  });

  describe('validateProjectConfig', () => {
    it('should validate correct project configuration', () => {
      const config = {
        name: 'test-project',
        template: 'SAAS',
        features: [
          { id: 'auth', name: 'Authentication', enabled: true },
        ],
      };

      const result = validateProjectConfig(config);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid project names', () => {
      const config = {
        name: 'invalid name with spaces',
        template: 'SAAS',
        features: [],
      };

      const result = validateProjectConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should reject invalid templates', () => {
      const config = {
        name: 'test-project',
        template: 'INVALID_TEMPLATE',
        features: [],
      };

      const result = validateProjectConfig(config);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('ftp://invalid')).toBe(false);
    });
  });
});
