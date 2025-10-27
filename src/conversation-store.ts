/**
 * Conversation Store - Manage chat history in Cloudflare KV
 */

interface Message {
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp: string;
}

export class ConversationStore {
	private kv: KVNamespace;
	private maxHistory: number;

	constructor(kv: KVNamespace, maxHistory: number = 20) {
		this.kv = kv;
		this.maxHistory = maxHistory;
	}

	/**
	 * Get conversation history
	 */
	async getHistory(sessionId: string): Promise<Message[]> {
		try {
			const data = await this.kv.get(`conversation:${sessionId}`, 'json');
			return (data as Message[]) || [];
		} catch (error) {
			console.error('Failed to get history:', error);
			return [];
		}
	}

	/**
	 * Add message to conversation
	 */
	async addMessage(sessionId: string, message: Message): Promise<void> {
		try {
			const history = await this.getHistory(sessionId);

			// Add new message
			history.push(message);

			// Trim to max length
			const trimmed = history.slice(-this.maxHistory);

			// Save back to KV
			await this.kv.put(
				`conversation:${sessionId}`,
				JSON.stringify(trimmed),
				{
					expirationTtl: 86400 * 7, // 7 days
				}
			);
		} catch (error) {
			console.error('Failed to add message:', error);
		}
	}

	/**
	 * Clear conversation history
	 */
	async clearHistory(sessionId: string): Promise<void> {
		try {
			await this.kv.delete(`conversation:${sessionId}`);
		} catch (error) {
			console.error('Failed to clear history:', error);
		}
	}

	/**
	 * Get all session IDs
	 */
	async getAllSessions(): Promise<string[]> {
		try {
			const list = await this.kv.list({ prefix: 'conversation:' });
			return list.keys.map(key => key.name.replace('conversation:', ''));
		} catch (error) {
			console.error('Failed to list sessions:', error);
			return [];
		}
	}
}
