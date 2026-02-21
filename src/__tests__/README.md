# Billy Bullshit Test Suite

Comprehensive test suite for Billy Bullshit, the brutally honest AI code reviewer.

## Overview

This test suite achieves **>94% code coverage** and includes:
- **Unit tests** for core classes
- **Integration tests** for API endpoints
- **Mock implementations** for Cloudflare Workers bindings

## Test Structure

```
src/__tests__/
├── billy-agent.test.ts        # Unit tests for BillyAgent class
├── conversation-store.test.ts # Unit tests for ConversationStore class
├── index.test.ts              # Integration tests for API endpoints
└── test-utils.ts              # Mock implementations and utilities
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- billy-agent.test.ts
```

## Test Coverage

Current coverage: **94.31%**

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| billy-agent.ts | 100% | 91.66% | 100% | 100% |
| conversation-store.ts | 100% | 100% | 100% | 100% |
| index.ts | 88.16% | 88.57% | 100% | 88.16% |

## Test Categories

### Unit Tests

#### BillyAgent (`billy-agent.test.ts`)
- ✅ Constructor and initialization
- ✅ Code review functionality (PRIMARY FUNCTION)
- ✅ Chat interface
- ✅ Roast mode
- ✅ Analysis mode
- ✅ Debate mode
- ✅ Streaming responses
- ✅ AI provider fallback chain (Workers AI → Anthropic → OpenAI → Fallback)
- ✅ Error handling
- ✅ Billy personality consistency

#### ConversationStore (`conversation-store.test.ts`)
- ✅ Get conversation history
- ✅ Add messages to conversation
- ✅ Clear conversation history
- ✅ List all sessions
- ✅ Max history trimming (20 messages)
- ✅ TTL expiration handling
- ✅ Error handling and fault tolerance

### Integration Tests

#### API Endpoints (`index.test.ts`)
- ✅ GET `/` - Service information
- ✅ GET `/health` - Health check
- ✅ POST `/review` - Code review (PRIMARY ENDPOINT)
- ✅ POST `/chat` - Conversation with Billy
- ✅ POST `/roast` - Roast mode
- ✅ POST `/analyze` - Analysis mode
- ✅ POST `/debate` - Debate mode
- ✅ POST `/stream` - Streaming responses
- ✅ 404 handler
- ✅ CORS middleware
- ✅ Global error handling

## Mock Implementations

### MockKVNamespace
Simulates Cloudflare KV storage with:
- In-memory storage
- TTL expiration support
- Prefix-based listing
- JSON serialization/deserialization

### MockAI
Simulates Cloudflare Workers AI with:
- Configurable responses
- Streaming support
- Error simulation

### Test Utilities
- `createMockEnv()` - Create mock Cloudflare Workers environment
- `mockFetch()` - Mock external API calls (Anthropic, OpenAI)

## CI/CD Integration

Tests run automatically on:
- Push to `main`, `develop`, or `copilot/**` branches
- Pull requests to `main` or `develop`

### Coverage Requirements
- Minimum statement coverage: **80%**
- Current coverage: **94.31%** ✅

### GitHub Actions Workflow
- Type checking with TypeScript
- Run full test suite
- Generate coverage reports
- Upload coverage to Codecov
- Verify coverage threshold

## Writing New Tests

### Example: Testing a new BillyAgent method

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { BillyAgent } from '../billy-agent';
import { createMockEnv, MockAI } from './test-utils';

describe('BillyAgent', () => {
  let billy: BillyAgent;
  let mockEnv: any;

  beforeEach(() => {
    mockEnv = createMockEnv();
    billy = new BillyAgent(mockEnv);
  });

  it('should do something', async () => {
    const mockAI = mockEnv.AI as MockAI;
    mockAI.setMockResponse('Expected response');
    
    const result = await billy.someMethod('input');
    expect(result).toBe('Expected response');
  });
});
```

### Example: Testing a new API endpoint

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import app from '../index';
import { createMockEnv } from './test-utils';

describe('API Endpoints', () => {
  let mockEnv: any;

  beforeEach(() => {
    mockEnv = createMockEnv();
  });

  it('should handle new endpoint', async () => {
    const req = new Request('http://localhost/new-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'test' }),
    });
    const res = await app.fetch(req, mockEnv);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toBeDefined();
  });
});
```

## Key Testing Principles

1. **Test Billy's PRIMARY FUNCTION** - Code review is the main feature
2. **Test the fallback chain** - Workers AI → Anthropic → OpenAI → Fallback
3. **Test error handling** - Billy stays in character even when things break
4. **Test personality consistency** - Brutal but fair, no BS
5. **Mock external dependencies** - KV, AI, external APIs
6. **Verify conversation persistence** - KV storage and TTL
7. **Test all error cases** - Missing params, invalid input, API failures

## Continuous Improvement

- Add more edge case tests as bugs are discovered
- Maintain >80% coverage requirement
- Add E2E tests for full workflows (future enhancement)
- Add performance benchmarks (future enhancement)
