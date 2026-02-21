# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Billy Bullshit is a brutally honest AI code reviewer running on Cloudflare Workers. It wraps LLMs (Workers AI, Anthropic, OpenAI) with a harsh but insightful code review persona, exposed as a REST API via the Hono framework.

**Runtime:** Cloudflare Workers
**Framework:** Hono v3
**Language:** TypeScript (ESM)
**State:** KV Namespace (conversation history, 7-day TTL)
**AI:** Workers AI (primary) → Anthropic Claude (fallback) → OpenAI (last resort)

## Commands

```bash
npm run dev              # wrangler dev (local)
npm run deploy           # wrangler deploy
npm run deploy:production # wrangler deploy --env production
npm run typecheck        # tsc --noEmit
npm run build            # esbuild bundle
npm test                 # vitest
```

## Architecture

```
src/
├── index.ts               # Hono app — routes, middleware, error handling
├── billy-agent.ts         # BillyAgent class — persona, LLM calls, review logic
└── conversation-store.ts  # ConversationStore — KV-backed session history
```

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Service info and endpoint list |
| GET | `/health` | Health check |
| POST | `/review` | **PRIMARY** — Code review with BS scoring |
| POST | `/chat` | Conversation with Billy |
| POST | `/roast` | Savage roast mode |
| POST | `/analyze` | Brutal analysis of any subject |
| POST | `/debate` | Billy argues the opposite position |
| POST | `/stream` | SSE streaming responses |

### AI Model Fallback Chain

1. **Cloudflare Workers AI** (`@cf/meta/llama-3.1-8b-instruct`) — fast, free
2. **Anthropic Claude** — requires `ANTHROPIC_API_KEY` secret
3. **OpenAI** — requires `OPENAI_API_KEY` secret
4. **Hardcoded fallback** — random error quip

### Key Classes

**`BillyAgent`** (`billy-agent.ts`)
- `reviewCode(code, language?, context?)` — Primary function. Returns BS score (1-10), categorized issues (CRITICAL/MAJOR/BS/WTAF), and fixes.
- `chat(message, history)` — General conversation with persona
- `roast(target, context?)` — Maximum savagery mode
- `analyze(subject, type?)` — Honest analysis
- `debate(position, topic)` — Takes opposite position
- `stream(message)` — Workers AI streaming response
- `generateResponse(messages)` — Multi-provider fallback chain

**`ConversationStore`** (`conversation-store.ts`)
- KV-backed with `conversation:{sessionId}` key pattern
- 20 message cap, 7-day TTL auto-expiry
- `getHistory()`, `addMessage()`, `clearHistory()`, `getAllSessions()`

## Bindings

| Binding | Type | Purpose |
|---------|------|---------|
| `AI` | Workers AI | Primary LLM provider |
| `CONVERSATIONS` | KV Namespace | Session history storage |

## Secrets

Set via `wrangler secret put`:
- `ANTHROPIC_API_KEY` — Anthropic Claude API key (optional fallback)
- `OPENAI_API_KEY` — OpenAI API key (optional fallback)

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `ENVIRONMENT` | `development` | Runtime environment |
| `MAX_CONVERSATION_LENGTH` | `20` | Max messages per session |
| `DEFAULT_MODEL` | `@cf/meta/llama-3.1-8b-instruct` | Workers AI model |

## Coding Standards

- **TypeScript** with ESM (`type: "module"`)
- **Hono** for routing and middleware
- **2-space indentation**
- No external test frameworks beyond vitest
- Cloudflare Workers types for env bindings

## Deployment

Target domain: `billy.chitty.cc` (configured in `wrangler.toml` production env)

```bash
# Create KV namespace first
wrangler kv:namespace create "CONVERSATIONS"
wrangler kv:namespace create "CONVERSATIONS" --preview

# Set secrets
wrangler secret put ANTHROPIC_API_KEY

# Deploy
npm run deploy:production
```

## Known Issues

- KV namespace IDs in `wrangler.toml` are placeholders — must be created and filled in before deploy
- No authentication on endpoints — any caller can use the API
- No rate limiting
- Dependencies are stale (hono v3, anthropic SDK v0.18)
