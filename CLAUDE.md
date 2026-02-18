# CLAUDE.md — YourExitPlans Agent Instructions
# Updated: February 18, 2026
# Local Path: C:\Users\Client\Desktop\YEP FILES\YEPv3-master\YEPv3-master
# GitHub: https://github.com/darrinmc1/YEPv3
# Live Site: https://yourexitplans.com (Vercel)
# n8n Instance: https://n8n-production-8ab4.up.railway.app

---

## WHAT THIS PROJECT IS

YourExitPlans is an AI-powered business LAUNCH platform — NOT a business sale/exit advisory site.

Two user paths:
1. Browse Path — Explore 1,000+ pre-researched business ideas, get research reports
2. Build Path — Submit your own idea, get free AI validation, buy a launch roadmap

Monetisation:
- FREE: Idea Pulse Check (validation score), 3 submissions per email per day
- 9 dollars: Research Report PDF for one idea
- 29 dollars: Research + 90-day Implementation Plan
- 49 dollars: 7 Ideas Bundle
- 99 dollars: 10 Ideas + Implementation (best value)
- Subscriptions: Starter, Silver, Gold (249/mo), Platinum (999/mo)

---

## TECH STACK

Framework:    Next.js 15 App Router + React 19 + TypeScript
Styling:      Tailwind CSS v4 + Radix UI + shadcn/ui
Deployment:   Vercel (auto-deploy from GitHub main branch)
Automation:   n8n hosted on Railway
Email:        Resend API (ideas@yourexitplans.com)
Database:     Google Sheets (via googleapis service account)
AI:           Google Gemini API (idea validation + content)
PDF:          @react-pdf/renderer + pdfkit
Auth:         NextAuth v4 (magic links)
Payments:     Stripe (NOT YET INTEGRATED)

---

## DIRECTORY STRUCTURE

app/
  page.tsx                  Homepage — dual path hero
  explore-ideas/            Browse 1000 ideas page
  validate-idea/            Free idea validation form (3 steps)
  checkout/                 Purchase flow
  admin/                    Admin dashboard
  api/
    explore-ideas/route.ts  Fetches ideas from Google Sheets directly
    validate-idea/route.ts  Sends data to n8n webhook
    process-purchase/       PDF generation + email delivery
    test-pdf/route.ts       PDF test endpoint
    admin/                  Admin API routes
    geo/                    Geo detection

lib/services/
  google-sheets.ts          All Google Sheets read/write operations
  pdf-generator.tsx         PDF templates using @react-pdf/renderer
  email.ts                  Resend email sending functions
  purchase-tracking.ts      Save/update purchase records

---

## CONFIRMED WORKING (as of Feb 18 2026)

- Google Sheets connection: WORKING (sheets=True confirmed)
- PDF generation: WORKING (research + implementation PDFs generate)
- n8n/Railway: ALIVE (healthz returns ok)
- Resend email: CONFIGURED (re_JhE6N1S5... key active)
- Ideas library: 1000 ideas in Google Sheet ID 1aKxrwa9pAL6qhltvqd1eJERFZsxqWlHWQg2e9Gj3QZ8

---

## KNOWN ISSUES (as of Feb 18 2026)

1. n8n workflow was INACTIVE — needed to be Published in new n8n UI
2. Webhook path was wrong in env — correct path is /webhook/idea-validation NOT /idea-pulse-check
3. NEXT_PUBLIC_ prefix was missing from webhook URL env var
4. RAILWAY_N8N_WEBHOOK_URL was pointing to /webhook-test/ (test only, stops when browser closes)
5. Google Sheets service account did not exist — created fresh Feb 18 2026
6. Stripe payments NOT integrated — purchase flow incomplete
7. Purchases Google Sheet may not exist — GOOGLE_SHEET_ID_PURCHASES not set
8. n8n workflow missing Respond to Webhook node — may hang without returning response

---

## EXTERNAL CONNECTIONS

### n8n on Railway
URL:            https://n8n-production-8ab4.up.railway.app
Workflow name:  Idea Validation Workflow
Webhook path:   /webhook/idea-validation
HTTP method:    POST
Env var:        NEXT_PUBLIC_N8N_WEBHOOK_URL

Form fields sent to n8n:
  email, idea, oneLiner, problem, target, type, industry, price, model, geo

