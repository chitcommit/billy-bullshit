import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock BillyAgent so we don't hit real AI
vi.mock('../src/billy-agent', () => ({
	BillyAgent: class {
		chat = vi.fn().mockResolvedValue('Billy says something blunt.');
		reviewCode = vi.fn().mockResolvedValue('BS Level: 7/10. Fix your code.');
		roast = vi.fn().mockResolvedValue('Roasted. You are welcome.');
		analyze = vi.fn().mockResolvedValue('Analysis: needs work.');
		debate = vi.fn().mockResolvedValue('Your argument is weak.');
		stream = vi.fn().mockResolvedValue(new ReadableStream());
	},
}));

// Mock ConversationStore
vi.mock('../src/conversation-store', () => ({
	ConversationStore: class {
		getHistory = vi.fn().mockResolvedValue([]);
		addMessage = vi.fn().mockResolvedValue(undefined);
		clearHistory = vi.fn().mockResolvedValue(undefined);
	},
}));

import app from '../src/index';

const mockEnv = {
	AI: { run: vi.fn() },
	CONVERSATIONS: {
		get: vi.fn().mockResolvedValue(null),
		put: vi.fn().mockResolvedValue(undefined),
		delete: vi.fn().mockResolvedValue(undefined),
		list: vi.fn().mockResolvedValue({ keys: [] }),
	},
	ENVIRONMENT: 'test',
	DEFAULT_MODEL: '@cf/meta/llama-3.1-8b-instruct',
};

function makeRequest(path: string, options: RequestInit = {}) {
	return new Request(`https://billy.chitty.cc${path}`, options);
}

describe('Billy Bullshit Worker', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET /', () => {
		it('returns agent info', async () => {
			const res = await app.fetch(makeRequest('/'), mockEnv);
			const body = await res.json();
			expect(body.agent).toBe('Billy Bullshit');
			expect(body.status).toBe('online');
			expect(body.endpoints).toBeDefined();
			expect(body.endpoints.review).toContain('/review');
		});
	});

	describe('GET /health', () => {
		it('returns healthy status', async () => {
			const res = await app.fetch(makeRequest('/health'), mockEnv);
			const body = await res.json();
			expect(body.status).toBe('healthy');
			expect(body.timestamp).toBeDefined();
		});
	});

	describe('POST /review', () => {
		it('rejects missing code', async () => {
			const res = await app.fetch(
				makeRequest('/review', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({}),
				}),
				mockEnv,
			);
			expect(res.status).toBe(400);
			const body = await res.json();
			expect(body.error).toBeDefined();
		});

		it('reviews code and returns result', async () => {
			const res = await app.fetch(
				makeRequest('/review', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						code: 'if (x == true) { return true; } else { return false; }',
						language: 'javascript',
					}),
				}),
				mockEnv,
			);
			const body = await res.json();
			expect(res.status).toBe(200);
			expect(body.review).toBeDefined();
			expect(body.language).toBe('javascript');
			expect(body.billy_says).toBeDefined();
		});
	});

	describe('POST /chat', () => {
		it('rejects missing message', async () => {
			const res = await app.fetch(
				makeRequest('/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({}),
				}),
				mockEnv,
			);
			expect(res.status).toBe(400);
		});

		it('returns chat response', async () => {
			const res = await app.fetch(
				makeRequest('/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ message: 'Why is my code bad?' }),
				}),
				mockEnv,
			);
			const body = await res.json();
			expect(res.status).toBe(200);
			expect(body.response).toBeDefined();
			expect(body.sessionId).toBeDefined();
		});

		it('uses sessionId when provided', async () => {
			const res = await app.fetch(
				makeRequest('/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ message: 'Hello Billy', sessionId: 'test-session-123' }),
				}),
				mockEnv,
			);
			const body = await res.json();
			expect(res.status).toBe(200);
			expect(body.sessionId).toBe('test-session-123');
		});
	});

	describe('POST /roast', () => {
		it('rejects missing target', async () => {
			const res = await app.fetch(
				makeRequest('/roast', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({}),
				}),
				mockEnv,
			);
			expect(res.status).toBe(400);
		});

		it('roasts the target', async () => {
			const res = await app.fetch(
				makeRequest('/roast', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ target: 'My spaghetti code' }),
				}),
				mockEnv,
			);
			const body = await res.json();
			expect(res.status).toBe(200);
			expect(body.roast).toBeDefined();
			expect(body.billy_says).toBe('🔥');
		});
	});

	describe('POST /analyze', () => {
		it('rejects missing subject', async () => {
			const res = await app.fetch(
				makeRequest('/analyze', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({}),
				}),
				mockEnv,
			);
			expect(res.status).toBe(400);
		});

		it('analyzes the subject', async () => {
			const res = await app.fetch(
				makeRequest('/analyze', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ subject: 'microservices architecture', type: 'architecture' }),
				}),
				mockEnv,
			);
			const body = await res.json();
			expect(res.status).toBe(200);
			expect(body.analysis).toBeDefined();
			expect(body.type).toBe('architecture');
		});
	});

	describe('POST /debate', () => {
		it('rejects missing position or topic', async () => {
			const res = await app.fetch(
				makeRequest('/debate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ position: 'Tabs are better' }),
				}),
				mockEnv,
			);
			expect(res.status).toBe(400);
		});

		it('debates the topic', async () => {
			const res = await app.fetch(
				makeRequest('/debate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ position: 'Tabs are better', topic: 'Tabs vs Spaces' }),
				}),
				mockEnv,
			);
			const body = await res.json();
			expect(res.status).toBe(200);
			expect(body.topic).toBe('Tabs vs Spaces');
			expect(body.yourPosition).toBe('Tabs are better');
			expect(body.billysSide).toBeDefined();
		});
	});

	describe('POST /stream', () => {
		it('rejects missing message', async () => {
			const res = await app.fetch(
				makeRequest('/stream', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({}),
				}),
				mockEnv,
			);
			expect(res.status).toBe(400);
		});
	});

	describe('404 handler', () => {
		it('returns 404 for unknown routes', async () => {
			const res = await app.fetch(makeRequest('/nonexistent'), mockEnv);
			expect(res.status).toBe(404);
			const body = await res.json();
			expect(body.billy_says).toBeDefined();
		});
	});
});
