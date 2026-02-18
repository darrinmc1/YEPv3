# Emergency PowerShell script to remove exposed API keys from Git history
# Run this AFTER revoking the old keys!

Write-Host "🚨 EMERGENCY: Removing exposed API keys from Git history" -ForegroundColor Red
Write-Host ""
Write-Host "This will:"
Write-Host "  1. Remove .env.local from all Git history"
Write-Host "  2. Force push to GitHub (REWRITES HISTORY!)"
Write-Host ""

$confirm = Read-Host "Are you sure? Type 'yes' to continue"

if ($confirm -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Step 1: Removing .env.local from Git history..." -ForegroundColor Yellow

# Option 1: Using git filter-repo (recommended if installed)
# git filter-repo --path .env.local --invert-paths --force

# Option 2: Using BFG Repo-Cleaner (if you have it)
# java -jar bfg.jar --delete-files .env.local

# Option 3: Manual method (works on any system)
Write-Host "Removing .env.local from index..."
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env.local" --prune-empty --tag-name-filter cat -- --all

Write-Host ""
Write-Host "Step 2: Cleaning up..." -ForegroundColor Yellow
Remove-Item -Path .git\refs\original\ -Recurse -Force -ErrorAction SilentlyContinue
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host ""
Write-Host "Step 3: Force pushing to GitHub..." -ForegroundColor Yellow
git push origin --force --all
git push origin --force --tags

Write-Host ""
Write-Host "✅ DONE! Exposed keys removed from Git history." -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. ✅ Verify old keys are REVOKED in Resend and Google"
Write-Host "  2. ✅ Update .env.local with NEW keys"
Write-Host "  3. ✅ Test your application"
Write-Host "  4. ✅ Never commit .env files again!"
