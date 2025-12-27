@echo off
echo 🧹 Cleaning Git history and removing exposed keys...
echo.

cd C:\Users\Darrin\Desktop\YEPV4\YEPv3

echo Step 1: Backing up your code...
xcopy /E /I /Y . ..\YEPv3_backup

echo.
echo Step 2: Removing Git history...
rmdir /s /q .git

echo.
echo Step 3: Reinitializing Git (clean history)...
git init
git add .
git commit -m "Clean start - API keys removed from history"

echo.
echo Step 4: Ready to push to GitHub
echo.
echo ✅ DONE! Old keys removed from Git history.
echo.
echo NEXT STEPS:
echo   1. Push to GitHub: git push origin main --force
echo   2. Test your application with new keys
echo   3. Delete backup: rmdir /s /q ..\YEPv3_backup
echo.
pause
