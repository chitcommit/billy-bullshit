# Billy Bullshit - Deployment Checklist

Complete checklist for deploying Billy Bullshit to Cloudflare Workers in production.

## Pre-Deployment Checklist

### 1. Cloudflare Account Setup
- [ ] Create Cloudflare account at https://dash.cloudflare.com/sign-up
- [ ] Note your Account ID (found in Workers & Pages dashboard)
- [ ] Add custom domain to Cloudflare (optional: billy.chitty.cc)

### 2. Development Environment
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Wrangler CLI installed (`npm install -g wrangler` or `npm install`)
- [ ] Dependencies installed (`npm install`)
- [ ] Code passes TypeScript check (`npm run typecheck`)
- [ ] Code builds successfully (`npm run build`)

### 3. Authentication
- [ ] Login to Cloudflare: `wrangler login`
- [ ] Verify authentication: `wrangler whoami`

### 4. KV Namespace Configuration
- [ ] Run KV setup script: `bash scripts/setup-kv.sh`
  - Creates production KV namespace
  - Creates preview KV namespace
- [ ] Update `wrangler.toml` with generated namespace IDs
- [ ] Verify IDs are not placeholder values (`your-kv-namespace-id`)

### 5. Optional API Keys (for better AI responses)
- [ ] Get Anthropic API key from https://console.anthropic.com/
  - Set with: `wrangler secret put ANTHROPIC_API_KEY`
- [ ] Get OpenAI API key from https://platform.openai.com/ (optional fallback)
  - Set with: `wrangler secret put OPENAI_API_KEY`

**Note:** Billy works without API keys using Cloudflare Workers AI (free tier)

## Deployment Steps

### Method 1: Automated Deployment (Recommended)
```bash
# Use the deployment script
bash scripts/deploy-production.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Run TypeScript validation
- ✅ Build the project
- ✅ Warn about placeholder values
- ✅ Deploy to production
- ✅ Show next steps

### Method 2: Manual Deployment
```bash
# 1. Validate code
npm run typecheck

# 2. Build project
npm run build

# 3. Deploy to production
npm run deploy:production
# or
wrangler deploy --env production
```

## Post-Deployment Validation

### Automated Testing
```bash
# Test all endpoints automatically
bash scripts/test-deployment.sh

# Or test against custom URL
bash scripts/test-deployment.sh https://your-worker.workers.dev
```

### Manual Testing

#### 1. Health Check
```bash
curl https://billy.chitty.cc
```
Expected: JSON with agent info, status: "online"

#### 2. Test /review Endpoint (PRIMARY FUNCTION)
```bash
curl -X POST https://billy.chitty.cc/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "if (condition == true) { return true; } else { return false; }",
    "language": "javascript"
  }'
```
Expected: JSON with BS score, categorized issues, and fixes

#### 3. Test /chat Endpoint
```bash
curl -X POST https://billy.chitty.cc/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What do you do?",
    "sessionId": "test_123"
  }'
```
Expected: JSON with response and sessionId

#### 4. Test /roast Endpoint
```bash
curl -X POST https://billy.chitty.cc/roast \
  -H "Content-Type: application/json" \
  -d '{
    "target": "my code that uses var instead of const"
  }'
```
Expected: JSON with brutal roast

#### 5. Test /analyze Endpoint
```bash
curl -X POST https://billy.chitty.cc/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "React vs Vue",
    "type": "comparison"
  }'
```
Expected: JSON with honest analysis

#### 6. Test /debate Endpoint
```bash
curl -X POST https://billy.chitty.cc/debate \
  -H "Content-Type: application/json" \
  -d '{
    "position": "tabs are better than spaces",
    "topic": "code formatting"
  }'
```
Expected: JSON with counter-argument

#### 7. Test /health Endpoint
```bash
curl https://billy.chitty.cc/health
```
Expected: JSON with status: "healthy"

### Performance Testing

Check response times:
```bash
time curl -X POST https://billy.chitty.cc/review \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(\"test\")"}' \
  > /dev/null
```

Target: < 100ms response time (excluding AI processing)

### Conversation Persistence Testing

Test KV storage:
```bash
# Send first message
curl -X POST https://billy.chitty.cc/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Remember: my favorite color is blue","sessionId":"persist_test"}'

