#!/bin/bash

# Billy Bullshit - Deployment Testing Script
# Tests all endpoints after deployment

set -e

# Default to production URL, but allow override
BASE_URL="${1:-https://billy.chitty.cc}"

echo "🧪 Testing Billy Bullshit deployment at: $BASE_URL"
echo "=================================================="
echo ""

# Test health endpoint
echo "1. Testing health endpoint (GET /)..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL" -w "\nHTTP_CODE:%{http_code}")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Health check passed"
    echo "$HEALTH_RESPONSE" | sed '/HTTP_CODE:/d' | jq -r '.agent, .status' | sed 's/^/   /'
else
    echo "   ❌ Health check failed (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test /health endpoint
echo "2. Testing /health endpoint..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/health" -w "\nHTTP_CODE:%{http_code}")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ /health endpoint passed"
else
    echo "   ❌ /health endpoint failed (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test review endpoint (PRIMARY FUNCTION)
echo "3. Testing /review endpoint (PRIMARY FUNCTION)..."
REVIEW_PAYLOAD='{"code":"if (condition == true) { return true; } else { return false; }","language":"javascript"}'
REVIEW_RESPONSE=$(curl -s -X POST "$BASE_URL/review" \
    -H "Content-Type: application/json" \
    -d "$REVIEW_PAYLOAD" \
    -w "\nHTTP_CODE:%{http_code}")
HTTP_CODE=$(echo "$REVIEW_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ /review endpoint passed"
    echo "$REVIEW_RESPONSE" | sed '/HTTP_CODE:/d' | jq -r '.billy_says' | sed 's/^/   /'
else
    echo "   ❌ /review endpoint failed (HTTP $HTTP_CODE)"
    echo "$REVIEW_RESPONSE" | sed '/HTTP_CODE:/d'
    exit 1
fi
echo ""

# Test chat endpoint
echo "4. Testing /chat endpoint..."
CHAT_PAYLOAD='{"message":"Hello Billy, what do you do?","sessionId":"test_'$(date +%s)'"}'
CHAT_RESPONSE=$(curl -s -X POST "$BASE_URL/chat" \
    -H "Content-Type: application/json" \
    -d "$CHAT_PAYLOAD" \
    -w "\nHTTP_CODE:%{http_code}")
HTTP_CODE=$(echo "$CHAT_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ /chat endpoint passed"
else
    echo "   ❌ /chat endpoint failed (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test roast endpoint
echo "5. Testing /roast endpoint..."
ROAST_PAYLOAD='{"target":"my code that uses var instead of const"}'
ROAST_RESPONSE=$(curl -s -X POST "$BASE_URL/roast" \
    -H "Content-Type: application/json" \
    -d "$ROAST_PAYLOAD" \
    -w "\nHTTP_CODE:%{http_code}")
HTTP_CODE=$(echo "$ROAST_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ /roast endpoint passed"
else
    echo "   ❌ /roast endpoint failed (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test analyze endpoint
echo "6. Testing /analyze endpoint..."
ANALYZE_PAYLOAD='{"subject":"React vs Vue","type":"comparison"}'
ANALYZE_RESPONSE=$(curl -s -X POST "$BASE_URL/analyze" \
    -H "Content-Type: application/json" \
    -d "$ANALYZE_PAYLOAD" \
    -w "\nHTTP_CODE:%{http_code}")
HTTP_CODE=$(echo "$ANALYZE_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ /analyze endpoint passed"
else
    echo "   ❌ /analyze endpoint failed (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test debate endpoint
echo "7. Testing /debate endpoint..."
DEBATE_PAYLOAD='{"position":"tabs are better than spaces","topic":"code formatting"}'
DEBATE_RESPONSE=$(curl -s -X POST "$BASE_URL/debate" \
    -H "Content-Type: application/json" \
    -d "$DEBATE_PAYLOAD" \
    -w "\nHTTP_CODE:%{http_code}")
HTTP_CODE=$(echo "$DEBATE_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ /debate endpoint passed"
else
    echo "   ❌ /debate endpoint failed (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

echo "=================================================="
echo "✅ All endpoint tests passed!"
echo ""
echo "Billy Bullshit is fully operational and ready to call out BS! 💩"
echo ""
