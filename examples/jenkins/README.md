# Billy Bullshit - Jenkins Integration Example

This Jenkinsfile demonstrates how to integrate Billy Bullshit into your Jenkins CI/CD pipeline for automated code reviews.

## Overview

Billy will automatically review code changes in pull requests and provide brutally honest feedback on:

- 🚩 **CRITICAL** issues (security, crashes, data loss)
- ⚠️ **MAJOR** issues (performance, maintainability)
- 💩 **BS** issues (over-engineering, bad practices)
- 🤦 **WTAF** issues (code that makes you question humanity)

## Quick Start

### 1. Copy Jenkinsfile

```bash
cp examples/jenkins/Jenkinsfile Jenkinsfile
# Or integrate into your existing Jenkinsfile
```

### 2. Configure Jenkins

**Environment Variables** (optional):
- `BILLY_API_URL` - Billy API endpoint (default: https://billy.chitty.cc)

Set in: `Jenkins Configuration → Environment Variables` or in the Jenkinsfile itself.

### 3. Required Tools

Ensure these are installed on your Jenkins nodes:

- `curl` - For API requests
- `jq` - For JSON parsing
- `git` - For repository operations

**Install jq on Jenkins node:**

```bash
# Ubuntu/Debian
sudo apt-get install jq

# RHEL/CentOS/Fedora
sudo yum install jq

# macOS
brew install jq
```

### 4. Create a Pull Request

Once configured, Billy will automatically review code on every PR!

## Pipeline Stages

The example Jenkinsfile includes these stages:

1. **Checkout** - Clone the repository
2. **Billy Code Review** - Review changed files in PR
3. **Build** - Your build stage (customize)
4. **Test** - Your test stage (customize)

## Features

- ✅ Runs only on pull requests (changeRequest)
- ✅ Reviews only changed files (efficient)
- ✅ Archives review as build artifact
- ✅ Supports GitHub and GitLab PRs/MRs
- ✅ Language detection from file extensions
- ✅ Parallel execution ready

## Configuration Options

### Change Billy API URL

```groovy
environment {
    BILLY_API_URL = "https://your-billy.example.com"
}
```

### Review All Files (Not Just Changes)

Modify the `git diff` command:

```groovy
// Review all files
def allFiles = sh(
    script: 'find . -name "*.js" -o -name "*.py"',
    returnStdout: true
).trim()
```

### Run on All Branches (Not Just PRs)

Remove or modify the `when` condition:

```groovy
stage('Billy Code Review') {
    // Remove: when { changeRequest() }
    steps {
        // ...
    }
}
```

## Accessing Review Results

Billy's review is saved as `billy-review.txt` in build artifacts.

**To access:**

1. Go to build page: `Build #123`
2. Click **Build Artifacts**
3. Download `billy-review.txt`

## PR Comment Integration

To post Billy's review as a PR comment, you'll need a plugin:

### For GitHub

Install: [GitHub Branch Source Plugin](https://plugins.jenkins.io/github-branch-source/)

Add to Jenkinsfile:

```groovy
// After generating reviewReport
if (env.CHANGE_ID) {
    pullRequest.comment(reviewReport)
}
```

### For GitLab

Install: [GitLab Plugin](https://plugins.jenkins.io/gitlab-plugin/)

Add to Jenkinsfile:

```groovy
// After generating reviewReport
addGitLabMRComment(comment: reviewReport)
```

## Example Output

**Console Log:**

```
[Pipeline] stage
[Pipeline] { (Billy Code Review)
🔍 Running Billy Code Review...
Reviewing: src/auth.js
---
BS SCORE: 8/10

🚩 CRITICAL ISSUES:
Your password validation is a joke...

💩 BS DETECTOR:
This function is 200 lines long...

🛠️ THE FIX:
Split it into smaller functions...
---
✅ Billy review complete - check artifacts for full report
[Pipeline] }
```

**Artifact (`billy-review.txt`):**

```markdown
## 💩 Billy's Code Review

> Calling BS on your BS code since 2024

### 📄 `src/auth.js`

```
BS SCORE: 8/10

🚩 CRITICAL ISSUES:
Your password validation is a joke...
```

---

**Billy says:** 💩 BS detected and called out. You're welcome.
```

## Troubleshooting

### Pipeline Not Triggering on PRs

**Solution:** Ensure you have a multibranch pipeline configured with PR discovery:

```
Configure → Branch Sources → Add → GitHub/GitLab
```

### jq Not Found

**Symptom:** `jq: command not found`

**Solution:** Install jq on Jenkins node:

```bash
# Ubuntu/Debian
sudo apt-get install jq

# Or use Docker agent with jq pre-installed
agent {
    docker {
        image 'alpine:latest'
        args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
}
```

### Empty Reviews

**Causes:**

1. No code files changed in PR
2. API connection issue
3. File extensions not recognized

**Debug:**

```groovy
// Add debug output
echo "Changed files: ${changedFiles}"
echo "Response: ${response}"
```

### Permission Issues

**Solution:** Ensure Jenkins has access to:

- Git repository (SSH key or token)
- Network access to Billy API
- Write access for artifacts

## Advanced Usage

### Review Specific File Types Only

```groovy
def changedFiles = sh(
    script: '''
        git diff --name-only origin/${CHANGE_TARGET}...HEAD | \
        grep -E '\\.(js|ts|py)$' || true
    ''',
    returnStdout: true
).trim()
```

### Fail Build on Critical Issues

```groovy
// After reviewing files
if (reviewResults.any { it.review.contains('🚩 CRITICAL') }) {
    error('Critical issues found by Billy')
}
```

### Parallel File Reviews

```groovy
def reviews = [:]
filesList.each { file ->
    reviews[file] = {
        // Review this file
    }
}
parallel reviews
```

## Integration with Other Tools

### SonarQube

```groovy
stage('Code Quality') {
    parallel {
        stage('Billy Review') {
            steps { /* Billy review */ }
        }
        stage('SonarQube') {
            steps { /* SonarQube scan */ }
        }
    }
}
```

### Slack Notifications

```groovy
post {
    always {
        slackSend(
            message: "Billy reviewed your code: ${BUILD_URL}artifact/billy-review.txt"
        )
    }
}
```

## Support

For more help:

- **Full Documentation**: [docs/CI_CD_INTEGRATIONS.md](../../docs/CI_CD_INTEGRATIONS.md)
- **API Docs**: [README.md](../../README.md)
- **Issues**: [GitHub Issues](https://github.com/chitcommit/billy-bullshit/issues)

---

**Billy says:** 💩 Stop merging BS code. Use this Jenkins integration.

_Powered by [Billy Bullshit](https://billy.chitty.cc) - Calling BS on your BS code since 2024_
