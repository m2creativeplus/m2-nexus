---
description: Check and fix git status across all active projects, commit uncommitted work
---

# Git Status Check & Commit

Check all active projects for uncommitted changes and commit them.

// turbo-all

## Steps

1. Check all active projects:
```bash
for dir in "/Volumes/MAC DATA/Antigraphity/m2creative-website" "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/smart-school-sms" "/Volumes/MAC DATA/Antigraphity/m2-nexus" "/Volumes/MAC DATA/Antigraphity/snpa-knowledge-base" "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB"; do
  if [ -d "$dir/.git" ]; then
    echo "=========================================="
    echo "📁 $(basename $dir)"
    cd "$dir"
    echo "Branch: $(git branch --show-current)"
    DIRTY=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    echo "Uncommitted files: $DIRTY"
    if [ "$DIRTY" -gt 0 ]; then
      echo "⚠️  HAS UNCOMMITTED CHANGES:"
      git status --short
    else
      echo "✅ Clean"
    fi
    echo "Last commit: $(git log -1 --format='%h %s (%cr)' 2>/dev/null || echo 'no commits')"
    echo ""
  fi
done
```

2. For each project with uncommitted changes, stage and commit:
```bash
cd "<project-path>"
git add .
git commit -m "<meaningful message describing changes>"
git push origin main
```

3. After committing, verify all projects are clean:
```bash
echo "=== FINAL STATUS ==="
for dir in "/Volumes/MAC DATA/Antigraphity/m2creative-website" "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/smart-school-sms" "/Volumes/MAC DATA/Antigraphity/m2-nexus"; do
  if [ -d "$dir/.git" ]; then
    cd "$dir"
    DIRTY=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    if [ "$DIRTY" -eq 0 ]; then
      echo "✅ $(basename $dir): Clean"
    else
      echo "⚠️  $(basename $dir): Still $DIRTY uncommitted files"
    fi
  fi
done
```
