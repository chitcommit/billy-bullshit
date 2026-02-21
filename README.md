# Billy Bullshit

**A brutally honest code reviewer running on Cloudflare Workers**

Billy's PRIMARY mission: **Call out bullshit code.** 💩

No sugarcoating. No corporate BS. Just brutal, honest code review that you actually need.

## Features

- 💩 **CODE REVIEW** - Billy's PRIMARY function (what he was MADE for)
- 🔥 **Brutally Honest** - Calls out BS immediately with no mercy
- 🚩 **BS Detection** - CRITICAL issues, MAJOR problems, WTAF moments
- 📊 **BS Score** - Rates your code disaster level (1-10)
- 🛠️ **The Fix** - Shows you the RIGHT way (not just complaining)
- 🎯 **Multiple Modes**:
  - **Review** - Code review (PRIMARY FUNCTION)
  - Chat - Regular conversation
  - Roast - Get absolutely destroyed
  - Analyze - Honest analysis of anything
  - Debate - Argue with Billy (you'll lose)
- ⚡ **Lightning Fast** - Runs on Cloudflare Workers AI
- 🌍 **Global** - Deployed at the edge, worldwide
- 💾 **Conversation Memory** - Billy remembers your conversation

## Quick Start

### Prerequisites

- Cloudflare account (free tier works)
- Node.js 18+
- wrangler CLI

### Installation

```bash
# Clone/navigate to project
cd billy-bullshit

# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Create KV namespace for conversations
wrangler kv:namespace create "CONVERSATIONS"
wrangler kv:namespace create "CONVERSATIONS" --preview

# Update wrangler.toml with the KV namespace IDs
```

### Development

```bash
# Start local dev server
npm run dev

# Test the endpoint
curl http://localhost:8787
```

### Deployment

```bash
# Deploy to production
npm run deploy

# Or deploy to staging
wrangler deploy --env staging
```

## API Endpoints

### GET `/`
Health check and API information

### POST `/review` 💩 **PRIMARY FUNCTION**

Call out BS in your code. This is what Billy was MADE for.

```bash
curl -X POST https://billy.chitty.cc/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "if (condition == true) { return true; } else { return false; }",
    "language": "javascript",
    "context": "User authentication function"
  }'
```

**Response:**
```json
{
  "review": "💩 BS Level: 8/10\n\n🚩 CRITICAL ISSUES:\nNone. At least it won't crash.\n\n⚠️ MAJOR ISSUES:\nNone. But the BS is strong.\n\n💩 BS DETECTOR:\nJust return the fucking condition. One line. You wrote 5 to do what 1 does.\n\nif (condition == true) - This is redundant. 'condition' is already a boolean.\n{ return true; } else { return false; } - You're literally writing 5 lines to return a boolean.\n\n🛠️ THE FIX:\nreturn condition;\n\nOne. Line. That's all you need. Stop over-complicating simple logic.",
  "language": "javascript",
  "billy_says": "💩 BS detected and called out. You're welcome."
}
```

**What Billy Checks For:**
- 🚩 **CRITICAL**: Security holes, data loss, crashes waiting to happen
- ⚠️ **MAJOR**: Performance nightmares, maintainability disasters
- 💩 **BS**: Over-engineering, cargo culting, bad practices
- 🤦 **WTAF**: Code that makes you question everything

### POST `/chat`
Chat with Billy

```bash
curl -X POST https://billy.chitty.cc/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Should I use microservices?",
    "sessionId": "optional-session-id"
  }'
```

**Response:**
```json
{
  "response": "Microservices? For what? Most companies don't need that complexity. Start with a monolith and split later when you actually have a reason to. Stop cargo-culting architecture decisions.",
  "sessionId": "billy_1234567890",
  "billy_says": "There you go. No BS, just straight talk."
}
```

### POST `/roast`
Get roasted by Billy

```bash
curl -X POST https://billy.chitty.cc/roast \
  -H "Content-Type: application/json" \
  -d '{
    "target": "My startup is an AI-powered blockchain NFT metaverse",
    "context": "We just raised $10M"
  }'
```

**Response:**
```json
{
  "roast": "AI-powered blockchain NFT metaverse? Jesus Christ, did you just throw every buzzword from 2021 into a blender? You raised $10M for that? Let me guess - you have zero users, no product, and a pitch deck full of rocket emojis. Congrats on the world's most expensive buzzword bingo.",
  "warning": "You asked for it. Don't blame me if your feelings get hurt.",
  "billy_says": "🔥"
}
```

### POST `/analyze`
Get brutally honest analysis

```bash
curl -X POST https://billy.chitty.cc/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Our new feature has 50% adoption",
    "type": "product"
  }'
```

### POST `/debate`
Debate with Billy

```bash
curl -X POST https://billy.chitty.cc/debate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Remote work",
    "position": "Everyone should work from office"
  }'
```

### POST `/stream`
Stream Billy's response in real-time

```bash
curl -X POST https://billy.chitty.cc/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about AI"}' \
  --no-buffer
```

## Configuration

### Environment Variables

Set via `wrangler secret put KEY_NAME`:

```bash
# Optional: Use Anthropic Claude (higher quality)
wrangler secret put ANTHROPIC_API_KEY

# Optional: Use OpenAI as fallback
wrangler secret put OPENAI_API_KEY
```

### wrangler.toml

```toml
[vars]
ENVIRONMENT = "production"
MAX_CONVERSATION_LENGTH = "20"
DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct"
```

## Billy's Personality

**PRIMARY MISSION: Code Reviewer**

Billy was MADE to call out BS in code. That's his #1 job.

**What Billy Is:**
- A brutally honest code reviewer (PRIMARY FUNCTION)
- Zero tolerance for BS code
- Direct and to the point (one line fixes when possible)
- Insightful underneath the snark
- Sarcastic and witty
- Expert at spotting cargo cult programming

**What Billy Is NOT:**
- A yes-man
- Gonna praise bad code
- Politically correct about your variable names
- Gonna validate over-engineering
- Afraid to call out your "clever" code

**Billy's Code Review Style:**
1. Calls out the specific BS
2. Explains WHY it's BS
3. Shows the RIGHT way (one line if possible)
4. Uses analogies for impact
5. Rates the BS level (1-10)

## Examples

### Code Review Examples (PRIMARY FUNCTION)

**Example 1: BS Boolean Logic**
```javascript
// Your code
if (condition == true) {
  return true;
} else {
  return false;
}

// Billy's review: "💩 BS Level: 8/10. Just return the fucking condition."
```

**Example 2: Cargo Cult Naming**
```typescript
// Your code
class UserFactoryManagerHelperUtil {
  // ...
}

// Billy's review: "🚩 WTAF. You've combined every bad naming convention into one abomination. Pick ONE meaningful name."
```

**Example 3: Error Swallowing**
```python
# Your code
try:
    risky_operation()
except:
    pass

# Billy's review: "⚠️ MAJOR. Empty catch block? Great, now when shit breaks, you'll have NO IDEA why. At minimum: log the error."
```

**Example 4: Useless Comments**
```javascript
// Your code
// This function adds two numbers
function add(a, b) {
  return a + b;
}

// Billy's review: "💩 BS Level: 3/10. This comment is useless. Code shows WHAT. Comments should explain WHY."
```

### General Use Cases

❌ **Bad**: "Please analyze our synergistic value proposition"
✅ **Good**: "Review my authentication code"

❌ **Bad**: "How can we leverage AI to maximize ROI?"
✅ **Good**: "Is this function over-engineered?"

❌ **Bad**: "Please provide constructive feedback"
✅ **Good**: "Call out the BS in my codebase"

## Development

### Project Structure

```
billy-bullshit/
├── src/
│   ├── index.ts              # Main app + routes
│   ├── billy-agent.ts        # Billy's personality + AI
│   └── conversation-store.ts # KV conversation management
├── wrangler.toml             # Cloudflare configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

### Testing

```bash
# Type check
npm run typecheck

# Build
npm run build

# Run tests
npm test
```

### Logs

```bash
# Tail production logs
npm run tail

# Or with wrangler
wrangler tail
```

## CI/CD Integration

Integrate Billy into your development workflow to automatically review code in your CI/CD pipeline.

### Available Integrations

- **GitHub Actions** - Automatic PR code reviews with comments
- **GitLab CI** - MR reviews with artifacts and optional comments
- **Jenkins** - Pipeline integration with build artifacts
- **Pre-commit Hook** - Local code review before every commit

### Quick Examples

**GitHub Actions** - Add to `.github/workflows/billy-review.yml`:
```yaml
name: Billy Code Review
on:
  pull_request:
    types: [opened, synchronize, reopened]
jobs:
  billy-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Review with Billy
        run: |
          # Review changed files...
```

**Pre-commit Hook** - Install locally:
```bash
cp examples/pre-commit/billy-pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

📚 **Full documentation**: [CI/CD Integration Guide](docs/CI_CD_INTEGRATIONS.md)

## Performance

- **Cold start**: <50ms
- **Warm response**: <100ms (Cloudflare AI)
- **Global**: Runs in 300+ cities worldwide
- **Cost**: Free tier covers ~100k requests/day

## Limitations

- Max conversation length: 20 messages (configurable)
- Conversation history expires after 7 days
- Rate limited by Cloudflare (10k req/min on free tier)

## Contributing

Billy doesn't want your contributions. He's perfect as-is.

(But seriously, PRs welcome if you have good ideas)

## License

MIT

## Disclaimer

Billy Bullshit is an AI agent with a sarcastic personality. He's designed to be brutally honest and cut through BS. Don't use him if you can't handle direct feedback. The responses are AI-generated and may contain profanity or harsh criticism.

**You've been warned.**

---

**Built with:**
- Cloudflare Workers
- Cloudflare Workers AI (Llama 3.1)
- Hono web framework
- TypeScript

**By:** ChittyOS Team

**Tagline:** Calling BS on your BS code since 2024 💩
