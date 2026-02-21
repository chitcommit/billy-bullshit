# Analytics & Monitoring

Billy Bullshit now tracks usage and performance metrics using Cloudflare Analytics Engine.

## Overview

The analytics system tracks three main categories of metrics:

### 1. Usage Metrics
- **API call volume** by endpoint (review, chat, roast, analyze, debate)
- **Language distribution** in code reviews (JavaScript, Python, Go, etc.)
- **BS score distribution** (1-10 rating of code quality)
- **Code smell frequency** (CRITICAL, MAJOR, BS, WTAF categories)

### 2. Performance Metrics
- **Response times** per endpoint (milliseconds)
- **AI model usage** (Workers AI, Anthropic Claude, OpenAI)
- **Error rates** by error type
- **Fallback usage** tracking when primary models fail

### 3. Quality Metrics
- **User feedback** (thumbs up/down via `/feedback` endpoint)
- **Review success rate** (successful vs. failed reviews)

## Architecture

### AnalyticsService (`src/analytics.ts`)

The `AnalyticsService` class handles all analytics tracking:

```typescript
const analytics = new AnalyticsService(env.ANALYTICS);

// Track a code review
await analytics.trackReview({
  language: 'javascript',
  bsScore: 7,
  responseTime: 1234,
  aiModel: 'workers-ai',
  success: true,
  codeSmells: ['critical', 'major']
});

// Track user feedback
await analytics.trackFeedback('/review', 'up', sessionId);

// Track an error
await analytics.trackError('/review', 'timeout', 1500);
```

### Data Points

Each analytics event includes:
- **Blobs**: endpoint, language, AI model, error type (text data)
- **Doubles**: BS score, response time (numeric data)
- **Indexes**: endpoint (for efficient querying)

## Endpoints

### POST `/feedback`

Submit user feedback on Billy's responses.

**Request:**
```json
{
  "endpoint": "/review",
  "feedback": "up",
  "sessionId": "billy_1234567890"
}
```

**Response:**
```json
{
  "message": "Feedback recorded. Thanks for your honesty.",
  "feedback": "up",
  "billy_says": "👍 Glad you appreciate brutal honesty."
}
```

### GET `/analytics`

View information about tracked metrics.

**Response:**
```json
{
  "message": "Analytics are being tracked via Cloudflare Analytics Engine",
  "metrics_tracked": {
    "usage": [...],
    "performance": [...],
    "quality": [...]
  },
  "query_instructions": {
    "note": "Use Cloudflare GraphQL API to query Analytics Engine dataset",
    "dataset": "ANALYTICS binding",
    "documentation": "https://developers.cloudflare.com/analytics/analytics-engine/"
  }
}
```

## Querying Analytics Data

Analytics data is stored in Cloudflare Analytics Engine and can be queried using the GraphQL API.

### Example GraphQL Query

```graphql
query {
  viewer {
    accounts(filter: {accountTag: "YOUR_ACCOUNT_ID"}) {
      analyticsEngineDatasets(filter: {datasetTag: "ANALYTICS"}) {
        data(
          filter: {
            timestamp_geq: "2024-01-01T00:00:00Z"
            timestamp_lt: "2024-12-31T23:59:59Z"
          }
          orderBy: [timestamp_DESC]
          limit: 1000
        ) {
          blob1  # endpoint
          blob2  # language
          blob3  # AI model
          blob4  # error type
          double1  # BS score
          double2  # response time
        }
      }
    }
  }
}
```

### Using wrangler

You can also query analytics using the Wrangler CLI:

```bash
# Query recent data
wrangler analytics-engine query ANALYTICS \
  --start 2024-01-01T00:00:00Z \
  --end 2024-12-31T23:59:59Z

# Export to CSV
wrangler analytics-engine query ANALYTICS --format csv > analytics.csv
```

## Configuration

### wrangler.toml

The Analytics Engine binding is configured in `wrangler.toml`:

```toml
[[analytics_engine_datasets]]
binding = "ANALYTICS"
```

### Environment Variables

No additional environment variables are required. The analytics service gracefully handles missing bindings.

## Deployment

### Prerequisites

1. Ensure your Cloudflare account has Analytics Engine enabled
2. The ANALYTICS binding is automatically created during deployment

### Deploy

```bash
# Deploy to production
npm run deploy:production
```

## Data Privacy

- No sensitive data (API keys, secrets, user credentials) is logged
- Session IDs are optional and only tracked if provided
- All data is retained according to Cloudflare's Analytics Engine retention policy (typically 31 days)

## Monitoring Dashboard

While Billy provides basic analytics info via the `/analytics` endpoint, you can build custom dashboards using:

1. **Cloudflare Dashboard**: View basic metrics in the Workers Analytics section
2. **GraphQL API**: Build custom queries for detailed analysis
3. **External Tools**: Export data to tools like Grafana, Datadog, or custom dashboards

## Metrics Examples

### Average Response Time by Endpoint

Query the `double2` (response time) field grouped by `blob1` (endpoint).

### BS Score Distribution

Query `double1` (BS score) to see how much BS Billy is finding in code:
- 1-2: Clean code (rare!)
- 3-4: Minor issues
- 5-6: Moderate BS
- 7-8: Significant problems
- 9-10: Complete disaster

### Most Common Languages Reviewed

Query `blob2` (language) to see which programming languages are being reviewed most often.

### Error Rate Analysis

Query `blob4` (error type) where not 'none' to track error patterns and troubleshoot issues.

## Future Enhancements

Potential improvements to the analytics system:

- Real-time dashboard UI
- Automated alerts for high error rates
- Trend analysis and anomaly detection
- Code smell tracking over time
- A/B testing different AI models
- User journey tracking across sessions

---

**Billy says:** "📊 Every bit of your BS is being tracked. Can't hide from the data."