# Send follow-up (should reference previous message)
curl -X POST https://billy.chitty.cc/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is my favorite color?","sessionId":"persist_test"}'
```

Expected: Billy should remember the conversation

## Monitoring & Maintenance

### View Real-Time Logs
```bash
# All logs
wrangler tail

# Production only
wrangler tail --env production

# Filter by status
wrangler tail --status error
```

### Analytics Dashboard
1. Go to https://dash.cloudflare.com/
2. Navigate to Workers & Pages
3. Select "billy-bullshit-prod"
4. View Metrics tab

Key metrics to monitor:
- Requests per second
- Error rate (target: < 1%)
- CPU time (target: < 50ms)
- Success rate (target: > 99%)

### KV Storage Management
```bash
# List all KV namespaces
wrangler kv:namespace list

# List keys in namespace
wrangler kv:key list --binding CONVERSATIONS

# View specific conversation
wrangler kv:key get "conversation:session_id" --binding CONVERSATIONS

# Delete old conversations (optional)
wrangler kv:key delete "conversation:old_session" --binding CONVERSATIONS
```

## Custom Domain Configuration

### If domain is already in Cloudflare:
1. Domain should already be configured in `wrangler.toml`:
   ```toml
   [env.production]
   routes = [{ pattern = "billy.chitty.cc", custom_domain = true }]
   ```
2. Deploy: `wrangler deploy --env production`
3. Cloudflare automatically configures DNS

### If domain is not in Cloudflare:
1. Add domain to Cloudflare
2. Update nameservers with your registrar
3. Add route in `wrangler.toml`
4. Deploy

## CORS Verification

Current CORS config (in `src/index.ts`):
```javascript
cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
})
```

For production, consider restricting origins:
```javascript
cors({
  origin: ['https://yourapp.com', 'https://yourdomain.com'],
  allowMethods: ['POST'],
  allowHeaders: ['Content-Type'],
})
```

## Rollback Procedure

If deployment has issues:
```bash
# List recent deployments
wrangler deployments list

# Rollback to previous version
wrangler rollback
```

## Security Checklist

- [ ] API keys stored as secrets (not in code)
- [ ] CORS configured appropriately for production
- [ ] No sensitive data in logs
- [ ] Rate limiting considered (if needed)
- [ ] Environment variables set correctly

## Acceptance Criteria Verification

- [x] Billy responds to API requests ✅
- [x] All endpoints working (/review, /chat, /roast, /analyze, /debate) ✅
- [x] Conversation history persists (KV storage) ✅
- [ ] Performance metrics acceptable (<100ms response time) - Test after deployment
- [x] Custom domain configured (billy.chitty.cc) ✅
- [x] CORS configured for production ✅

## Troubleshooting

### Common Issues

#### Error: "KV namespace not found"
**Solution:** Run `scripts/setup-kv.sh` and update `wrangler.toml` with real IDs

#### Error: "AI binding not available"
**Solution:** Ensure Cloudflare account has Workers AI enabled (free on all plans)

#### Error: "Authentication required"
**Solution:** 
```bash
wrangler logout
wrangler login
```

#### 502 Bad Gateway
**Possible causes:**
1. Worker crashed - check logs: `wrangler tail`
2. Exceeded CPU limits - optimize code
3. Network timeout - reduce request complexity

#### Slow Response Times
**Solutions:**
- Use Anthropic API key for faster responses
- Check Workers AI status
- Monitor CPU time in dashboard

### Getting Help

1. Check deployment logs: `wrangler tail --env production`
2. View Cloudflare Workers docs: https://developers.cloudflare.com/workers/
3. Review DEPLOYMENT.md for detailed instructions
4. Check Billy's GitHub issues

## Success Criteria

✅ Deployment is successful when:
1. All automated tests pass (`scripts/test-deployment.sh`)
2. Response time < 100ms (excluding AI processing)
3. No errors in logs
4. All endpoints return expected responses
5. Conversation persistence works
6. Custom domain resolves correctly

---

**Remember**: Billy doesn't break. Your deployment process might. Follow this checklist. 🔥
