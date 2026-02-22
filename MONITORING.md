# Billy Bullshit - Post-Deployment Monitoring Guide

## Overview

After deploying Billy Bullshit, it's important to monitor performance, errors, and usage to ensure optimal operation.

## Real-Time Monitoring

### View Live Logs

**All logs:**
```bash
wrangler tail
```

**Production only:**
```bash
wrangler tail --env production
```

**Filter by status:**
```bash
# Only errors
wrangler tail --status error

# Only successful requests
wrangler tail --status ok

# Specific status code
wrangler tail --status-code 500
```

**Sample output:**
```
GET https://billy.chitty.cc/health - Ok @ 2024-01-15 10:30:45
POST https://billy.chitty.cc/review - Ok @ 2024-01-15 10:30:50
POST https://billy.chitty.cc/chat - Ok @ 2024-01-15 10:30:55
```

### Search Logs

```bash
# Search for specific text
wrangler tail | grep "error"
wrangler tail | grep "REVIEW"
wrangler tail | grep "session_id"
```

## Cloudflare Dashboard

### Access the Dashboard

1. Go to https://dash.cloudflare.com/
2. Navigate to **Workers & Pages**
3. Select **billy-bullshit-prod**
4. Click **Metrics** tab

### Key Metrics

**Requests:**
- Total requests
- Requests per second
- Success rate (target: > 99%)

**Performance:**
- CPU time (target: < 50ms)
- Duration (target: < 100ms excluding AI)
- Wall time

**Errors:**
- Error rate (target: < 1%)
- Error types (4xx vs 5xx)
- Error trends

**Geographic Distribution:**
- Requests by region
- Edge response times

### Set Up Alerts

1. Go to **Notifications** in Cloudflare Dashboard
2. Click **Add**
3. Select notification type:

**Recommended Alerts:**

**High Error Rate:**
- Trigger: Error rate > 5% for 5 minutes
- Action: Email notification
- Configuration:
  ```
  Service: Workers
  Worker: billy-bullshit-prod
  Metric: Error rate
  Threshold: > 5%
  Duration: 5 minutes
  ```

**High Request Rate (potential abuse):**
- Trigger: Requests > 1000/min
- Action: Email notification
- Configuration:
  ```
  Service: Workers
  Worker: billy-bullshit-prod
  Metric: Requests per minute
  Threshold: > 1000
  ```

**Deployment Failure:**
- Trigger: Deployment fails
- Action: Email notification

## Performance Monitoring

### Response Time Testing

**Endpoint performance:**
```bash
# Test review endpoint
time curl -X POST https://billy.chitty.cc/review \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(123)"}'
```

**Automated performance test script:**
```bash
#!/bin/bash
# Save as scripts/perf-test.sh

URL="https://billy.chitty.cc"
ITERATIONS=10

echo "Running performance tests..."
echo ""

total=0
for i in $(seq 1 $ITERATIONS); do
  start=$(date +%s%3N)
  curl -s -X POST "$URL/review" \
    -H "Content-Type: application/json" \
    -d '{"code":"console.log(123)"}' > /dev/null
  end=$(date +%s%3N)
  duration=$((end - start))
  total=$((total + duration))
  echo "Request $i: ${duration}ms"
done

avg=$((total / ITERATIONS))
echo ""
echo "Average response time: ${avg}ms"
echo "Target: < 100ms (excluding AI processing)"
```

**Run performance tests:**
```bash
bash scripts/perf-test.sh
```

### CPU Time Monitoring

**Check current CPU usage:**
```bash
# View recent CPU times in logs
wrangler tail | grep "CPU"
```

**Optimize if needed:**
- Reduce unnecessary computations
- Cache repeated operations
- Optimize LLM prompt sizes
- Use faster AI models

## KV Storage Monitoring

### List All Sessions

```bash
# List all conversation keys
wrangler kv:key list --binding CONVERSATIONS --env production
```

### View Specific Conversation

```bash
# Get conversation by session ID
wrangler kv:key get "conversation:session_id" \
  --binding CONVERSATIONS \
  --env production
```

### Check Storage Usage

```bash
# Count number of conversations
wrangler kv:key list --binding CONVERSATIONS --env production | grep -c "conversation:"
```

### Clean Up (if needed)

```bash
# Delete specific conversation
wrangler kv:key delete "conversation:old_session" \
  --binding CONVERSATIONS \
  --env production

# Bulk delete (careful!)
# Not recommended - KV auto-expires after 7 days
```

## Error Tracking

### Common Errors

**400 Bad Request:**
- Missing required fields
- Invalid JSON payload
- Check request format

**500 Internal Server Error:**
- AI provider failure
- KV namespace error
- Code bug

**502 Bad Gateway:**
- Worker crashed
- CPU time exceeded
- Timeout

### Error Investigation

**View error details:**
```bash
# Show only errors
wrangler tail --status error --env production

# Show errors with full stack trace
wrangler tail --format json | jq 'select(.outcome == "exception")'
```

**Common error patterns:**
```bash
# AI provider errors
wrangler tail | grep "AI binding"

# KV errors
wrangler tail | grep "KV"

# Timeout errors
wrangler tail | grep "timeout"
```

## Usage Analytics

### Daily Report Script

