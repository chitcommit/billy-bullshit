# Billy Bullshit - Deployment Guide

Complete guide to deploying Billy Bullshit to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**
   - Sign up at https://dash.cloudflare.com/sign-up
   - Free tier is sufficient

2. **Node.js & npm**
   ```bash
   node --version  # Should be 18+
   npm --version
   ```

3. **Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler --version
   ```

## Step-by-Step Deployment

### 1. Install Dependencies

```bash
cd billy-bullshit
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open a browser for authentication.

### 3. Get Your Account ID

```bash
wrangler whoami
```

Copy your Account ID and update `wrangler.toml`:

```toml
account_id = "your-account-id-here"
```

### 4. Create KV Namespaces

```bash
# Production namespace
wrangler kv:namespace create "CONVERSATIONS"

# Preview namespace (for development)
wrangler kv:namespace create "CONVERSATIONS" --preview
```

You'll get IDs like:
```
✨ Success!
Add the following to your wrangler.toml:
{ binding = "CONVERSATIONS", id = "abc123..." }
```

Update `wrangler.toml` with these IDs:

```toml
[[kv_namespaces]]
binding = "CONVERSATIONS"
id = "your-production-id"
preview_id = "your-preview-id"
```

### 5. Set Secrets (Optional)

For better AI responses, add API keys:

```bash
# Anthropic Claude (recommended)
wrangler secret put ANTHROPIC_API_KEY
# Enter your key when prompted

# OpenAI (fallback)
wrangler secret put OPENAI_API_KEY
# Enter your key when prompted
```

**Note**: Without API keys, Billy uses Cloudflare Workers AI (free, but less sophisticated).

### 6. Deploy

```bash
# Development deployment
npm run dev

# Production deployment
npm run deploy

# Or specific environment
wrangler deploy --env production
```

### 7. Test Deployment

```bash
# Get your worker URL from deployment output
curl https://billy-bullshit.your-subdomain.workers.dev

# Should return Billy's API info
```

## Custom Domain (Optional)

### 1. Add Domain to Cloudflare

Add your domain (e.g., `billy.chitty.cc`) to Cloudflare

### 2. Update wrangler.toml

```toml
[env.production]
routes = [
  { pattern = "billy.chitty.cc", custom_domain = true }
]
```

### 3. Deploy

```bash
wrangler deploy --env production
```

Your agent will be available at `https://billy.chitty.cc`

## Environment Configuration

### Development

```toml
[env.development]
name = "billy-bullshit-dev"
vars = { ENVIRONMENT = "development" }
```

```bash
wrangler dev
```

### Staging

```toml
[env.staging]
name = "billy-bullshit-staging"
routes = [{ pattern = "billy-staging.chitty.cc", custom_domain = true }]
```

```bash
wrangler deploy --env staging
```

### Production

```toml
[env.production]
name = "billy-bullshit-prod"
routes = [{ pattern = "billy.chitty.cc", custom_domain = true }]
```

```bash
wrangler deploy --env production
```

## Monitoring

### View Logs

```bash
# Real-time logs
wrangler tail

# Environment-specific
wrangler tail --env production
```

### Analytics

View in Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select "billy-bullshit"
3. Click "Metrics" tab

## Troubleshooting

### KV Namespace Errors

```
Error: KV namespace not found
```

**Solution**: Make sure KV namespace IDs in `wrangler.toml` match your created namespaces:

```bash
wrangler kv:namespace list
```

### AI Binding Errors

```
Error: AI binding not available
```

**Solution**: Ensure your Cloudflare account has Workers AI enabled (free on all plans).

### Deployment Fails

```
Error: Authentication required
```

**Solution**:
```bash
wrangler logout
wrangler login
```

### 502 Bad Gateway

**Possible causes**:
1. Worker crashed - check logs: `wrangler tail`
2. Exceeded CPU limits - optimize code
3. Network timeout - reduce request complexity

## Updating

### Update Code

```bash
# Make changes
git add .
git commit -m "Update Billy"

# Deploy
npm run deploy
```

### Update Dependencies

```bash
npm update
npm run deploy
```

### Rollback

```bash
# List deployments
wrangler deployments list

# Rollback to previous
wrangler rollback
```

## Performance Optimization

### 1. Caching

Billy uses KV for conversation history with 7-day expiration:

```typescript
await kv.put(key, value, {
  expirationTtl: 86400 * 7  // 7 days
});
```

### 2. Model Selection

Faster models = lower latency:

```toml
[vars]
# Llama 3.1 8B (fast, good quality)
DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct"

# Or smaller/faster:
# DEFAULT_MODEL = "@cf/meta/llama-2-7b-chat-int8"
```

### 3. Response Streaming

Use `/stream` endpoint for better UX:

```bash
curl -N -X POST https://billy.chitty.cc/stream \
  -d '{"message":"Tell me about AI"}'
```

## Security

### Rate Limiting

Add rate limiting in worker:

```typescript
// Check rate limit
const key = `rate:${ip}`;
const count = await env.RATE_LIMIT.get(key);
if (count && parseInt(count) > 100) {
  return c.json({ error: 'Rate limited' }, 429);
}
```

### API Key Protection

Store sensitive keys as secrets:

```bash
wrangler secret put MY_SECRET_KEY
```

Never commit secrets to git!

### CORS Configuration

Currently allows all origins. For production, restrict:

```typescript
cors({
  origin: ['https://yourapp.com'],
  allowMethods: ['POST'],
})
```

## Cost Estimation

### Free Tier (Most Users)

- 100,000 requests/day
- 10ms CPU time per request
- 128MB memory
- **Cost: $0**

### Paid Plan

- $5/month for 10M requests
- Additional requests: $0.50 per million
- KV operations included

**Billy runs perfectly on free tier for most use cases.**

## Next Steps

1. ✅ Deploy Billy
2. Test all endpoints
3. Set up custom domain
4. Monitor usage
5. Add to your apps!

## Support

- Docs: This file
- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- Issues: Create an issue if Billy's broken

---

**Remember**: Billy doesn't break. Your code does. 🔥
