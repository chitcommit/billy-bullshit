#!/usr/bin/env bash

# Billy Bullshit Pre-commit Hook
# This hook reviews your staged code changes before allowing a commit
# Install: Copy to .git/hooks/pre-commit and make executable (chmod +x)

set -e

# Configuration
BILLY_API_URL="${BILLY_API_URL:-https://billy.chitty.cc}"
BILLY_ENABLED="${BILLY_ENABLED:-true}"
BILLY_FAIL_ON_ISSUES="${BILLY_FAIL_ON_ISSUES:-false}"  # Set to 'true' to block commits with issues

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Billy is enabled
if [ "$BILLY_ENABLED" != "true" ]; then
    echo -e "${BLUE}ℹ️  Billy review is disabled (set BILLY_ENABLED=true to enable)${NC}"
    exit 0
fi

echo -e "${BLUE}🔍 Running Billy Code Review on staged changes...${NC}"

# Check required tools
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl not found. Please install curl.${NC}"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq not found. Installing jq is recommended for better formatting.${NC}"
fi

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx|py|java|go|rs|rb|php|cpp|c|cs)$' || true)

if [ -z "$STAGED_FILES" ]; then
    echo -e "${GREEN}✅ No code files staged for commit${NC}"
    exit 0
fi

echo -e "${BLUE}Reviewing $(echo "$STAGED_FILES" | wc -l) file(s)...${NC}"

# Track review results
FOUND_CRITICAL=false
FOUND_ISSUES=false
REVIEW_OUTPUT=""

# Review each staged file
for file in $STAGED_FILES; do
    if [ ! -f "$file" ]; then
        continue
    fi
    
    echo -e "${BLUE}📄 Reviewing: $file${NC}"
    
    # Detect language
    ext="${file##*.}"
    case "$ext" in
        js) lang="javascript" ;;
        ts) lang="typescript" ;;
        jsx) lang="javascript" ;;
        tsx) lang="typescript" ;;
        py) lang="python" ;;
        java) lang="java" ;;
        go) lang="go" ;;
        rs) lang="rust" ;;
        rb) lang="ruby" ;;
        php) lang="php" ;;
        cpp|cc|cxx) lang="cpp" ;;
        c) lang="c" ;;
        cs) lang="csharp" ;;
        *) lang="unknown" ;;
    esac
    
    # Get file content from staging area
    content=$(git show ":$file")
    
    # Create JSON payload
    if command -v jq &> /dev/null; then
        payload=$(jq -n \
            --arg code "$content" \
            --arg language "$lang" \
            --arg context "File: $file (pre-commit)" \
            '{code: $code, language: $language, context: $context}')
    else
        # Fallback without jq (basic JSON escaping)
        content_escaped=$(echo "$content" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | awk '{printf "%s\\n", $0}')
        payload="{\"code\":\"$content_escaped\",\"language\":\"$lang\",\"context\":\"File: $file (pre-commit)\"}"
    fi
    
    # Call Billy's API
    response=$(curl -s -X POST "$BILLY_API_URL/review" \
        -H "Content-Type: application/json" \
        -d "$payload" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ -n "$response" ]; then
        if command -v jq &> /dev/null; then
            review=$(echo "$response" | jq -r '.review // empty')
        else
            # Fallback: extract review field without jq
            review=$(echo "$response" | grep -o '"review":"[^"]*"' | cut -d'"' -f4)
        fi
        
        if [ -n "$review" ]; then
            FOUND_ISSUES=true
            
            # Check for critical issues
            if echo "$review" | grep -q "🚩 CRITICAL"; then
                FOUND_CRITICAL=true
            fi
            
            REVIEW_OUTPUT+="
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 File: $file
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$review

"
        fi
    else
        echo -e "${YELLOW}⚠️  Failed to get review for $file${NC}"
    fi
done

# Display results
if [ "$FOUND_ISSUES" = true ]; then
    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}💩 Billy's Review${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "$REVIEW_OUTPUT"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if [ "$FOUND_CRITICAL" = true ]; then
        echo -e "${RED}🚩 CRITICAL ISSUES FOUND!${NC}"
        echo -e "${RED}Billy found critical issues in your code.${NC}"
        
        if [ "$BILLY_FAIL_ON_ISSUES" = "true" ]; then
            echo -e "${RED}❌ Commit blocked. Fix the issues and try again.${NC}"
            echo -e "${YELLOW}To bypass: git commit --no-verify${NC}"
            exit 1
        fi
    fi
    
    if [ "$BILLY_FAIL_ON_ISSUES" = "true" ]; then
        echo -e "${RED}❌ Commit blocked due to code issues.${NC}"
        echo -e "${YELLOW}To bypass: git commit --no-verify${NC}"
        exit 1
    else
        echo -e "${YELLOW}⚠️  Issues found but commit proceeding (set BILLY_FAIL_ON_ISSUES=true to block)${NC}"
    fi
else
    echo -e "${GREEN}✅ Billy review complete - no issues found!${NC}"
fi

echo -e "${BLUE}💩 Powered by Billy Bullshit - Calling BS on your BS code since 2024${NC}"

exit 0