```bash
#!/bin/bash
# Save as scripts/daily-report.sh

echo "Billy Bullshit - Daily Report"
echo "=============================="
echo ""

# Get deployment info
echo "Current deployment:"
wrangler deployments list --env production | head -5
echo ""

# Check for recent errors
echo "Recent errors (last 100 logs):"
ERROR_COUNT=$(wrangler tail --env production --limit 100 2>&1 | grep -c "Error")
echo "Error count: $ERROR_COUNT"
echo ""

# KV usage
echo "Conversation storage:"
CONVERSATION_COUNT=$(wrangler kv:key list --binding CONVERSATIONS --env production 2>&1 | grep -c "conversation:")
echo "Active conversations: $CONVERSATION_COUNT"
echo ""

echo "Review full metrics at:"
echo "https://dash.cloudflare.com/"
```

**Run daily:**
```bash
bash scripts/daily-report.sh
```

**Automate with cron:**
```bash
# Run every day at 9 AM
0 9 * * * cd /path/to/billy-bullshit && bash scripts/daily-report.sh | mail -s "Billy Daily Report" you@email.com
```

## Cost Monitoring

### Check Current Usage

```bash
# View billing info
wrangler billing show

# Check if approaching limits
wrangler billing show | grep "Current usage"
```

### Free Tier Limits

- **Requests:** 100,000/day
- **CPU time:** 10ms/request
- **Duration:** 50ms/request
- **KV reads:** 100,000/day
- **KV writes:** 1,000/day

**Monitor usage:**
1. Cloudflare Dashboard → Account Home → Workers & Pages
2. View current usage bars
3. Set budget alerts if on paid plan

## Health Checks

### Automated Health Check

```bash
#!/bin/bash
# Save as scripts/health-check.sh

URL="https://billy.chitty.cc"

echo "Checking Billy Bullshit health..."

# Check main endpoint
RESPONSE=$(curl -s -w "%{http_code}" "$URL" -o /dev/null)
if [ "$RESPONSE" = "200" ]; then
  echo "✅ Main endpoint: OK"
else
  echo "❌ Main endpoint: FAILED (HTTP $RESPONSE)"
  exit 1
fi

# Check /health endpoint
RESPONSE=$(curl -s -w "%{http_code}" "$URL/health" -o /dev/null)
if [ "$RESPONSE" = "200" ]; then
  echo "✅ /health endpoint: OK"
else
  echo "❌ /health endpoint: FAILED (HTTP $RESPONSE)"
  exit 1
fi

# Quick review test
RESPONSE=$(curl -s -X POST "$URL/review" \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(1)"}' \
  -w "%{http_code}" -o /dev/null)
if [ "$RESPONSE" = "200" ]; then
  echo "✅ /review endpoint: OK"
else
  echo "❌ /review endpoint: FAILED (HTTP $RESPONSE)"
  exit 1
fi

echo ""
echo "All systems operational! 🎉"
```

**Run periodically:**
```bash
# Every 5 minutes
*/5 * * * * bash /path/to/scripts/health-check.sh
```

### External Monitoring (Recommended)

Use external uptime monitoring services:

**Options:**
1. **UptimeRobot** (free) - https://uptimerobot.com/
   - Monitor every 5 minutes
   - Alert on downtime
   - Track response times

2. **Pingdom** - https://www.pingdom.com/
   - Detailed performance reports
   - Multiple monitoring locations

3. **StatusCake** - https://www.statuscake.com/
   - Free tier available
   - API monitoring

**Setup:**
1. Create account
2. Add monitor for `https://billy.chitty.cc`
3. Set alert email/SMS
4. Configure check interval (5 minutes)

## Incident Response

### When Errors Spike

**1. Check logs:**
```bash
wrangler tail --status error --env production
```

**2. Identify pattern:**
- Specific endpoint failing?
- Specific error message?
- All requests or subset?

**3. Quick fixes:**
```bash
# Rollback to previous deployment
wrangler rollback

# Or force redeploy
npm run deploy:prod
```

**4. Long-term fix:**
- Investigate root cause
- Fix code
- Test locally
- Deploy with monitoring

### When Performance Degrades

**1. Check CPU time:**
```bash
wrangler tail | grep -i "cpu"
```

**2. Optimize:**
- Reduce prompt sizes
- Use faster AI models
- Minimize KV operations

**3. Scale:**
- Cloudflare Workers auto-scale
- Check if hitting rate limits
- Consider paid plan for higher limits

## Regular Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor response times
- [ ] Review usage stats

### Weekly
- [ ] Run full endpoint tests
- [ ] Check KV storage usage
- [ ] Review performance trends

### Monthly
- [ ] Update dependencies (`npm update`)
- [ ] Security audit (`npm audit`)
- [ ] Review and rotate API keys
- [ ] Check Cloudflare announcements
- [ ] Review cost/usage trends

### Quarterly
- [ ] Full security review
- [ ] Dependency major updates
- [ ] Performance optimization
- [ ] Feature improvements
- [ ] Documentation updates

## Monitoring Dashboard

### Custom Dashboard (Optional)

Create a monitoring dashboard using:
- **Grafana** + Cloudflare Logpush
- **Datadog** with Cloudflare integration
- **Custom solution** with Workers Analytics API

**Basic setup:**
1. Enable Logpush in Cloudflare
2. Send logs to S3/GCS/BigQuery
3. Query and visualize with tool of choice

## Summary

**Essential Monitoring:**
1. ✅ Real-time logs (`wrangler tail`)
2. ✅ Cloudflare Dashboard metrics
3. ✅ Health check script (daily)
4. ✅ Error rate alerts

**Recommended:**
1. External uptime monitoring
2. Performance testing (weekly)
3. KV storage checks
4. Automated daily reports

**Advanced:**
1. Custom monitoring dashboard
2. Log aggregation and analysis
3. Automated incident response
4. Performance optimization tracking

---

**Billy says:** "Monitor your shit. Don't wait for users to tell you it's broken." 📊
