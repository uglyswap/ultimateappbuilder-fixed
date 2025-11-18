import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { rateLimiter } from '@/api/middleware/rate-limiter';

describe('Rate Limiter', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      ip: '127.0.0.1',
      path: '/api/test',
    };

    res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  it('should allow requests within limit', () => {
    rateLimiter(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should set rate limit headers', () => {
    rateLimiter(req as Request, res as Response, next);
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', expect.any(String));
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', expect.any(String));
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(String));
  });

  it('should skip rate limiting for health check', () => {
    req.path = '/health';
    rateLimiter(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(res.setHeader).not.toHaveBeenCalled();
  });
});