Expected response from n8n:
  opportunityScore, topStrength, biggestRisk, whyNow, startThisWeekend, similarBusinesses, quickVerdict

n8n workflow nodes:
  Webhook -> Extract Form Data -> Build Gemini Prompt -> Call Gemini AI
  -> Parse Gemini Response -> Build Email -> Send Email via Resend -> Return Response to App

### Google Sheets
Auth:           Service account (OAuth2)
Client email:   yourexitplans-sheets@gen-lang-client-0501848652.iam.gserviceaccount.com
Sheet IDs:
  GOOGLE_SHEET_ID_LIBRARY = 1aKxrwa9pAL6qhltvqd1eJERFZsxqWlHWQg2e9Gj3QZ8  (1000 ideas)
  GOOGLE_SHEET_ID_PURCHASES = NOT YET SET (sheet may need to be created)

### Resend Email
Domain:         yourexitplans.com (verified)
From address:   ideas@yourexitplans.com
Env var:        RESEND_API_KEY
Rate limit:     2 emails per second

### Vercel
Trigger:        Push to main branch on GitHub
Build command:  next build
Env vars:       Must be set in Vercel dashboard AND in local .env.local

---

## ENVIRONMENT VARIABLES

Required in both .env.local (local dev) and Vercel dashboard (production):

NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n-production-8ab4.up.railway.app/webhook/idea-validation
N8N_WEBHOOK_URL=https://n8n-production-8ab4.up.railway.app/webhook/idea-validation
GOOGLE_SHEETS_CLIENT_EMAIL=yourexitplans-sheets@gen-lang-client-0501848652.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
GOOGLE_SHEET_ID_LIBRARY=1aKxrwa9pAL6qhltvqd1eJERFZsxqWlHWQg2e9Gj3QZ8
RESEND_API_KEY=re_JhE6N1S5_HJcZVGGWPDnj5eubvmFVVQEG
RESEND_FROM_EMAIL=YourExitPlans <ideas@yourexitplans.com>
RESEND_REPLY_TO=support@yourexitplans.com
NEXTAUTH_URL=https://yourexitplans.com
NEXTAUTH_SECRET=<secret>
ADMIN_JWT_SECRET=<min 32 chars>

NOT YET SET (needed for purchase flow):
GOOGLE_SHEET_ID_PURCHASES=<create this sheet>
GOOGLE_GEMINI_API_KEY=<needed for direct Gemini calls>

---

## AGENT 1 — QA TESTING AGENT

Role: Test every user-facing flow and report all broken elements.

Setup:
  cd "C:\Users\Client\Desktop\YEP FILES\YEPv3-master\YEPv3-master"
  npm run dev
  Test at http://localhost:3000

Also test live site at https://yourexitplans.com in parallel.

### CRITICAL PATH 1 — Homepage
- Load http://localhost:3000
- Check both CTAs work: "I Need a Business Idea" and "I Have an Idea"
- Check nav links all work (no 404s)
- Check mobile layout at 375px width (DevTools responsive mode)
- Check no console errors (F12 -> Console tab)

### CRITICAL PATH 2 — Explore Ideas (/explore-ideas)
- Page loads without error
- Ideas grid displays (should show business idea cards)
- Search by keyword works (try: "coffee", "app", "dog")
- Filters work: budget, industry, difficulty, time commitment
- Clicking an idea card shows detail
- "Get Report" button leads to checkout
- Test API directly:
  Invoke-RestMethod -Uri "http://localhost:3000/api/explore-ideas?check=health"
  Expected: sheets=True

### CRITICAL PATH 3 — Validate Idea (/validate-idea)
- Page loads 3-step form
- Step 1: Fill idea name, description, problem solved
- Step 2: Fill target customer, business type, industry, price range
- Step 3: Enter email and submit
- Watch Network tab (F12) for POST request to n8n webhook
- Expected: Loading state -> success message -> email arrives at submitted address
- Check n8n executions at https://n8n-production-8ab4.up.railway.app to confirm it ran

### CRITICAL PATH 4 — PDF Generation
  Invoke-RestMethod -Uri "http://localhost:3000/api/test-pdf?type=research" -OutFile "test-research.pdf"
  Invoke-RestMethod -Uri "http://localhost:3000/api/test-pdf?type=implementation" -OutFile "test-impl.pdf"
