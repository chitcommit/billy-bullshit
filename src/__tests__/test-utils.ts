/**
 * Test utilities and mocks for Billy Bullshit tests
 */

import type { Env } from '../index';

/**
 * Mock KV namespace for testing
 */
export class MockKVNamespace implements KVNamespace {
  private store = new Map<string, { value: string; expiration?: number }>();

  async get(key: string): Promise<string | null>;
  async get(key: string, type: 'text'): Promise<string | null>;
  async get(key: string, type: 'json'): Promise<any>;
  async get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
  async get(key: string, type: 'stream'): Promise<ReadableStream | null>;
  async get(key: string, type?: any): Promise<any> {
    const item = this.store.get(key);
    if (!item) return null;

    // Check expiration
    if (item.expiration && Date.now() > item.expiration) {
      this.store.delete(key);
      return null;
    }

    if (type === 'json') {
      return JSON.parse(item.value);
    }
    return item.value;
  }

  async put(key: string, value: string | ArrayBuffer | ReadableStream, options?: any): Promise<void> {
    const strValue = typeof value === 'string' ? value : JSON.stringify(value);
    const expiration = options?.expirationTtl
      ? Date.now() + options.expirationTtl * 1000
      : undefined;

    this.store.set(key, { value: strValue, expiration });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async list(options?: { prefix?: string }): Promise<{ keys: Array<{ name: string }> }> {
    const keys = Array.from(this.store.keys())
      .filter(key => !options?.prefix || key.startsWith(options.prefix))
      .map(name => ({ name }));
    return { keys };
  }

  async getWithMetadata(key: string): Promise<any> {
    throw new Error('Not implemented');
  }
}

/**
 * Mock Cloudflare Workers AI binding
 */
export class MockAI {
  private mockResponse: string;

  constructor(mockResponse = "This is a mock AI response from Billy.") {
    this.mockResponse = mockResponse;
  }

  async run(model: string, options: any): Promise<any> {
    if (options.stream) {
      // Return a mock stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"response": "Mock stream response"}\n\n'));
          controller.close();
        }
      });
      return stream;
    }

    // Return mock response
    return { response: this.mockResponse };
  }

  setMockResponse(response: string) {
    this.mockResponse = response;
  }
}

/**
 * Create a mock environment for testing
 */
export function createMockEnv(overrides?: Partial<Env>): Env {
  return {
    AI: new MockAI(),
    CONVERSATIONS: new MockKVNamespace(),
    ENVIRONMENT: 'test',
    MAX_CONVERSATION_LENGTH: '20',
    DEFAULT_MODEL: '@cf/meta/llama-3.1-8b-instruct',
    ...overrides,
  };
}

/**
 * Mock fetch for testing external API calls
 */
export function mockFetch(response: any, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: async () => response,
  });
}
