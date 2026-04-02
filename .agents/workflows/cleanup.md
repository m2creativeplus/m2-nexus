---
description: Clean up screenshots, sort Documents folder, check storage, and remove clutter
---

# Cleanup Workspace

Automated cleanup of desktop, downloads, documents screenshots, and workspace clutter.

## Steps

1. Count current clutter:
```bash
echo "=== CLUTTER REPORT ==="
echo "Desktop files: $(find ~/Desktop -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "Downloads files: $(find ~/Downloads -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "Documents screenshots: $(find ~/Documents -maxdepth 1 -name 'Screenshot*' 2>/dev/null | wc -l | tr -d ' ')"
echo "Documents root files: $(find ~/Documents -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')"
echo ""
echo "=== STORAGE ==="
df -h / | awk 'NR==2 {printf "Available: %s / %s (%s used)\n", $4, $2, $5}'
```

2. Move screenshots from Documents root to archive:
```bash
mkdir -p ~/Documents/02_SCREENSHOTS_ARCHIVE
find ~/Documents -maxdepth 1 -name 'Screenshot*' -exec mv {} ~/Documents/02_SCREENSHOTS_ARCHIVE/ \;
echo "Screenshots moved to 02_SCREENSHOTS_ARCHIVE"
```

3. Check for large files consuming storage:
```bash
find ~ -maxdepth 3 -type f -size +500M 2>/dev/null | head -10
```

4. Check for node_modules that can be cleaned:
```bash
echo "=== Large node_modules ==="
find "/Volumes/MAC DATA/Antigraphity" -name "node_modules" -type d -maxdepth 3 2>/dev/null | while read dir; do
  echo "$(du -sh "$dir" 2>/dev/null) — $(dirname "$dir" | xargs basename)"
done
```

5. Report final state after cleanup.
