# Billy Bullshit - GitLab CI Integration

**File:** `examples/gitlab-ci.yml`

This example demonstrates how to integrate Billy Bullshit into your GitLab CI/CD pipeline for automated code reviews on merge requests.

## Quick Start

```bash
# Copy to your repository
cp examples/gitlab-ci.yml .gitlab-ci.yml
# Or merge with your existing .gitlab-ci.yml

# Commit and create a merge request
git add .gitlab-ci.yml
git commit -m "Add Billy code review"
git push
```

## Features

- ✅ Automatic MR reviews
- ✅ Reviews only changed files
- ✅ Saves review as artifact (30 days)
- ✅ Optional MR comment posting
- ✅ Manual full review job

## Configuration

### Enable MR Comments

1. Create project access token with `api` scope
2. Add CI/CD variable: `GITLAB_TOKEN=glpat-xxxx`

### Custom Billy Instance

```yaml
variables:
  BILLY_API_URL: "https://your-billy.example.com"
```

## Documentation

See full guide: [docs/CI_CD_INTEGRATIONS.md](../docs/CI_CD_INTEGRATIONS.md#gitlab-ci)

---

**Billy says:** 💩 Stop merging BS code.
