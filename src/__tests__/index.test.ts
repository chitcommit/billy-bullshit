/**
 * Integration tests for API endpoints
 */
// @ts-nocheck - Test file with intentionally loose types for readability

import { describe, it, expect, beforeEach } from 'vitest';
import app from '../index';
import { createMockEnv, MockAI } from './test-utils';

describe('API Endpoints', () => {
  let mockEnv: any;

  beforeEach(() => {
    mockEnv = createMockEnv();
  });

  describe('GET /', () => {
    it('should return service info', async () => {
      const req = new Request('http://localhost/');
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.agent).toBe('Billy Bullshit');
      expect(data.version).toBe('1.0.0');
      expect(data.status).toBe('online');
      expect(data.endpoints).toBeDefined();
      expect(data.personality).toBeDefined();
    });

    it('should include all endpoint information', async () => {
      const req = new Request('http://localhost/');
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(data.endpoints.review).toContain('/review');
      expect(data.endpoints.chat).toBe('/chat');
      expect(data.endpoints.roast).toBe('/roast');
      expect(data.endpoints.analyze).toBe('/analyze');
      expect(data.endpoints.debate).toBe('/debate');
      expect(data.endpoints.health).toBe('/health');
    });

    it('should include personality traits', async () => {
      const req = new Request('http://localhost/');
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(data.personality.traits).toContain('brutally honest');
      expect(data.personality.traits).toContain('code-review-obsessed');
      expect(data.personality.warning).toBeDefined();
      expect(data.personality.mission).toBeDefined();
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const req = new Request('http://localhost/health');
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
      expect(data.message).toContain('Billy');
    });

    it('should include timestamp in ISO format', async () => {
      const req = new Request('http://localhost/health');
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('POST /review', () => {
    it('should review code successfully', async () => {
      const mockAI = mockEnv.AI as MockAI;
      mockAI.setMockResponse('BS SCORE: 7/10\nCRITICAL: None\nMAJOR: Bad naming\nTHE FIX: Use descriptive names');

      const req = new Request('http://localhost/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'var x = 1;' }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.review).toBeDefined();
      expect(data.billy_says).toContain('BS detected');
    });

    it('should accept language parameter', async () => {
      const req = new Request('http://localhost/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'console.log("test")',
          language: 'javascript',
        }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.language).toBe('javascript');
    });

    it('should accept context parameter', async () => {
      const req = new Request('http://localhost/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'function test() {}',
          context: 'production code',
        }),
      });
      const res = await app.fetch(req, mockEnv);

      expect(res.status).toBe(200);
    });

    it('should return 400 for missing code', async () => {
      const req = new Request('http://localhost/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('No code');
    });

    it('should handle review errors with fallback', async () => {
      mockEnv.AI = {
        run: async () => {
          throw new Error('AI error');
        },
      };

      const req = new Request('http://localhost/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'test' }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      // When AI fails, it falls back to a fallback response and still returns 200
      expect(res.status).toBe(200);
      expect(data.review).toBeDefined();
      expect(typeof data.review).toBe('string');
    });
  });

  describe('POST /chat', () => {
    it('should chat with Billy', async () => {
      const req = new Request('http://localhost/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello Billy' }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.response).toBeDefined();
      expect(data.sessionId).toBeDefined();
    });

    it('should handle conversation with session ID', async () => {
      const sessionId = 'test-session-123';
      const req = new Request('http://localhost/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Hello',
          sessionId,
        }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.sessionId).toBe(sessionId);
    });

    it('should generate session ID if not provided', async () => {
      const req = new Request('http://localhost/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello' }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(data.sessionId).toMatch(/^billy_\d+$/);
    });

    it('should return 400 for missing message', async () => {
      const req = new Request('http://localhost/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('No message');
    });

    it('should persist conversation history', async () => {
      const sessionId = 'persist-test';

      // First message
      await app.fetch(
        new Request('http://localhost/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'First message',
            sessionId,
          }),
        }),
        mockEnv
      );

      // Second message
      await app.fetch(
        new Request('http://localhost/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Second message',
            sessionId,
          }),
        }),
        mockEnv
      );

      // Check history was saved
      const history = await mockEnv.CONVERSATIONS.get(`conversation:${sessionId}`, 'json');
      expect(history).toBeDefined();
      expect(history.length).toBeGreaterThan(0);
    });
  });

  describe('POST /roast', () => {
    it('should roast target', async () => {
      const mockAI = mockEnv.AI as MockAI;
      mockAI.setMockResponse('Your code is so bad...');

      const req = new Request('http://localhost/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'my terrible code' }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.roast).toBeDefined();
      expect(data.warning).toBeDefined();
      expect(data.billy_says).toBe('🔥');
    });

    it('should accept context parameter', async () => {
      const req = new Request('http://localhost/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'my code',
          context: 'production',
        }),
      });
      const res = await app.fetch(req, mockEnv);

      expect(res.status).toBe(200);
    });

    it('should return 400 for missing target', async () => {
      const req = new Request('http://localhost/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('What am I supposed to roast');
    });
  });

  describe('POST /analyze', () => {
    it('should analyze subject', async () => {
      const req = new Request('http://localhost/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: 'React hooks' }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.analysis).toBeDefined();
      expect(data.type).toBe('general');
    });

    it('should accept type parameter', async () => {
      const req = new Request('http://localhost/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'JavaScript',
          type: 'language',
        }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.type).toBe('language');
    });

    it('should return 400 for missing subject', async () => {
      const req = new Request('http://localhost/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('Analyze what');
    });
  });

  describe('POST /debate', () => {
    it('should argue opposite position', async () => {
      const req = new Request('http://localhost/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: 'TypeScript is better',
          topic: 'programming languages',
        }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.topic).toBe('programming languages');
      expect(data.yourPosition).toBe('TypeScript is better');
      expect(data.billysSide).toBeDefined();
    });

    it('should return 400 for missing position', async () => {
      const req = new Request('http://localhost/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'testing' }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('position and topic');
    });

    it('should return 400 for missing topic', async () => {
      const req = new Request('http://localhost/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: 'test' }),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('position and topic');
    });
  });

  describe('POST /stream', () => {
    it('should return streaming response', async () => {
      const req = new Request('http://localhost/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Stream test' }),
      });
      const res = await app.fetch(req, mockEnv);

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('text/event-stream');
      expect(res.headers.get('Cache-Control')).toBe('no-cache');
      expect(res.body).toBeInstanceOf(ReadableStream);
    });

    it('should return 400 for missing message', async () => {
      const req = new Request('http://localhost/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('No message');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const req = new Request('http://localhost/nonexistent');
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toBe('Not Found');
      expect(data.billy_says).toContain('Wrong URL');
      expect(data.endpoints).toBeDefined();
    });

    it('should suggest valid endpoints', async () => {
      const req = new Request('http://localhost/invalid');
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(data.endpoints).toContain('/chat');
      expect(data.endpoints).toContain('/roast');
      expect(data.endpoints).toContain('/analyze');
    });
  });

  describe('CORS middleware', () => {
    it('should set CORS headers', async () => {
      const req = new Request('http://localhost/health');
      const res = await app.fetch(req, mockEnv);

      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should handle OPTIONS requests', async () => {
      const req = new Request('http://localhost/review', {
        method: 'OPTIONS',
      });
      const res = await app.fetch(req, mockEnv);

      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(res.headers.get('Access-Control-Allow-Headers')).toContain('Content-Type');
    });
  });

  describe('Error handling', () => {
    it('should handle global errors', async () => {
      // Force an error by passing invalid JSON
      const req = new Request('http://localhost/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json{',
      });
      const res = await app.fetch(req, mockEnv);

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it('should include Billy-style error messages', async () => {
      const req = new Request('http://localhost/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      // Billy's personality should come through even in errors
      expect(data.error).toBeDefined();
    });
  });
});
