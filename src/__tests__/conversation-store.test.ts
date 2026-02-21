/**
 * Tests for ConversationStore class
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ConversationStore } from '../conversation-store';
import { MockKVNamespace } from './test-utils';

describe('ConversationStore', () => {
  let kv: MockKVNamespace;
  let store: ConversationStore;

  beforeEach(() => {
    kv = new MockKVNamespace();
    store = new ConversationStore(kv, 20);
  });

  describe('getHistory', () => {
    it('should return empty array for non-existent session', async () => {
      const history = await store.getHistory('non-existent');
      expect(history).toEqual([]);
    });

    it('should return stored conversation history', async () => {
      const sessionId = 'test-session';
      const messages = [
        { role: 'user' as const, content: 'Hello', timestamp: '2024-01-01T00:00:00Z' },
        { role: 'assistant' as const, content: 'Hi', timestamp: '2024-01-01T00:00:01Z' },
      ];

      await kv.put(`conversation:${sessionId}`, JSON.stringify(messages));
      const history = await store.getHistory(sessionId);
      expect(history).toEqual(messages);
    });

    it('should handle KV errors gracefully', async () => {
      const errorKV = {
        get: async () => {
          throw new Error('KV error');
        },
      } as any;

      const errorStore = new ConversationStore(errorKV);
      const history = await errorStore.getHistory('test');
      expect(history).toEqual([]);
    });
  });

  describe('addMessage', () => {
    it('should add message to conversation', async () => {
      const sessionId = 'test-session';
      const message = {
        role: 'user' as const,
        content: 'Test message',
        timestamp: '2024-01-01T00:00:00Z',
      };

      await store.addMessage(sessionId, message);
      const history = await store.getHistory(sessionId);
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(message);
    });

    it('should append message to existing history', async () => {
      const sessionId = 'test-session';
      const message1 = {
        role: 'user' as const,
        content: 'First message',
        timestamp: '2024-01-01T00:00:00Z',
      };
      const message2 = {
        role: 'assistant' as const,
        content: 'Second message',
        timestamp: '2024-01-01T00:00:01Z',
      };

      await store.addMessage(sessionId, message1);
      await store.addMessage(sessionId, message2);

      const history = await store.getHistory(sessionId);
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual(message1);
      expect(history[1]).toEqual(message2);
    });

    it('should trim history to max length', async () => {
      const shortStore = new ConversationStore(kv, 3);
      const sessionId = 'test-session';

      // Add 5 messages
      for (let i = 0; i < 5; i++) {
        await shortStore.addMessage(sessionId, {
          role: 'user' as const,
          content: `Message ${i}`,
          timestamp: `2024-01-01T00:00:0${i}Z`,
        });
      }

      const history = await shortStore.getHistory(sessionId);
      expect(history).toHaveLength(3);
      expect(history[0].content).toBe('Message 2');
      expect(history[2].content).toBe('Message 4');
    });

    it('should handle KV errors gracefully', async () => {
      const errorKV = {
        get: async () => [],
        put: async () => {
          throw new Error('KV error');
        },
      } as any;

      const errorStore = new ConversationStore(errorKV);
      await expect(
        errorStore.addMessage('test', {
          role: 'user' as const,
          content: 'Test',
          timestamp: '2024-01-01T00:00:00Z',
        })
      ).resolves.not.toThrow();
    });
  });

  describe('clearHistory', () => {
    it('should delete conversation history', async () => {
      const sessionId = 'test-session';
      await store.addMessage(sessionId, {
        role: 'user' as const,
        content: 'Test message',
        timestamp: '2024-01-01T00:00:00Z',
      });

      await store.clearHistory(sessionId);
      const history = await store.getHistory(sessionId);
      expect(history).toEqual([]);
    });

    it('should handle non-existent session', async () => {
      await expect(store.clearHistory('non-existent')).resolves.not.toThrow();
    });

    it('should handle KV errors gracefully', async () => {
      const errorKV = {
        delete: async () => {
          throw new Error('KV error');
        },
      } as any;

      const errorStore = new ConversationStore(errorKV);
      await expect(errorStore.clearHistory('test')).resolves.not.toThrow();
    });
  });

  describe('getAllSessions', () => {
    it('should return empty array when no sessions exist', async () => {
      const sessions = await store.getAllSessions();
      expect(sessions).toEqual([]);
    });

    it('should return all session IDs', async () => {
      await store.addMessage('session1', {
        role: 'user' as const,
        content: 'Message 1',
        timestamp: '2024-01-01T00:00:00Z',
      });
      await store.addMessage('session2', {
        role: 'user' as const,
        content: 'Message 2',
        timestamp: '2024-01-01T00:00:01Z',
      });

      const sessions = await store.getAllSessions();
      expect(sessions).toHaveLength(2);
      expect(sessions).toContain('session1');
      expect(sessions).toContain('session2');
    });

    it('should only return conversation keys', async () => {
      await kv.put('conversation:session1', '[]');
      await kv.put('other-key', 'value');

      const sessions = await store.getAllSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0]).toBe('session1');
    });

    it('should handle KV errors gracefully', async () => {
      const errorKV = {
        list: async () => {
          throw new Error('KV error');
        },
      } as any;

      const errorStore = new ConversationStore(errorKV);
      const sessions = await errorStore.getAllSessions();
      expect(sessions).toEqual([]);
    });
  });
});
