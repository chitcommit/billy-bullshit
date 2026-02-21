# CI/CD Integration Guide for Billy Bullshit

Billy Bullshit can be integrated into your CI/CD pipeline to automatically review code changes. This guide covers integration with popular CI/CD platforms.

## Table of Contents

1. [GitHub Actions](#github-actions)
2. [GitLab CI](#gitlab-ci)
3. [Jenkins](#jenkins)
4. [Pre-commit Hook](#pre-commit-hook)
5. [General Integration Guide](#general-integration-guide)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## GitHub Actions

Billy integrates seamlessly with GitHub Actions to provide automated code reviews on pull requests.

### Quick Setup

1. Copy the workflow file to your repository:
   ```bash
   mkdir -p .github/workflows
   cp .github/workflows/billy-review.yml your-repo/.github/workflows/
   ```

2. Configure secrets (optional):
   - `BILLY_API_URL` - Custom Billy API endpoint (defaults to https://billy.chitty.cc)

3. Create a pull request and watch Billy work!

### Workflow Features

- ✅ Automatically triggered on PR creation and updates
- ✅ Reviews all changed code files (JS, TS, Python, Java, Go, etc.)
- ✅ Posts review comments directly on PRs
- ✅ Language detection from file extensions
- ✅ Respects `.gitignore` patterns

### Example Output

When Billy reviews your PR, you'll see a comment like:

```markdown
## 💩 Billy's Code Review

> Calling BS on your BS code since 2024

### 📄 `src/auth.js`

```
BS SCORE: 8/10

🚩 CRITICAL ISSUES:
Your password validation is a joke...

💩 BS DETECTOR:
This function is 200 lines long...

🛠️ THE FIX:
Split it into smaller functions...
\`\`\`

---

**Billy says:** 💩 BS detected and called out. You're welcome.
```

### Customization

Edit `.github/workflows/billy-review.yml` to:

- **Change file types**: Modify the `paths` filter
  ```yaml
  paths:
    - '**.js'
    - '**.py'
    # Add more patterns
  ```

- **Use custom Billy instance**: Set `BILLY_API_URL` secret
  ```bash
  gh secret set BILLY_API_URL --body "https://your-billy.example.com"
  ```

- **Run on specific branches**: Modify the trigger
  ```yaml
  on:
    pull_request:
      branches:
        - main
        - develop
  ```

### Files

- **Workflow**: `.github/workflows/billy-review.yml`
- **Documentation**: This file

---

## GitLab CI

Integrate Billy into GitLab merge request pipelines.

### Quick Setup

1. Copy the example configuration:
   ```bash
   cp examples/gitlab-ci.yml .gitlab-ci.yml
   # Or append to existing .gitlab-ci.yml
   ```

2. Configure CI/CD variables (optional):
   - `BILLY_API_URL` - Custom Billy API endpoint
   - `GITLAB_TOKEN` - GitLab token for posting MR comments (requires `api` scope)

3. Create a merge request!

### Pipeline Features

- ✅ Runs on merge requests only
- ✅ Reviews changed files (MR diff)
- ✅ Saves review as pipeline artifact
- ✅ Optional: Posts comments to MR (requires token)
- ✅ Manual full codebase review job

### Jobs

**`billy-code-review`** (Automatic)
- Triggered on every MR
- Reviews only changed files
- Fast and focused

**`billy-full-review`** (Manual)
- Manual trigger or scheduled
- Reviews entire codebase
- Good for periodic audits

### MR Comment Integration

To enable automatic MR comments:

1. Create a project access token with `api` scope:
   - Settings → Access Tokens → Add new token
   - Scopes: `api`

2. Add to CI/CD variables:
   ```bash
   Settings → CI/CD → Variables → Add Variable
   Key: GITLAB_TOKEN
   Value: glpat-xxxxxxxxxxxx
   Protected: ✓
   Masked: ✓
   ```

### Example Pipeline Output

```
🔍 Running Billy Code Review...
Reviewing: src/utils.js
---
BS SCORE: 6/10
💩 BS DETECTOR: This utility is over-engineered...
---
✅ Billy review complete - check artifacts for full report
```

### Files

- **Example**: `examples/gitlab-ci.yml`
- **Documentation**: This file

---

## Jenkins

Integrate Billy into Jenkins pipelines using a Groovy script.

### Quick Setup

1. Copy the Jenkinsfile to your repository:
   ```bash
   cp examples/jenkins/Jenkinsfile Jenkinsfile
   # Or integrate into existing Jenkinsfile
   ```

2. Configure Jenkins:
   - Set environment variable `BILLY_API_URL` (optional)
   - Ensure `jq` is installed on Jenkins nodes

3. Create a pull request!

### Pipeline Features

- ✅ Runs on pull requests (changeRequest)
- ✅ Reviews changed files only
- ✅ Archives review as build artifact
- ✅ Can post to PR comments (with plugin)
- ✅ Parallel execution support

### Environment Variables

Set in Jenkins configuration:

- `BILLY_API_URL` - Billy API endpoint (default: https://billy.chitty.cc)

### Stages

The example pipeline includes:

1. **Checkout** - Clone repository
2. **Billy Code Review** - Review PR changes
3. **Build** - Your build stage
4. **Test** - Your test stage

### Review as Artifact

Billy's review is saved as `billy-review.txt` and archived with each build. Access via:

```
Build #123 → Build Artifacts → billy-review.txt
```

### PR Comment Integration

To post reviews as PR comments, use:

- **GitHub**: [GitHub Branch Source Plugin](https://plugins.jenkins.io/github-branch-source/)
- **GitLab**: [GitLab Plugin](https://plugins.jenkins.io/gitlab-plugin/)

Uncomment this line in the Jenkinsfile:

```groovy
// publishReviewComment(reviewReport)
```

And implement the `publishReviewComment` function for your platform.

### Files

- **Jenkinsfile**: `examples/jenkins/Jenkinsfile`
- **Documentation**: This file

---

## Pre-commit Hook

Run Billy locally before every commit with a git pre-commit hook.

### Quick Install

```bash
# Copy hook to your repository
cp examples/pre-commit/billy-pre-commit.sh .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit
```

### Configuration

Set environment variables:

```bash
# In ~/.bashrc, ~/.zshrc, or ~/.profile

# Billy API URL
export BILLY_API_URL="https://billy.chitty.cc"

# Enable/disable hook
export BILLY_ENABLED="true"

# Block commits with issues (strict mode)
export BILLY_FAIL_ON_ISSUES="false"  # Set to 'true' for strict mode
```

### Features

- ✅ Reviews staged files before commit
- ✅ Runs locally (fast feedback)
- ✅ Optional strict mode (blocks commits with issues)
- ✅ Easy bypass with `--no-verify`
- ✅ Works with any git repository

### Usage

Once installed, Billy runs automatically:

```bash
git add src/my-file.js
git commit -m "Add feature"

# Billy reviews staged changes...
# 🔍 Running Billy Code Review on staged changes...
# 📄 Reviewing: src/my-file.js
# ✅ Billy review complete!
```

### Bypass Hook

When needed:

```bash
git commit --no-verify -m "Emergency fix"
```

### Strict Mode

Block commits with issues:

```bash
export BILLY_FAIL_ON_ISSUES="true"
git commit -m "Must be perfect"

# If Billy finds issues:
# ❌ Commit blocked. Fix the issues and try again.
# To bypass: git commit --no-verify
```

### Requirements

- `curl` - For API requests (required)
- `jq` - For JSON parsing (optional but recommended)
- `git` - Obviously

Install jq:

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Fedora/RHEL
sudo dnf install jq

# Windows (Git Bash)
# Download from https://stedolan.github.io/jq/
```

### Team Setup

Commit the hook script to your repository and document it:

```markdown
## Setup

Install the pre-commit hook:

\`\`\`bash
cp examples/pre-commit/billy-pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
\`\`\`
```

### Files

- **Hook Script**: `examples/pre-commit/billy-pre-commit.sh`
- **Installation Guide**: `examples/pre-commit/README.md`
- **Documentation**: This file

---

## General Integration Guide

Integrate Billy into any CI/CD platform or custom script.

### API Endpoint

```
POST https://billy.chitty.cc/review
Content-Type: application/json
```

### Request Body

```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript",
  "context": "File: src/utils.js (optional)"
}
```

### Response

```json
{
  "review": "BS SCORE: 3/10\n\n💩 BS DETECTOR:\nFunction is fine but lacks type safety...\n\n🛠️ THE FIX:\nUse TypeScript or JSDoc...",
  "language": "javascript",
  "billy_says": "💩 BS detected and called out. You're welcome."
}
```

### Example: cURL

```bash
curl -X POST https://billy.chitty.cc/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "if (x == true) return true; else return false;",
    "language": "javascript",
    "context": "Authentication module"
  }'
```

### Example: Python

```python
import requests

response = requests.post(
    'https://billy.chitty.cc/review',
    json={
        'code': 'def add(a, b):\n    return a + b',
        'language': 'python',
        'context': 'Math utilities'
    }
)

review = response.json()
print(review['review'])
```

### Example: Node.js

```javascript
const response = await fetch('https://billy.chitty.cc/review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'function add(a, b) { return a + b; }',
    language: 'javascript',
    context: 'Utils module'
  })
});

const { review } = await response.json();
console.log(review);
```

### Supported Languages

Billy supports these languages (detected from file extensions):

| Language   | Extensions            | language value |
|------------|-----------------------|----------------|
| JavaScript | .js, .jsx             | `javascript`   |
| TypeScript | .ts, .tsx             | `typescript`   |
| Python     | .py                   | `python`       |
| Java       | .java                 | `java`         |
| Go         | .go                   | `go`           |
| Rust       | .rs                   | `rust`         |
| Ruby       | .rb                   | `ruby`         |
| PHP        | .php                  | `php`          |
| C/C++      | .c, .cpp, .cc, .cxx   | `c`, `cpp`     |
| C#         | .cs                   | `csharp`       |

---

## Best Practices

### 1. Review Changed Files Only

Don't review the entire codebase on every commit:

```bash
# Good: Review only changed files in PR
git diff --name-only origin/main...HEAD

# Bad: Review everything
find . -name "*.js"
```

### 2. Use Artifacts/Comments

Save Billy's review:

- **GitHub Actions**: Post as PR comment
- **GitLab CI**: Save as artifact + optional MR comment
- **Jenkins**: Archive as build artifact

### 3. Don't Block on Non-Critical Issues

Let the team decide:

```yaml
# Allow commits, but show review
continue-on-error: true
```

Or only block on critical issues:

```bash
if grep -q "🚩 CRITICAL" review.txt; then
  exit 1
fi
```

### 4. Rate Limiting

Billy runs on Cloudflare Workers with generous rate limits, but:

- **Batch reviews**: Combine multiple files if possible
- **Cache results**: Don't re-review unchanged files
- **Use sparingly**: Only on PRs, not every push

### 5. Security

If using a custom Billy instance:

- **Use HTTPS**: Always
- **Authenticate**: Add bearer token support if needed
- **Secrets**: Store API URL in CI/CD secrets, not code

### 6. Large Files

Billy has limits:

- **Max code size**: ~10KB per request (Cloudflare Worker limits)
- **Split large files**: Review in chunks if needed
- **Exclude generated code**: Don't review minified/bundled code

### 7. False Positives

Billy is opinionated. If you disagree:

- **Override**: Use `--no-verify` or bypass checks
- **Configure**: Adjust `BILLY_FAIL_ON_ISSUES` settings
- **Feedback**: Billy learns from context

---

## Troubleshooting

### Connection Issues

**Symptom**: API requests fail or timeout

**Solutions**:

1. Check Billy service status:
   ```bash
   curl https://billy.chitty.cc/health
   ```

2. Verify your `BILLY_API_URL`:
   ```bash
   echo $BILLY_API_URL
   ```

3. Check network/firewall:
   ```bash
   curl -v https://billy.chitty.cc/health
   ```

### Empty Reviews

**Symptom**: Billy returns empty or no review

**Causes**:

1. **Code is perfect** (rare) - Billy found nothing wrong
2. **API error** - Check response status
3. **Empty file** - File has no content
4. **Unsupported language** - File extension not recognized

**Debug**:

```bash
# Check full API response
curl -v https://billy.chitty.cc/review \
  -H "Content-Type: application/json" \
  -d '{"code":"your code","language":"javascript"}'
```

### Pre-commit Hook Not Running

**Symptom**: Hook doesn't execute on commit

**Solutions**:

1. Ensure it's executable:
   ```bash
   chmod +x .git/hooks/pre-commit
   ```

2. Check if it exists:
   ```bash
   ls -la .git/hooks/pre-commit
   ```

3. Test manually:
   ```bash
   .git/hooks/pre-commit
   ```

### GitHub Action Not Triggering

**Symptom**: Workflow doesn't run on PRs

**Solutions**:

1. Check workflow file location:
   ```
   .github/workflows/billy-review.yml
   ```

2. Verify triggers:
   ```yaml
   on:
     pull_request:
       types: [opened, synchronize, reopened]
   ```

3. Check file patterns:
   ```yaml
   paths:
     - '**.js'  # Must match changed files
   ```

4. View workflow runs:
   - GitHub → Actions → Billy Code Review

### Permission Issues

**Symptom**: "Permission denied" or "403 Forbidden"

**Solutions**:

1. **GitHub Actions**: Ensure permissions are set:
   ```yaml
   permissions:
     contents: read
     pull-requests: write
   ```

2. **GitLab CI**: Set `GITLAB_TOKEN` with `api` scope

3. **Jenkins**: Configure credentials for your Git platform

### Rate Limiting

**Symptom**: "429 Too Many Requests"

**Solutions**:

1. Reduce frequency:
   - Don't review on every push
   - Only review changed files

2. Add delays between requests:
   ```bash
   sleep 1  # Between file reviews
   ```

3. Use caching:
   - Cache reviews by file hash
   - Skip unchanged files

### jq Not Found

**Symptom**: "jq: command not found"

**Impact**: JSON parsing fails (minor)

**Solutions**:

1. Install jq:
   ```bash
   # macOS
   brew install jq
   
   # Ubuntu/Debian
   sudo apt-get install jq
   ```

2. Or continue without jq (basic parsing still works)

---

## Examples

### Example: Review All Python Files

```bash
#!/bin/bash

for file in $(find . -name "*.py" ! -path "*/venv/*"); do
  echo "Reviewing: $file"
  
  code=$(cat "$file")
  
  curl -s -X POST https://billy.chitty.cc/review \
    -H "Content-Type: application/json" \
    -d @- <<EOF | jq -r '.review'
{
  "code": $(echo "$code" | jq -Rs .),
  "language": "python",
  "context": "File: $file"
}
EOF
  
  echo "---"
done
```

### Example: Review Git Diff

```bash
#!/bin/bash

# Get diff of staged changes
git diff --cached > /tmp/diff.patch

# Review the diff itself
curl -s -X POST https://billy.chitty.cc/review \
  -H "Content-Type: application/json" \
  -d @- <<EOF | jq -r '.review'
{
  "code": $(cat /tmp/diff.patch | jq -Rs .),
  "language": "diff",
  "context": "Git diff of staged changes"
}
EOF
```

### Example: Review Clipboard Content

```bash
#!/bin/bash

# macOS: Review code from clipboard
pbpaste | jq -Rs '{code: ., language: "javascript", context: "Clipboard"}' | \
  curl -s -X POST https://billy.chitty.cc/review \
    -H "Content-Type: application/json" \
    -d @- | \
  jq -r '.review'
```

---

## Support

### Resources

- **API Docs**: [README.md](../README.md)
- **Examples**: [EXAMPLES.md](../EXAMPLES.md)
- **Issues**: [GitHub Issues](https://github.com/chitcommit/billy-bullshit/issues)

### Self-Hosting

To deploy your own Billy instance:

1. Clone the repository
2. Configure Cloudflare Workers
3. Update `BILLY_API_URL` in your CI/CD

See [DEPLOYMENT.md](../DEPLOYMENT.md) for details.

---

**Billy says:** 💩 Stop pushing BS code. Integrate me into your pipeline.

_Powered by [Billy Bullshit](https://billy.chitty.cc) - Calling BS on your BS code since 2024_