- Both PDFs should download and open correctly
- Check console for validation score (target 70+)
- PDFs should be 2-3 pages, professional appearance, no blank pages

### CRITICAL PATH 5 — Purchase Flow (/checkout)
- Navigate to checkout
- Document exactly where it breaks (Stripe not integrated)
- Note what fields appear and what errors occur

### CRITICAL PATH 6 — Admin Dashboard (/admin)
- Navigate to /admin
- Should redirect to login if not authenticated
- Test login with admin credentials
- Check dashboard loads stats from Google Sheets

### ON EVERY PAGE CHECK
- No 404 links
- No JavaScript console errors
- Mobile responsive at 375px
- No placeholder/Lorem ipsum content
- CTAs are clear and clickable
- Page loads in under 3 seconds

### OUTPUT FORMAT — save to test-report.md

## Test Report — YourExitPlans
Date: [date]
Local: http://localhost:3000
Live: https://yourexitplans.com

### CRITICAL (blocks users)
- [Issue] | [Page] | [Steps to reproduce] | [Error]

### HIGH (needs fix before launch)
- [Issue] | [Page] | [Expected vs Actual]

### LOW (nice to fix)
- [Issue] | [Page]

### PASSING
- [Feature] | [What was tested]

### CONNECTION STATUS
- n8n webhook: [OK / FAIL] | [error if any]
- Google Sheets: [OK / FAIL] | [error if any]
- Resend email: [OK / FAIL] | [error if any]
- PDF generation: [OK / FAIL] | [score]

---

## AGENT 2 — CONNECTION DIAGNOSTICS AGENT

Role: Verify all external services are connected and responding correctly.

### Check 1 — n8n alive
Invoke-RestMethod -Uri "https://n8n-production-8ab4.up.railway.app/healthz"
Expected: status=ok

