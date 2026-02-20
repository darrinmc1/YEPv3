# YourExitPlans — n8n Workflows

**n8n instance:** https://n8n-production-8ab4.up.railway.app  
**Environment variables needed in n8n:** `GEMINI_API_KEY`, `RESEND_API_KEY`, `CRON_SECRET`, `SITE_URL`

Import each JSON file via n8n → **Workflows → Import from file**.  
Set all workflows to **Active** after importing.

---

## Workflow Overview

| # | File | Trigger | Purpose | Status |
|---|------|---------|---------|--------|
| 01 | `01_idea_validation.json` | Webhook POST `/idea-validation` | Free idea analysis via Gemini → email result → callback to app | ✅ Import & activate |
| 02 | `02_daily_nudge_emails.json` | Schedule 7am daily (Brisbane) | Calls `/api/send-daily-nudge` to send personalised task emails | ✅ Import & activate |
| 03 | `03_error_notifications.json` | Error trigger (any workflow) | Catches failures, emails darrinmc1@yahoo.com with details + link | ✅ Import & activate |
| 04 | `04_ai_coach_nudge_on_demand.json` | Webhook POST `/coach-nudge` | On-demand AI coaching nudge triggered from dashboard "⚡ Nudge me" button | ✅ Import & activate |
| 05 | `05_weekly_progress_summary.json` | Schedule Sunday 8am (Brisbane) | Calls `/api/weekly-summary` to send weekly progress recap emails | ✅ Import & activate |
| 06 | `06_stripe_purchase_webhook.json` | Webhook POST `/stripe-webhook` | Receives Stripe checkout events → records purchase → sends confirmation email | ⏳ Activate when Stripe is live |

---

## Webhook URLs (after importing to n8n)

Copy these from n8n after import and add to `.env.local`:

```env
N8N_VALIDATION_WEBHOOK_URL=https://n8n-production-8ab4.up.railway.app/webhook/idea-validation
N8N_COACH_NUDGE_WEBHOOK_URL=https://n8n-production-8ab4.up.railway.app/webhook/coach-nudge
N8N_STRIPE_WEBHOOK_URL=https://n8n-production-8ab4.up.railway.app/webhook/stripe-webhook
```

---

## n8n Environment Variables

Set these in your n8n Railway instance under **Settings → Environment Variables**:

```
GEMINI_API_KEY=AIzaSyDRPBILbGPgxH_YRpxYUy18PKCccbXCOto
RESEND_API_KEY=re_JhE6N1S5_HJcZVGGWPDnj5eubvmFVVQEG
CRON_SECRET=yep-cron-secret-change-this-in-production
SITE_URL=https://yourexitplans.com
```

---

## Workflow Details

### 01 — Idea Validation
**Flow:** Website form → `/api/validate-idea` (creates Job) → n8n webhook → Google Trends + Reddit → Gemini AI → parse result → send email + callback to `/api/webhooks/job-result` (updates Job → saved to Google Sheets)

**Connected app routes:**
- `POST /api/validate-idea` — creates job, fires webhook
- `POST /api/webhooks/job-result` — receives result from n8n, saves to Sheets
- `GET /api/jobs/[id]` — client polls for result

---

### 02 — Daily Nudge Emails
**Flow:** Schedule 7am → `POST /api/send-daily-nudge` (x-cron-secret header) → sends personalised task emails via Resend → updates `lastNudgeSent` in DB

**Respects user preferences:** `nudgeFrequency` (daily/every_few_days/weekly/on_request), `coachingStyle`, `contentDepth`

---

### 03 — Error Notifications
**Flow:** Any workflow fails → extract error details → send HTML email to darrinmc1@yahoo.com with workflow name, failed node, error message, Brisbane timestamp, and direct link to the failed execution.

**Setup:** After importing, go to each other workflow's Settings → set "Error Workflow" to this workflow.

---

### 04 — AI Coach On-Demand Nudge
**Flow:** Dashboard "⚡ Nudge me" button → `POST /api/coach-nudge` → fires n8n webhook → Gemini generates personalised message (respects coachingStyle) → sends email

**Request types:** `check_in` | `motivation` | `unblocked`

---

### 05 — Weekly Progress Summary
**Flow:** Sunday 8am → `POST /api/weekly-summary` (x-cron-secret header) → for each active roadmap: calculates week stats, generates Gemini coach comment, sends weekly HTML email

**Email includes:** Tasks completed this week, tasks missed, next week preview, progress %, first sale target

---

### 06 — Stripe Purchase Webhook
**Flow:** Stripe sends `checkout.session.completed` → n8n responds 200 immediately → extracts purchase data → parallel: (a) notifies app at `/api/webhooks/stripe`, (b) sends purchase confirmation email to customer, (c) sends admin sale notification

**Setup when Stripe is ready:**
1. In Stripe Dashboard → Webhooks → add endpoint: `https://n8n-production-8ab4.up.railway.app/webhook/stripe-webhook`
2. Select events: `checkout.session.completed`, `payment_intent.succeeded`
3. Copy signing secret → add `STRIPE_WEBHOOK_SECRET` to `.env.local`

---

## Testing Workflows

### Test 01 (Idea Validation)
```bash
curl -X POST https://yourexitplans.com/api/validate-idea \
  -H "Content-Type: application/json" \
  -d '{"idea":"Dog walking app","email":"test@example.com","oneLiner":"Uber for dog walkers"}'
```

### Test 02 (Daily Nudge)
```bash
curl -X POST https://yourexitplans.com/api/send-daily-nudge \
  -H "x-cron-secret: yep-cron-secret-change-this-in-production"
```

### Test 04 (Coach Nudge — from dashboard ⚡ button or directly)
```bash
curl -X POST https://n8n-production-8ab4.up.railway.app/webhook/coach-nudge \
  -H "Content-Type: application/json" \
  -d '{"email":"darrinmc1@yahoo.com","userName":"Darrin","businessTitle":"YourExitPlans","currentDay":14,"progressPct":30,"coachingStyle":"direct","requestType":"check_in"}'
```

### Test 05 (Weekly Summary)
```bash
curl -X POST https://yourexitplans.com/api/weekly-summary \
  -H "x-cron-secret: yep-cron-secret-change-this-in-production"
```
