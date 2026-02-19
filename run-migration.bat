@echo off
echo.
echo Updating database schema with new Roadmap fields...
echo (nudgeFrequency, contentDepth, startDate, status, lastNudgeSent, etc.)
echo.
cd /d "C:\Users\Client\Desktop\YEP FILES\YEPv3-master\YEPv3-master"
npx prisma db push
echo.
echo ============================================================
echo If you see "Your database is now in sync" above = SUCCESS
echo If you see errors above = paste them in the chat
echo ============================================================
pause
