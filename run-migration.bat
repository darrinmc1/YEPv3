@echo off
echo Running Prisma migration for Roadmap table...
cd /d "C:\Users\Client\Desktop\YEP FILES\YEPv3-master\YEPv3-master"
npx prisma db push
echo Done! Your database now has the Roadmap table.
echo.
echo If you see errors above, they will stay visible now.
pause
