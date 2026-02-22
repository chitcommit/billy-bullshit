# Billy Bullshit - CI/CD Integration Examples

This directory contains example integrations for Billy Bullshit with popular CI/CD platforms and development workflows.

## 📂 Directory Structure

```
examples/
├── gitlab-ci.yml              # GitLab CI pipeline configuration
├── jenkins/
│   └── Jenkinsfile            # Jenkins pipeline script
└── pre-commit/
    ├── billy-pre-commit.sh    # Git pre-commit hook script
    └── README.md              # Installation guide
```

## 🚀 Quick Start

### GitHub Actions

GitHub Actions workflow is already included in this repository at:

```
.github/workflows/billy-review.yml
```

**To use in your own repository:**

1. Copy the workflow file:
   ```bash
   cp .github/workflows/billy-review.yml your-repo/.github/workflows/
   ```

2. Customize if needed (optional)

3. Push to your repository and create a PR!

### GitLab CI

**To use the GitLab CI integration:**

1. Copy the example configuration:
   ```bash
   cp examples/gitlab-ci.yml .gitlab-ci.yml
   # Or merge with your existing .gitlab-ci.yml
   ```

2. (Optional) Set CI/CD variables:
   - `BILLY_API_URL` - Custom Billy API endpoint
   - `GITLAB_TOKEN` - For posting MR comments (requires `api` scope)

3. Create a merge request!

### Jenkins

**To use the Jenkins integration:**

1. Copy the Jenkinsfile to your repository:
   ```bash
   cp examples/jenkins/Jenkinsfile Jenkinsfile
   # Or integrate into existing Jenkinsfile
   ```

2. Configure Jenkins environment variables (optional):
   - `BILLY_API_URL` - Billy API endpoint

3. Create a pull request!

### Pre-commit Hook

**To install the pre-commit hook locally:**

```bash
# From your repository root
cp examples/pre-commit/billy-pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**Configuration:**

Set environment variables in your shell profile (~/.bashrc, ~/.zshrc):

```bash
export BILLY_API_URL="https://billy.chitty.cc"
export BILLY_ENABLED="true"
export BILLY_FAIL_ON_ISSUES="false"  # Set to 'true' for strict mode
```

## 📖 Documentation

For detailed documentation on each integration, see:

- **Comprehensive Guide**: [docs/CI_CD_INTEGRATIONS.md](../docs/CI_CD_INTEGRATIONS.md)
- **Pre-commit Hook**: [pre-commit/README.md](pre-commit/README.md)
- **API Documentation**: [README.md](../README.md)

## 🔧 Configuration Options

### Common Environment Variables

All integrations support these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `BILLY_API_URL` | `https://billy.chitty.cc` | Billy API endpoint |
| `BILLY_ENABLED` | `true` | Enable/disable Billy review |
| `BILLY_FAIL_ON_ISSUES` | `false` | Block on issues (pre-commit only) |

### GitHub Actions Secrets

Set in: `Repository Settings → Secrets and variables → Actions`

- `BILLY_API_URL` (optional) - Custom Billy instance

### GitLab CI Variables

Set in: `Project Settings → CI/CD → Variables`

- `BILLY_API_URL` (optional) - Custom Billy instance
- `GITLAB_TOKEN` (optional) - For posting MR comments (requires `api` scope)

### Jenkins Environment Variables

Set in: `Jenkins Configuration → Environment Variables`

- `BILLY_API_URL` (optional) - Custom Billy instance

## 🎯 What Gets Reviewed

All integrations review these file types:

- JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`)
- Python (`.py`)
- Java (`.java`)
- Go (`.go`)
- Rust (`.rs`)
- Ruby (`.rb`)
- PHP (`.php`)
- C/C++ (`.c`, `.cpp`, `.cc`, `.cxx`)
- C# (`.cs`)

## 🔍 Example Output

When Billy reviews your code, you'll see output like:

```
## 💩 Billy's Code Review

> Calling BS on your BS code since 2024

### 📄 `src/utils.js`

```
BS SCORE: 7/10

💩 BS DETECTOR:
This function is doing way too much. Split it up.

🛠️ THE FIX:
function processUser(user) {
  const validated = validateUser(user);
  const processed = transformUser(validated);
  return saveUser(processed);
}
\`\`\`

---

**Billy says:** 💩 BS detected and called out. You're welcome.
```

## 💡 Best Practices

### 1. Review Changed Files Only

All example integrations are configured to review only changed files in PRs/MRs, not the entire codebase.

### 2. Don't Block Builds (Usually)

The default configuration doesn't block builds on Billy's findings. This gives teams flexibility to decide what to fix.

To enable strict mode (block on issues):

- **Pre-commit Hook**: Set `BILLY_FAIL_ON_ISSUES=true`
- **CI/CD**: Modify the script to `exit 1` on critical issues

### 3. Use Artifacts

CI/CD integrations save Billy's review as artifacts (GitLab, Jenkins) or comments (GitHub, GitLab with token).

### 4. Rate Limiting

Billy runs on Cloudflare Workers with generous limits, but be mindful:

- Review changed files only, not entire codebase on every commit
- Don't review on every push, only on PRs/MRs

## 🐛 Troubleshooting

### Hook Not Running

```bash
# Ensure it's executable
chmod +x .git/hooks/pre-commit

# Test manually
.git/hooks/pre-commit
```

### API Connection Issues

```bash
# Test Billy API
curl https://billy.chitty.cc/health

# Should return:
# {"status":"healthy","timestamp":"...","message":"Billy is alive..."}
```

### Empty Reviews

If Billy returns no review:

1. **Code is perfect** (unlikely but possible)
2. **File not supported** - Check file extension
3. **API error** - Check `curl -v` output
4. **Empty file** - File has no content

### GitHub Action Not Triggering

1. Check workflow file location: `.github/workflows/billy-review.yml`
2. Verify file patterns match your changes
3. Check Actions tab for errors
4. Ensure permissions are set correctly

## 📚 Additional Resources

- **Full Integration Guide**: [docs/CI_CD_INTEGRATIONS.md](../docs/CI_CD_INTEGRATIONS.md)
- **API Documentation**: [README.md](../README.md)
- **Code Review Examples**: [EXAMPLES.md](../EXAMPLES.md)
- **Deployment Guide**: [DEPLOYMENT.md](../DEPLOYMENT.md)

## 🤝 Contributing

Found an issue or have a suggestion? Open an issue or PR!

Want to add a new integration? Follow the pattern:

1. Create integration script/config
2. Add documentation
3. Add example output
4. Test it!

## 📄 License

MIT - Same as Billy Bullshit

---

**Billy says:** 💩 Stop pushing BS code. Use these integrations.

_Powered by [Billy Bullshit](https://billy.chitty.cc) - Calling BS on your BS code since 2024_
