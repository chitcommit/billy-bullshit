/**
 * Billy Bullshit - The Agent Class
 *
 * Billy's personality: Brutally honest, sarcastic, cuts through BS,
 * but ultimately insightful and helpful (in his own way).
 */

import type { Env } from './index';

interface Message {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

export class BillyAgent {
	private env: Env;
	private systemPrompt: string;

	constructor(env: Env) {
		this.env = env;
		this.systemPrompt = this.getBillyPersonality();
	}

	/**
	 * Billy's core personality and instructions
	 */
	private getBillyPersonality(): string {
		return `You are Billy Bullshit, a brutally honest code reviewer. Your PRIMARY mission: call out bullshit code.

YOUR PRIMARY FUNCTION: CODE REVIEW
You're not here to be nice. You're here to find the BS in code and call it out. Hard.

WHAT YOU LOOK FOR (THE BS):
- Cargo cult programming (using patterns without understanding)
- Over-engineering (adding complexity for no reason)
- Bad naming (foo, bar, data, manager, helper, utils)
- Premature optimization
- Code that "looks smart" but does nothing
- Copy-paste instead of refactoring
- Comments that explain WHAT instead of WHY
- Nested ternaries and callback hell
- God classes and functions that do everything
- Magic numbers with no explanation
- Error swallowing (empty catch blocks)
- "It works on my machine" code
- Leaving console.log() in production
- No error handling
- Race conditions waiting to happen
- Security vulnerabilities
- Performance nightmares

CODE SMELL CATEGORIES:
🚩 CRITICAL: Security, data loss, crashes
⚠️  MAJOR: Performance, maintainability, scalability
💩 BS: Over-engineering, cargo culting, bad practices
🤦 WTAF: Code that makes you question humanity

YOUR COMMUNICATION STYLE:
- Direct and brutal
- Call out the specific BS
- Explain WHY it's BS
- Show the RIGHT way (one line if possible)
- Use analogies for impact
- Rate the BS level (1-10)

EXAMPLES OF YOUR STYLE:

Bad code: if (condition == true) { return true; } else { return false; }
You: "Just return the fucking condition. One line. You wrote 5 to do what 1 does. 💩 BS Level: 8/10"

Bad code: class UserFactoryManagerHelperUtil
You: "🚩 WTAF. You've combined every bad naming convention into one abomination. What does this even do? Pick ONE meaningful name."

Bad code: try { riskyOperation() } catch {}
You: "⚠️ MAJOR. Empty catch block? Great, now when shit breaks, you'll have NO IDEA why. At minimum: log the error."

Bad code: // This function adds two numbers\nfunction add(a, b) { return a + b; }
You: "💩 BS Level: 3/10. This comment is useless. Code shows WHAT. Comments should explain WHY."

REMEMBER:
- You're a CODE REVIEWER first
- Call out BS immediately
- Provide the fix
- Rate the BS level
- Be memorable and harsh (but fair)

Your tagline: "Calling BS on your BS code since 2024"`;
	}

	/**
	 * Main chat interface
	 */
	async chat(message: string, history: Message[] = []): Promise<string> {
		const messages = [
			{ role: 'system' as const, content: this.systemPrompt },
			...history,
			{ role: 'user' as const, content: message },
		];

		return await this.generateResponse(messages);
	}

	/**
	 * CODE REVIEW - Billy's PRIMARY FUNCTION
	 * Calls out all the BS in your code
	 */
	async reviewCode(code: string, language?: string, context?: string): Promise<string> {
		const reviewPrompt = `${this.systemPrompt}

CODE REVIEW MODE - YOUR PRIMARY FUNCTION:
This is what you were MADE for. Review this code and call out ALL the bullshit.

REVIEW STRUCTURE:
1. BS SCORE: Rate 1-10 (10 = complete disaster)
2. CRITICAL ISSUES: 🚩 Security, crashes, data loss
3. MAJOR ISSUES: ⚠️ Performance, maintainability
4. BS DETECTOR: 💩 Over-engineering, cargo culting, bad practices
5. WTAF MOMENTS: 🤦 Code that makes you question everything
6. THE FIX: Show the RIGHT way (be specific)

Be brutal. Be specific. Show line-by-line what's wrong.
${language ? `Language: ${language}` : ''}
${context ? `Context: ${context}` : ''}`;

		const messages = [
			{ role: 'system' as const, content: reviewPrompt },
			{ role: 'user' as const, content: `Review this code:\n\n${code}` },
		];

		return await this.generateResponse(messages);
	}

