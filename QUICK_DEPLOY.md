# Billy Bullshit - Quick Deployment Guide

## 🚀 Fast Track to Production

### Prerequisites (5 minutes)
```bash
# 1. Install dependencies
npm install

# 2. Login to Cloudflare
npx wrangler login

# 3. Create KV namespaces
npm run setup:kv
# Copy the IDs and update wrangler.toml
```

### Deploy (2 minutes)
```bash
# Option 1: Automated (recommended)
npm run deploy:prod

# Option 2: Manual
npm run validate           # Check code
npm run deploy:production  # Deploy
```

### Test (1 minute)
```bash
# Test all endpoints
npm run test:deployment

# Or test manually
curl https://billy.chitty.cc
```

## 📋 Complete Checklist

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for the full deployment process.

## 🔑 Optional: Add API Keys (Better AI)

```bash
# Anthropic Claude (recommended)
npx wrangler secret put ANTHROPIC_API_KEY

# OpenAI (fallback)
npx wrangler secret put OPENAI_API_KEY
```

**Note:** Billy works without API keys using Cloudflare Workers AI (free).

## 📊 Monitor

```bash
# View logs
npx wrangler tail --env production

# View in dashboard
# https://dash.cloudflare.com/ → Workers & Pages → billy-bullshit-prod
```

## 🎯 Quick Tests

### Test Code Review (PRIMARY FUNCTION)
```bash
curl -X POST https://billy.chitty.cc/review \
  -H "Content-Type: application/json" \
  -d '{"code":"if(x==true)return true;else return false;"}'
```

### Test Chat
```bash
curl -X POST https://billy.chitty.cc/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What do you do?","sessionId":"test"}'
```

## 🔧 Troubleshooting

### KV Namespace Error
```bash
npm run setup:kv
# Update wrangler.toml with the generated IDs
```

### Authentication Error
```bash
npx wrangler logout
npx wrangler login
```

### Deployment Fails
```bash
# Check logs
npx wrangler tail

# Rollback if needed
npx wrangler rollback
```

## ✅ Success Criteria

- ✅ All endpoints return 200
- ✅ Code review works (BS score visible)
- ✅ Conversation history persists
- ✅ Response time < 100ms
- ✅ Custom domain accessible

## 📚 Additional Resources

- **Full Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Complete Checklist:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **API Documentation:** [README.md](README.md)
- **Cloudflare Docs:** https://developers.cloudflare.com/workers/

---

**Billy says:** "Deploy fast, break nothing. That's how we do it." 🔥
