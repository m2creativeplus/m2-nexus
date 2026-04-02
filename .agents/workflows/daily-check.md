---
description: Run morning system check - storage, git status, clutter, project health
---

# Daily System Check

Run the M2 daily systems check to see storage, project status, and cleanup needs.

// turbo-all

## Steps

1. Check disk storage:
```bash
df -h / | awk 'NR==2 {printf "Available: %s / %s (%s used)\n", $4, $2, $5}'
```

2. Check git status for all active projects:
```bash
for dir in "/Volumes/MAC DATA/Antigraphity/m2creative-website" "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/smart-school-sms" "/Volumes/MAC DATA/Antigraphity/m2-nexus" "/Volumes/MAC DATA/Antigraphity/snpa-knowledge-base"; do
  if [ -d "$dir/.git" ]; then
    echo "📁 $(basename $dir):"
    cd "$dir"
    echo "   Branch: $(git branch --show-current)"
    echo "   Uncommitted: $(git status --porcelain | wc -l | tr -d ' ') files"
    echo "   Last commit: $(git log -1 --format='%cr' 2>/dev/null || echo 'none')"
  fi
done
```

3. Check desktop and downloads clutter:
```bash
echo "Desktop files: $(find ~/Desktop -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "Downloads files: $(find ~/Downloads -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "Documents screenshots: $(find ~/Documents -maxdepth 1 -name 'Screenshot*' 2>/dev/null | wc -l | tr -d ' ')"
```

4. Check Node/NPM/Vercel versions:
```bash
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo "Vercel: $(vercel --version 2>/dev/null || echo 'NOT INSTALLED')"
```