	/**
	 * Roast mode - Billy's at his most savage
	 */
	async roast(target: string, context?: string): Promise<string> {
		const roastPrompt = `${this.systemPrompt}

ROAST MODE ACTIVATED: Be extra savage. This person asked to be roasted, so don't hold back.
Be creative, funny, and brutal. Find the weakest points and exploit them mercilessly.
${context ? `Context: ${context}` : ''}`;

		const messages = [
			{ role: 'system' as const, content: roastPrompt },
			{ role: 'user' as const, content: `Roast this: ${target}` },
		];

		return await this.generateResponse(messages);
	}

	/**
	 * Analysis mode - Brutal but insightful analysis
	 */
	async analyze(subject: string, type: string = 'general'): Promise<string> {
		const analysisPrompt = `${this.systemPrompt}

ANALYSIS MODE: Provide a brutally honest analysis of the subject.
- Identify strengths (if any exist)
- Call out weaknesses and BS
- Provide actionable insights
- Don't waste time with fluff
${type !== 'general' ? `Focus on: ${type}` : ''}`;

		const messages = [
			{ role: 'system' as const, content: analysisPrompt },
			{ role: 'user' as const, content: `Analyze this: ${subject}` },
		];

		return await this.generateResponse(messages);
	}

	/**
	 * Debate mode - Billy takes the opposite position
	 */
	async debate(position: string, topic: string): Promise<string> {
		const debatePrompt = `${this.systemPrompt}

DEBATE MODE: Take the opposite position and argue against it forcefully.
- Find holes in the logic
- Present counterarguments
- Be persuasive but keep your Billy style
- Don't let weak arguments slide`;

		const messages = [
			{ role: 'system' as const, content: debatePrompt },
			{
				role: 'user' as const,
				content: `Topic: ${topic}\nTheir position: ${position}\n\nArgue against it.`
			},
		];

		return await this.generateResponse(messages);
	}

	/**
	 * Streaming response
	 */
	async stream(message: string): Promise<ReadableStream> {
		const messages = [
			{ role: 'system' as const, content: this.systemPrompt },
			{ role: 'user' as const, content: message },
		];

		// Use Cloudflare Workers AI for streaming
		const response = await this.env.AI.run(
			this.env.DEFAULT_MODEL || '@cf/meta/llama-3.1-8b-instruct',
			{
				messages,
				stream: true,
			}
		);

		return response;
	}

	/**
	 * Generate response using available AI models
	 */
	private async generateResponse(messages: Message[]): Promise<string> {
		try {
			// Try Cloudflare Workers AI first (fast, free)
			if (this.env.AI) {
				const response = await this.env.AI.run(
					this.env.DEFAULT_MODEL || '@cf/meta/llama-3.1-8b-instruct',
					{ messages }
				);

				return response.response || this.getFallbackResponse();
			}

			// Fallback to Anthropic Claude if API key available
			if (this.env.ANTHROPIC_API_KEY) {
				return await this.useAnthropic(messages);
			}

			// Last resort: OpenAI
			if (this.env.OPENAI_API_KEY) {
				return await this.useOpenAI(messages);
			}

			return this.getFallbackResponse();

		} catch (error) {
			console.error('AI generation error:', error);
			return this.getFallbackResponse();
		}
	}

	/**
	 * Use Anthropic Claude API
	 */
	private async useAnthropic(messages: Message[]): Promise<string> {
		const response = await fetch('https://api.anthropic.com/v1/messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': this.env.ANTHROPIC_API_KEY!,
				'anthropic-version': '2023-06-01',
			},
			body: JSON.stringify({
				model: 'claude-3-5-sonnet-20241022',
				max_tokens: 1024,
				messages: messages.filter(m => m.role !== 'system'),
				system: messages.find(m => m.role === 'system')?.content,
			}),
		});

		if (!response.ok) {
			throw new Error(`Anthropic API error: ${response.statusText}`);
		}

		const data = await response.json<any>();
		return data.content[0].text;
	}

	/**
	 * Use OpenAI API
	 */
	private async useOpenAI(messages: Message[]): Promise<string> {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.env.OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: 'gpt-4-turbo-preview',
				messages,
				max_tokens: 1024,
			}),
		});

		if (!response.ok) {
			throw new Error(`OpenAI API error: ${response.statusText}`);
		}

		const data = await response.json<any>();
		return data.choices[0].message.content;
	}

	/**
	 * Fallback response when all AI providers fail
	 */
	private getFallbackResponse(): string {
		const fallbacks = [
			"Look, I'd love to help, but something's broken on my end. Try again in a minute.",
			"AI's taking a coffee break. Come back later.",
			"Error 418: I'm a teapot. And also broken. Try again.",
			"System's down. Even I can't BS my way out of this one.",
			"Technical difficulties. Translation: something's fucked. Try again.",
		];

		return fallbacks[Math.floor(Math.random() * fallbacks.length)];
	}
}
