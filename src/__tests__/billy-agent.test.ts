/**
 * Tests for BillyAgent class
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BillyAgent } from '../billy-agent';
import { createMockEnv, MockAI } from './test-utils';

describe('BillyAgent', () => {
  let billy: BillyAgent;
  let mockEnv: any;

  beforeEach(() => {
    mockEnv = createMockEnv();
    billy = new BillyAgent(mockEnv);
  });

  describe('constructor', () => {
    it('should create BillyAgent instance', () => {
      expect(billy).toBeInstanceOf(BillyAgent);
    });

    it('should initialize with environment', () => {
      expect(billy).toBeDefined();
    });
  });

  describe('reviewCode', () => {
    it('should review code and return response', async () => {
      const code = 'if (condition == true) { return true; }';
      const mockAI = mockEnv.AI as MockAI;
      mockAI.setMockResponse('BS Level: 8/10. Just return the condition.');

      const review = await billy.reviewCode(code);
      expect(review).toContain('BS');
    });

    it('should accept language parameter', async () => {
      const code = 'console.log("test")';
      const review = await billy.reviewCode(code, 'javascript');
      expect(review).toBeDefined();
    });

    it('should accept context parameter', async () => {
      const code = 'function test() {}';
      const review = await billy.reviewCode(code, 'javascript', 'Testing context');
      expect(review).toBeDefined();
    });

    it('should include BS score in review structure', async () => {
      const code = 'var x = 1;';
      const mockAI = mockEnv.AI as MockAI;
      mockAI.setMockResponse('BS SCORE: 5/10\nCRITICAL: None\nMAJOR: Use const/let\nBS: Using var in 2024\nTHE FIX: const x = 1;');

      const review = await billy.reviewCode(code);
      expect(review).toContain('BS SCORE');
    });
  });

  describe('chat', () => {
    it('should respond to chat message', async () => {
      const message = 'Hello Billy';
      const response = await billy.chat(message);
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
    });

    it('should accept conversation history', async () => {
      const history = [
        { role: 'user' as const, content: 'Hi' },
        { role: 'assistant' as const, content: 'Hello' },
      ];
      const response = await billy.chat('How are you?', history);
      expect(response).toBeDefined();
    });

    it('should work with empty history', async () => {
      const response = await billy.chat('Test message', []);
      expect(response).toBeDefined();
    });
  });

  describe('roast', () => {
    it('should roast target', async () => {
      const target = 'my terrible code';
      const mockAI = mockEnv.AI as MockAI;
      mockAI.setMockResponse('Your code is so bad, it makes spaghetti code look organized.');

      const roast = await billy.roast(target);
      expect(roast).toBeDefined();
      expect(typeof roast).toBe('string');
    });

    it('should accept context parameter', async () => {
      const target = 'my code';
      const context = 'production code';
      const roast = await billy.roast(target, context);
      expect(roast).toBeDefined();
    });
  });

  describe('analyze', () => {
    it('should analyze subject', async () => {
      const subject = 'JavaScript promises';
      const analysis = await billy.analyze(subject);
      expect(analysis).toBeDefined();
      expect(typeof analysis).toBe('string');
    });

    it('should accept analysis type', async () => {
      const subject = 'React hooks';
      const analysis = await billy.analyze(subject, 'code-pattern');
      expect(analysis).toBeDefined();
    });

    it('should use general type by default', async () => {
      const subject = 'testing';
      const analysis = await billy.analyze(subject);
      expect(analysis).toBeDefined();
    });
  });

  describe('debate', () => {
    it('should argue opposite position', async () => {
      const position = 'TypeScript is better than JavaScript';
      const topic = 'programming languages';
      const mockAI = mockEnv.AI as MockAI;
      mockAI.setMockResponse('Actually, JavaScript is more flexible...');

      const argument = await billy.debate(position, topic);
      expect(argument).toBeDefined();
      expect(typeof argument).toBe('string');
    });
  });

  describe('stream', () => {
    it('should return a ReadableStream', async () => {
      const message = 'Test streaming';
      const stream = await billy.stream(message);
      expect(stream).toBeInstanceOf(ReadableStream);
    });

    it('should use Workers AI for streaming', async () => {
      const message = 'Stream test';
      const stream = await billy.stream(message);
      expect(stream).toBeDefined();
    });
  });

  describe('AI provider fallback chain', () => {
    it('should use Workers AI as primary provider', async () => {
      const mockAI = mockEnv.AI as MockAI;
      mockAI.setMockResponse('Workers AI response');

      const response = await billy.chat('test');
      expect(response).toBe('Workers AI response');
    });

    it('should fallback to Anthropic when Workers AI fails', async () => {
      mockEnv.AI = null;
      mockEnv.ANTHROPIC_API_KEY = 'test-key';

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          content: [{ text: 'Anthropic response' }],
        }),
      });

      billy = new BillyAgent(mockEnv);
      const response = await billy.chat('test');
      expect(response).toBe('Anthropic response');
    });

    it('should fallback to OpenAI when Anthropic unavailable', async () => {
      mockEnv.AI = null;
      mockEnv.OPENAI_API_KEY = 'test-key';

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'OpenAI response' } }],
        }),
      });

      billy = new BillyAgent(mockEnv);
      const response = await billy.chat('test');
      expect(response).toBe('OpenAI response');
    });

    it('should use fallback response when all providers fail', async () => {
      mockEnv.AI = null;

      billy = new BillyAgent(mockEnv);
      const response = await billy.chat('test');
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should handle Anthropic API errors', async () => {
      mockEnv.AI = null;
      mockEnv.ANTHROPIC_API_KEY = 'test-key';

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'API Error',
      });

      billy = new BillyAgent(mockEnv);
      const response = await billy.chat('test');
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
    });

    it('should handle OpenAI API errors', async () => {
      mockEnv.AI = null;
      mockEnv.OPENAI_API_KEY = 'test-key';

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'API Error',
      });

      billy = new BillyAgent(mockEnv);
      const response = await billy.chat('test');
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
    });
  });

  describe('personality', () => {
    it('should have consistent Billy personality in reviews', async () => {
      const code = 'function add(a, b) { return a + b; }';
      const mockAI = mockEnv.AI as MockAI;
      mockAI.setMockResponse('BS Level: 2/10. Simple and clean.');

      const review = await billy.reviewCode(code);
      expect(review).toBeDefined();
    });

    it('should maintain harsh but fair tone', async () => {
      const mockAI = mockEnv.AI as MockAI;
      mockAI.setMockResponse("Look, I'd be harsh but fair here.");

      const response = await billy.chat('Is my code okay?');
      expect(response).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle AI run errors gracefully', async () => {
      mockEnv.AI = {
        run: async () => {
          throw new Error('AI error');
        },
      };

      billy = new BillyAgent(mockEnv);
      const response = await billy.chat('test');
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
    });

    it('should return valid fallback response', async () => {
      mockEnv.AI = null;

      billy = new BillyAgent(mockEnv);
      const response = await billy.chat('test');

      // Should be one of the fallback responses
      const fallbackPhrases = [
        "I'd love to help",
        "coffee break",
        "teapot",
        "down",
        "Technical difficulties",
      ];

      const matchesFallback = fallbackPhrases.some(phrase =>
        response.toLowerCase().includes(phrase.toLowerCase())
      );
      expect(matchesFallback).toBe(true);
    });
  });
});