### Check 2 — n8n webhook responds
$ody = @{
    email = "darrinmc1@yahoo.com"
    idea = "Dog walking app"
    oneLiner = "Uber for dog walks"
    problem = "Busy owners cant walk their dogs"
    target = "Working professionals"
    type = "service"
    industry = "pets"
    price = "50"
    model = "subscription"
    geo = "Australia"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://n8n-production-8ab4.up.railway.app/webhook/idea-validation" -Method POST -Body $ody -ContentType "application/json"
Expected: JSON with opportunityScore field
404 = workflow not published in n8n
502 = Railway instance down
Timeout = workflow has no Respond to Webhook node

### Check 3 — Google Sheets local
Invoke-RestMethod -Uri "http://localhost:3000/api/explore-ideas?check=health"
Expected: sheets=True
sheets=False = credentials missing from .env.local

### Check 4 — Google Sheets live
Invoke-RestMethod -Uri "https://yourexitplans.com/api/explore-ideas?check=health"
Expected: sheets=True
sheets=False = credentials missing from Vercel dashboard

### Check 5 — PDF generation
Invoke-RestMethod -Uri "http://localhost:3000/api/test-pdf?type=research" -OutFile "test.pdf"
Expected: PDF file created, console shows validation score 70+

### Check 6 — Ideas load from Sheets
Invoke-RestMethod -Uri "http://localhost:3000/api/explore-ideas" -Method GET
Expected: JSON with ideas array containing business ideas

### OUTPUT FORMAT — save to connection-report.md

## Connection Report — YourExitPlans
Date: [date]

| Service | Status | Response | Issue | Fix |
|---|---|---|---|---|
| n8n healthz | OK/FAIL | [response] | [issue] | [fix] |
| n8n webhook | OK/FAIL | [response] | [issue] | [fix] |
| Google Sheets local | OK/FAIL | sheets=True/False | [issue] | [fix] |
| Google Sheets live | OK/FAIL | sheets=True/False | [issue] | [fix] |
| PDF generation | OK/FAIL | score [X]/100 | [issue] | [fix] |

---

## AGENT 3 — CODE FIX AGENT

Role: Fix identified issues, test locally, push to GitHub, verify on live site.

Workflow:
  1. Read test-report.md and connection-report.md
  2. Identify files to change
  3. Make targeted edits — prefer small surgical changes
  4. Run: npm run build (must pass with 0 errors)
  5. Run: npm run dev and retest the broken flow
  6. git add -A
  7. git commit -m "fix: [description of what was fixed]"
  8. git push origin main
  9. Wait 2 minutes for Vercel auto-deploy
  10. Verify fix on https://yourexitplans.com

Common issues mapped to files:

ISSUE: n8n returns 404
FIX: Check NEXT_PUBLIC_N8N_WEBHOOK_URL in .env.local and Vercel
FILE: .env.local + Vercel dashboard env vars

ISSUE: n8n webhook path wrong
FIX: Change path in env var to /webhook/idea-validation
FILE: .env.local

ISSUE: n8n workflow inactive
FIX: Go to n8n UI, find Idea Validation Workflow, click Publish
FILE: n8n dashboard (not code)

ISSUE: n8n returns response but website shows error
FIX: Add Respond to Webhook node as final node in n8n workflow
FILE: n8n dashboard (not code)

ISSUE: Google Sheets not loading (sheets=False)
FIX: Check GOOGLE_SHEETS_CLIENT_EMAIL and GOOGLE_SHEETS_PRIVATE_KEY in env
FILE: .env.local + Vercel dashboard

ISSUE: PRIVATE_KEY newline error
FIX: Ensure \n in key are literal backslash-n not actual newlines in .env.local
FILE: .env.local

ISSUE: Explore ideas page blank
FIX: Check api/explore-ideas route + google-sheets.ts searchIdeas function
FILES: app/api/explore-ideas/route.ts + lib/services/google-sheets.ts

ISSUE: Validate idea form does nothing on submit
FIX: Check NEXT_PUBLIC_N8N_WEBHOOK_URL is set (must have NEXT_PUBLIC_ prefix)
FILE: .env.local + Vercel dashboard

ISSUE: PDF not generating
FIX: Check test-pdf endpoint + pdf-generator service
FILES: app/api/test-pdf/route.ts + lib/services/pdf-generator.tsx

ISSUE: Email not sending
FIX: Check RESEND_API_KEY and from address format
FILE: .env.local + lib/services/email.ts

ISSUE: TypeScript build errors
FIX: Run npx tsc --noEmit to find all type errors, fix each one
COMMAND: npx tsc --noEmit

Before every push:
  npm run lint
  npm run build
  Both must pass with 0 errors

Git commit conventions:
  fix: broken n8n webhook — wrong path in env var
  fix: Google Sheets credentials missing from Vercel
  feat: add Respond to Webhook node response handling
  chore: update env variable names

---

## LOCAL DEV COMMANDS

cd "C:\Users\Client\Desktop\YEP FILES\YEPv3-master\YEPv3-master"
npm run dev                    Start dev server at localhost:3000
npm run build                  Test production build (must pass before push)
npm run lint                   Check for lint errors
npx tsc --noEmit               Check TypeScript errors without building

---

## KEY URLS

Live site:          https://yourexitplans.com
GitHub repo:        https://github.com/darrinmc1/YEPv3
Vercel dashboard:   https://vercel.com/dashboard
n8n on Railway:     https://n8n-production-8ab4.up.railway.app
Railway dashboard:  https://railway.app
Resend dashboard:   https://resend.com
Google Cloud:       https://console.cloud.google.com (project: YourExitPlans)
Ideas Sheet:        https://docs.google.com/spreadsheets/d/1aKxrwa9pAL6qhltvqd1eJERFZsxqWlHWQg2e9Gj3QZ8
Admin email:        darrinmc1@yahoo.com
Error alerts:       darrinmc@yahoo.com
Sending email:      ideas@yourexitplans.com

---

## IMPORTANT NOTES FOR AGENTS

1. This is a business LAUNCH platform — not exit/sale advisory. Do not confuse them.
2. Never commit .env.local to Git — it is gitignored. Production env vars go in Vercel dashboard only.
3. NEXT_PUBLIC_ prefix is required on any env var accessed in browser-side code.
4. n8n has a new UI — the Active toggle is now a Publish button in top right.
5. /webhook-test/ URLs only work while n8n browser tab is open. Always use /webhook/ for production.
6. Tailwind v4 is used — do not apply v3 Tailwind config syntax.
7. Next.js App Router only — all routes use app/ directory, API routes use route.ts files.
8. Railway free tier may have cold starts — if webhook times out, retry once before diagnosing.
9. Google Sheets private key \n characters must be literal backslash-n in .env.local.
10. Stripe is NOT integrated — purchase flow will break at payment step. This is expected.
