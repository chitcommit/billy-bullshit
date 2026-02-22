#!/bin/bash

# Billy Bullshit - Production Deployment Script
# This script performs pre-deployment checks and deploys to production

set -e

echo "🚀 Billy Bullshit - Production Deployment"
echo "========================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI not found"
    echo "   Install it with: npm install -g wrangler"
    exit 1
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo "❌ Error: Not logged in to Cloudflare"
    echo "   Run: wrangler login"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Run TypeScript check
echo "🔍 Running TypeScript type check..."
npm run typecheck
if [ $? -ne 0 ]; then
    echo "❌ TypeScript check failed"
    exit 1
fi
echo "✅ TypeScript check passed"
echo ""

# Build the project
echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Check if KV namespaces are configured
if grep -q "your-kv-namespace-id" wrangler.toml || grep -q "your-preview-kv-namespace-id" wrangler.toml; then
    echo "⚠️  Warning: KV namespace IDs appear to be placeholder values"
    echo "   Run scripts/setup-kv.sh to create and configure KV namespaces"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Deploy to production
echo "🚀 Deploying to production..."
wrangler deploy --env production

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🎉 Billy Bullshit is now live!"
    echo ""
    echo "Next steps:"
    echo "1. Test the deployment: curl https://billy.chitty.cc"
    echo "2. Test code review: curl -X POST https://billy.chitty.cc/review -H 'Content-Type: application/json' -d '{\"code\":\"console.log(true == true)\"}'"
    echo "3. Monitor logs: wrangler tail --env production"
    echo ""
else
    echo "❌ Deployment failed"
    exit 1
fi
