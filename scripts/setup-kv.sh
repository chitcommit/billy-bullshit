#!/bin/bash

# Billy Bullshit - KV Namespace Setup Script
# This script creates the necessary KV namespaces for deployment

set -e

echo "🔧 Setting up Cloudflare KV namespaces for Billy Bullshit..."
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

echo "✅ Wrangler is installed and authenticated"
echo ""

# Create production KV namespace
echo "📦 Creating production KV namespace..."
PROD_OUTPUT=$(wrangler kv:namespace create "CONVERSATIONS" 2>&1)
echo "$PROD_OUTPUT"
PROD_ID=$(echo "$PROD_OUTPUT" | grep -oP 'id = "\K[^"]+' | head -1)

echo ""

# Create preview KV namespace
echo "📦 Creating preview KV namespace..."
PREVIEW_OUTPUT=$(wrangler kv:namespace create "CONVERSATIONS" --preview 2>&1)
echo "$PREVIEW_OUTPUT"
PREVIEW_ID=$(echo "$PREVIEW_OUTPUT" | grep -oP 'preview_id = "\K[^"]+' | head -1)

echo ""
echo "✅ KV namespaces created successfully!"
echo ""
echo "📝 Update your wrangler.toml with these IDs:"
echo ""
echo "[[kv_namespaces]]"
echo "binding = \"CONVERSATIONS\""
echo "id = \"$PROD_ID\""
echo "preview_id = \"$PREVIEW_ID\""
echo ""
echo "Or run the following command to update automatically:"
echo ""
echo "sed -i 's/id = \"your-kv-namespace-id\"/id = \"$PROD_ID\"/' wrangler.toml"
echo "sed -i 's/preview_id = \"your-preview-kv-namespace-id\"/preview_id = \"$PREVIEW_ID\"/' wrangler.toml"
echo ""
