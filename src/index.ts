/**
 * Billy Bullshit - A No-BS AI Agent on Cloudflare Workers
 *
 * Billy doesn't sugarcoat anything. He's here to cut through
 * the BS, tell you what you need to hear, and keep it real.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { BillyAgent } from './billy-agent';
import { ConversationStore } from './conversation-store';

export interface Env {
	AI: any; // Cloudflare Workers AI binding
	CONVERSATIONS: KVNamespace; // KV for conversation history
	ANTHROPIC_API_KEY?: string;
	OPENAI_API_KEY?: string;
	ENVIRONMENT?: string;
	MAX_CONVERSATION_LENGTH?: string;
	DEFAULT_MODEL?: string;
}

const app = new Hono();

// CORS middleware
app.use('/*', cors({
	origin: '*',
	allowMethods: ['GET', 'POST', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/', (c) => {
	return c.json({
		agent: 'Billy Bullshit',
		version: '1.0.0',
		status: 'online',
		tagline: 'Calling BS on your BS code since 2024',
		primary_function: '💩 Code Review - Calling out bullshit code',
		endpoints: {
			review: '/review (PRIMARY - Code Review)',
			chat: '/chat',
			roast: '/roast',
			analyze: '/analyze',
			debate: '/debate',
			health: '/health',
		},
		personality: {
			traits: ['brutally honest', 'sarcastic', 'no-nonsense', 'insightful', 'code-review-obsessed'],
			warning: 'Billy doesnt sugarcoat anything. Proceed at your own risk.',
			mission: 'Call out BS in your code. That\'s what I do.',
		}
	});
});

// Health check endpoint
app.get('/health', (c) => {
	return c.json({
		status: 'healthy',
		timestamp: new Date().toISOString(),
		message: 'Billy is alive and ready to call out your BS',
	});
});

// Chat endpoint - have a conversation with Billy
app.post('/chat', async (c) => {
	try {
		const { message, sessionId } = await c.req.json();

		if (!message) {
			return c.json({ error: 'No message provided. What, cat got your tongue?' }, 400);
		}

		const env = c.env as unknown as Env;
		const billy = new BillyAgent(env);
		const conversationStore = new ConversationStore(env.CONVERSATIONS);

		// Load conversation history
		const history = sessionId
			? await conversationStore.getHistory(sessionId)
			: [];

		// Get Billy's response
		const response = await billy.chat(message, history);

		// Save conversation
		if (sessionId) {
			await conversationStore.addMessage(sessionId, {
				role: 'user',
				content: message,
				timestamp: new Date().toISOString(),
			});
			await conversationStore.addMessage(sessionId, {
				role: 'assistant',
				content: response,
				timestamp: new Date().toISOString(),
			});
		}

		return c.json({
			response,
			sessionId: sessionId || `billy_${Date.now()}`,
			billy_says: 'There you go. No BS, just straight talk.',
		});

	} catch (error: any) {
		console.error('Chat error:', error);
		return c.json({
			error: 'Something broke. Even I cant fix stupid code.',
			details: error.message
		}, 500);
	}
});

// Roast endpoint - Billy roasts your code/idea/whatever
app.post('/roast', async (c) => {
	try {
		const { target, context } = await c.req.json();

		if (!target) {
			return c.json({ error: 'What am I supposed to roast? Thin air?' }, 400);
		}

		const env = c.env as unknown as Env;
		const billy = new BillyAgent(env);
		const roast = await billy.roast(target, context);

		return c.json({
			roast,
			warning: 'You asked for it. Dont blame me if your feelings get hurt.',
			billy_says: '🔥',
		});

	} catch (error: any) {
		console.error('Roast error:', error);
		return c.json({
			error: 'Cant even roast properly. Thats embarrassing.',
			details: error.message
		}, 500);
	}
});

// Review endpoint - Billy's PRIMARY FUNCTION: Call out BS in your code
app.post('/review', async (c) => {
	try {
		const { code, language, context } = await c.req.json();

		if (!code) {
			return c.json({ error: 'No code to review. You expect me to critique thin air?' }, 400);
		}

		const env = c.env as unknown as Env;
		const billy = new BillyAgent(env);
		const review = await billy.reviewCode(code, language, context);

		return c.json({
			review,
			language: language || 'unknown',
			billy_says: '💩 BS detected and called out. You\'re welcome.',
		});

	} catch (error: any) {
		console.error('Review error:', error);
		return c.json({
			error: 'Code review failed. Your code might be too broken for me.',
			details: error.message
		}, 500);
	}
});

// Analyze endpoint - Billy analyzes something with brutal honesty
app.post('/analyze', async (c) => {
	try {
		const { subject, type } = await c.req.json();

		if (!subject) {
			return c.json({ error: 'Analyze what? Your lack of input?' }, 400);
		}

		const env = c.env as unknown as Env;
		const billy = new BillyAgent(env);
		const analysis = await billy.analyze(subject, type);

		return c.json({
			analysis,
			type: type || 'general',
			billy_says: 'Analysis complete. Truth hurts, doesnt it?',
		});

	} catch (error: any) {
		console.error('Analyze error:', error);
		return c.json({
			error: 'Analysis failed. Maybe your input was too BS for me.',
			details: error.message
		}, 500);
	}
});

// Debate endpoint - argue with Billy (good luck)
app.post('/debate', async (c) => {
	try {
		const { position, topic } = await c.req.json();

		if (!position || !topic) {
			return c.json({ error: 'Need a position and topic. Come prepared.' }, 400);
		}

		const env = c.env as unknown as Env;
		const billy = new BillyAgent(env);
		const counterArgument = await billy.debate(position, topic);

		return c.json({
			topic,
			yourPosition: position,
			billysSide: counterArgument,
			billy_says: 'Lets see if you can handle the truth.',
		});

	} catch (error: any) {
		console.error('Debate error:', error);
		return c.json({
			error: 'Debate failed. You probably didnt have a good argument anyway.',
			details: error.message
		}, 500);
	}
});

// Stream endpoint - streaming responses
app.post('/stream', async (c) => {
	const { message } = await c.req.json();

	if (!message) {
		return c.json({ error: 'No message to stream. Come on.' }, 400);
	}

	const env = c.env as unknown as Env;
	const billy = new BillyAgent(env);
	const stream = await billy.stream(message);

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
		},
	});
});

// 404 handler
app.notFound((c) => {
	return c.json({
		error: 'Not Found',
		billy_says: 'Wrong URL, genius. Try reading the docs.',
		endpoints: ['/chat', '/roast', '/analyze', '/debate', '/health']
	}, 404);
});

// Error handler
app.onError((err, c) => {
	console.error('Global error:', err);
	return c.json({
		error: 'Internal Server Error',
		billy_says: 'Well, something broke. Probably your fault.',
		message: err.message,
	}, 500);
});

export default app;
