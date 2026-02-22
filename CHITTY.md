# Billy Bullshit

> `chittycanon://core/services/billy-bullshit` | Tier 5 (Application) | billy.chitty.cc

## What It Does

Brutally honest AI code reviewer. Calls out BS in your code — cargo cult programming, over-engineering, bad naming, empty catch blocks. Rates BS on a 1-10 scale. Also chats, roasts, analyzes, and debates.

## How It Works

```
billy.chitty.cc ──→ Hono Router
    │
    ├── POST /review  → BillyAgent.reviewCode()  ← PRIMARY FUNCTION
    ├── POST /chat    → BillyAgent.chat()         + ConversationStore
    ├── POST /roast   → BillyAgent.roast()
    ├── POST /analyze → BillyAgent.analyze()
    ├── POST /debate  → BillyAgent.debate()
    ├── POST /stream  → BillyAgent.stream()       → SSE
    ├── GET  /health  → { status: "healthy" }
    └── GET  /        → agent info
```

## Code Review Categories

| Icon | Category | Severity |
|------|----------|----------|
| 🚩 | CRITICAL | Security, data loss, crashes |
| ⚠️ | MAJOR | Performance, maintainability |
| 💩 | BS | Over-engineering, cargo culting |
| 🤦 | WTAF | Code that makes you question humanity |

## AI Provider Fallback Chain

Workers AI → Anthropic Claude → OpenAI → hardcoded fallback responses

## Bindings

| Binding | Type | Purpose |
|---------|------|---------|
| AI | Workers AI | Primary AI inference |
| CONVERSATIONS | KV | Session history (7-day TTL) |
