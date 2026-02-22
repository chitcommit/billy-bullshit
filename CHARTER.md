# Billy Bullshit Charter

## Classification
- **Canonical URI**: `chittycanon://core/services/billy-bullshit`
- **Tier**: 5 (Application)
- **Organization**: chitcommit
- **Domain**: billy.chitty.cc

## Mission

Billy Bullshit is a brutally honest AI code reviewer deployed as a Cloudflare Worker. His primary function is calling out BS in code — cargo cult programming, over-engineering, bad naming, empty catch blocks, and every other anti-pattern. He also chats, roasts, analyzes, and debates.

## Scope

### IS Responsible For
- AI-powered code review with BS scoring (1-10)
- Code smell detection (critical, major, BS, WTAF categories)
- Chat conversations with Billy's personality
- Roast mode for savage feedback
- Analysis mode for brutally honest assessments
- Debate mode (Billy takes the opposite position)
- Streaming responses via SSE
- Conversation history management (KV-backed)

### IS NOT Responsible For
- Automated code fixes (Billy tells you what's wrong, you fix it)
- CI/CD integration (standalone API)
- Identity or authentication (no ChittyAuth integration yet)

## Architecture

### Entry Point
`src/index.ts` — Hono app with 7 endpoints

### Key Components
| Component | Path | Purpose |
|-----------|------|---------|
| Hono App | `src/index.ts` | Route handling, CORS, error handling |
| BillyAgent | `src/billy-agent.ts` | AI personality, prompt engineering, multi-provider fallback |
| ConversationStore | `src/conversation-store.ts` | KV-backed session history (7-day TTL, 20 msg max) |

### AI Provider Fallback
1. Cloudflare Workers AI (primary — fast, free)
2. Anthropic Claude API (if ANTHROPIC_API_KEY set)
3. OpenAI API (if OPENAI_API_KEY set)
4. Hardcoded fallback responses (last resort)

## Dependencies

| Type | Service | Purpose |
|------|---------|---------|
| External | Cloudflare Workers AI | Primary AI inference |
| External | Anthropic API | Fallback AI provider |
| External | OpenAI API | Last-resort AI provider |
| Storage | KV (CONVERSATIONS) | Session history |

## API Contract

**Base URL**: https://billy.chitty.cc

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Agent info and endpoint list |
| `/health` | GET | Health check |
| `/review` | POST | Code review (primary function) |
| `/chat` | POST | Conversation with Billy |
| `/roast` | POST | Roast mode |
| `/analyze` | POST | Analysis mode |
| `/debate` | POST | Debate mode |
| `/stream` | POST | Streaming responses (SSE) |

## Ownership

| Role | Owner |
|------|-------|
| Service Owner | chitcommit |

## Compliance

- [ ] Registered in ChittyRegister
- [ ] Health endpoint operational at /health
- [ ] CLAUDE.md present
- [ ] CHARTER.md present
- [ ] CHITTY.md present
- [ ] Tests passing (15 vitest tests)
- [ ] KV namespace provisioned

---
*Charter Version: 1.0.0 | Last Updated: 2026-02-21*
