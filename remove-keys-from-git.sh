#!/bin/bash
# Emergency script to remove exposed API keys from Git history

echo "🚨 EMERGENCY: Removing exposed API keys from Git history"
echo ""
echo "This will:"
echo "  1. Remove .env.local from all Git history"
echo "  2. Force push to GitHub (DANGER!)"
echo ""
read -p "Are you sure? This will rewrite Git history! (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Step 1: Removing .env.local from Git history..."
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "Step 2: Cleaning up..."
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "Step 3: Force pushing to GitHub..."
git push origin --force --all
git push origin --force --tags

echo ""
echo "✅ DONE! Exposed keys removed from Git history."
echo ""
echo "NEXT STEPS:"
echo "  1. Verify keys are revoked in Resend and Google"
echo "  2. Update .env.local with NEW keys"
echo "  3. Test your application"
