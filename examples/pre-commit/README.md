# Billy Bullshit Pre-commit Hook - Installation Guide

This pre-commit hook reviews your staged code changes using Billy before allowing a commit.

## Quick Install

```bash
# From the root of your repository
cp examples/pre-commit/billy-pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Configuration

Set environment variables to customize behavior:

```bash
# Billy API URL (default: https://billy.chitty.cc)
export BILLY_API_URL="https://billy.chitty.cc"

# Enable/disable Billy review (default: true)
export BILLY_ENABLED="true"

# Block commits with issues (default: false)
export BILLY_FAIL_ON_ISSUES="false"  # Set to 'true' to block commits
```

### Add to your shell profile (~/.bashrc, ~/.zshrc):

```bash
# Billy pre-commit configuration
export BILLY_ENABLED="true"
export BILLY_FAIL_ON_ISSUES="false"
```

## Usage

Once installed, Billy will automatically review your code on every commit:

```bash
# Make changes to your code
git add src/my-file.js

# Commit (Billy review runs automatically)
git commit -m "Add new feature"
```

### Example output:

```
🔍 Running Billy Code Review on staged changes...
Reviewing 1 file(s)...
📄 Reviewing: src/my-file.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💩 Billy's Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 File: src/my-file.js

BS SCORE: 7/10

💩 BS DETECTOR:
Your variable names are confusing...

🛠️ THE FIX:
Use descriptive names...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Issues found but commit proceeding
💩 Powered by Billy Bullshit
```

## Bypass Hook

If you need to commit without Billy's review:

```bash
git commit --no-verify -m "Emergency fix"
```

## Blocking Commits with Issues

To prevent commits when Billy finds issues:

```bash
export BILLY_FAIL_ON_ISSUES="true"
```

Or set it per-commit:

```bash
BILLY_FAIL_ON_ISSUES=true git commit -m "Must be perfect"
```

## Requirements

- `curl` - For API requests
- `jq` (optional but recommended) - For better JSON handling
- `git` - Obviously

Install jq:

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Fedora/RHEL
sudo dnf install jq
```

## Troubleshooting

### Hook not running

```bash
# Ensure it's executable
chmod +x .git/hooks/pre-commit

# Check if it exists
ls -la .git/hooks/pre-commit
```

### Connection issues

```bash
# Test Billy API
curl https://billy.chitty.cc/health

# Check your BILLY_API_URL
echo $BILLY_API_URL
```

### Disable temporarily

```bash
export BILLY_ENABLED="false"
# Or
git commit --no-verify
```

## Supported File Types

The hook reviews these file types:
- JavaScript/TypeScript (.js, .ts, .jsx, .tsx)
- Python (.py)
- Java (.java)
- Go (.go)
- Rust (.rs)
- Ruby (.rb)
- PHP (.php)
- C/C++ (.c, .cpp, .cc, .cxx)
- C# (.cs)

## Team Setup

Add to your project's README or CONTRIBUTING.md:

```markdown
## Code Quality

This project uses Billy Bullshit for pre-commit code review.

Install the pre-commit hook:

\`\`\`bash
cp examples/pre-commit/billy-pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
\`\`\`
```

## Advanced: Git Hooks via Husky

If your project uses Husky for git hooks:

```bash
# Install husky
npm install --save-dev husky

# Enable git hooks
npx husky install

# Add Billy pre-commit hook
npx husky add .husky/pre-commit "bash examples/pre-commit/billy-pre-commit.sh"
```

## Alternative: Pre-push Hook

Want to review before pushing instead of committing?

```bash
cp examples/pre-commit/billy-pre-commit.sh .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

Modify the script to check `HEAD` instead of staged files.

---

**Billy says:** 💩 Stop committing BS code. Install the hook.

_Powered by [Billy Bullshit](https://billy.chitty.cc) - Your brutally honest code reviewer_
