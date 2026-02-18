# Test Report — YourExitPlans
**Date:** 2026-02-18
**Live:** https://yourexitplans.com
**Tested by:** Claude Agent 1 (code inspection + live API testing)

---

## CONNECTION STATUS

| Service | Status | Response | Notes |
|---|---|---|---|
| n8n healthz | ✅ OK | `{"status":"ok"}` | Railway instance alive |
| n8n webhook `/webhook/idea-validation` | ✅ OK | Returns JSON with `marketValidation.score` | Responds with 200, returns analysis |
| Google Sheets (live) | ❌ FAIL | `sheets: false` | Credentials missing from Vercel env vars |
| `/api/explore-ideas` (live) | ❌ FAIL | 500 Internal Server Error | Sheets connection fails, returns `{"error":"Unable to fetch stats"}` |
| `/api/validate-idea` (live) | ❌ FAIL | 500 server_error | Returns `"Failed to validate idea"` — likely N8N_WEBHOOK_URL env var missing (no NEXT_PUBLIC_ prefix used server-side, but the server-side var may not be set in Vercel) |
| `/api/test-pdf` | ✅ OK | 200 | PDF endpoint accessible |
| Resend email | ⚠️ UNKNOWN | Not tested directly | API key is configured in CLAUDE.md |

---

## CRITICAL (blocks users)

1. **Google Sheets disconnected on live site** | `/explore-ideas`, `/api/explore-ideas` | Visit `/explore-ideas` → ideas fail to load | `sheets: false` in health check, 500 error on the main API endpoint. The explore ideas page cannot display any ideas. Root cause: `GOOGLE_SHEETS_PRIVATE_KEY` or `GOOGLE_SHEETS_CLIENT_EMAIL` is missing/wrong in Vercel dashboard env vars.

2. **Validate Idea returns 500 on live** | `/validate-idea` | Fill out 3-step form → submit → 500 error | Returns `{"success":false,"error":"server_error","message":"Failed to validate idea."}`. Root cause: `N8N_WEBHOOK_URL` (server-side var, no NEXT_PUBLIC_ prefix) is likely missing from Vercel, even though the n8n webhook itself is alive.

3. **`/pricing` page does not exist** | `/faq` (Q14 links to `/pricing`), nav header Pricing dropdown also links to `#pricing` anchor | Click "choose your tier" in FAQ → 404 | There is no `/pricing` page. The FAQ sends users to this page to buy, making the purchase funnel broken.

4. **`/contact` page does not exist** | `/faq` (Q15 links to `/contact`) | Click "Contact us" in FAQ → 404 | Users with questions have no way to contact support from the FAQ page.

5. **Hardcoded placeholder Stripe link** | `/implementation` | Click "Buy Now" button on the $97 offer | `href="YOUR_STRIPE_LINK_HERE"` is literally rendered as a broken URL. The page looks finished but the button does nothing useful. (`app/implementation/page.tsx:14`)

6. **`/terms-and-conditions` returns 404 on live** | Footer links | Click T&C link | Page exists in code (`app/terms-and-conditions/page.tsx`) but returns 404 on the live site. Likely a Vercel deploy/build issue — may not have been included in the last deploy.

---

## HIGH (needs fix before launch)

7. **`/About` — wrong casing in nav link** | Site header | Visit any page, click About in nav | `href="/About"` uses capital A (`components/site-header.tsx:17`). On case-sensitive servers (Linux/Vercel) this causes a 404. The actual route is `/about`. Currently the live server happens to return 200 (likely case-insensitive redirect), but this is fragile.

8. **`/about` — white background on a dark-theme site** | `/about` | Visit `/about` after any other page | The entire about page uses `bg-white` and blue text while every other page is `bg-[#0a0a0a]` dark. Looks like a different website entirely. (`app/about/page.tsx:10`)

9. **`/t&c` broken links to `/revisions`** | `/t&c` | Click any "request revisions" style link in T&C | Links to `/revisions` which returns 404. The URL-encoded path `/t%26c` returns 200 but `/revisions` does not exist.

10. **Nav "How It Works" links to `#features` anchor** | All pages | Click "How It Works" in nav from any non-homepage page | `href="#features"` is a hash anchor that only works on the homepage. From `/validate-idea`, `/faq`, etc., this link scrolls nowhere meaningful.

11. **Pricing dropdown links `#pricing` anchor — not a real page** | All pages | Hover Pricing in nav → click "Ideas Stream" or "Implementation" | Both links go to `href="#pricing"` hash anchor, not actual pricing pages. Users expect to see pricing but get scrolled (or nothing happens on non-homepage pages).

12. **Admin auth is cookie-text only — easily bypassed** | `/admin` | Open browser DevTools, set cookie `admin-session=authenticated` | The auth check only looks for a cookie containing the text "authenticated". No JWT signature, no expiry. Anyone who knows this can access the admin dashboard. (`app/admin/page.tsx`)

13. **Validate idea form field names mismatch** | `/validate-idea` | Submit the form | The API expects fields `ideaName`, `oneLiner`, `problemSolved`, `targetCustomer`, `businessType`, `priceRange` but the CLAUDE.md and some docs reference different field names. Zod validation is active and returning clear errors (400 with validation details), which is good, but confirms field name alignment needs checking between the form component and API.

14. **`/api/explore-ideas` rate limiting disabled by default** | `/api/explore-ideas` | Send repeated POST requests | Rate limiting only activates if `ENABLE_RATE_LIMITING=true` env var is set. Default is open — anyone can spam the endpoint. (`app/api/explore-ideas/route.ts:80`)

15. **`terms-and-conditions` page uses wrong email** | `/t&c`, `/terms-and-conditions` | View the contact email in T&C | References `hello@theYourExitPlans.com` — note the `the` prefix which doesn't match the actual domain `yourexitplans.com`. Also `support@theYourExitPlans.com` in admin login. These emails likely don't exist.

---

## LOW (nice to fix)

16. **`/about` unverified statistics** | `/about` | View "The Numbers That Matter" section | Claims "82% completion rate" vs industry 5-10%, and specific hour savings figures. No source or disclaimer. Could be a trust/credibility issue.

17. **Pricing page copy in FAQ doesn't match checkout reality** | `/faq` | Read tier pricing | FAQ lists Starter at "$99 one-time or $25/mo", Silver at "$198/$50/mo", Gold at "$297/$75/mo", Platinum "$999 for 6 months or $199/mo". These don't match CLAUDE.md monetization ($9, $29, $49, $99 one-time + subscriptions). Inconsistent messaging.

18. **`/explore-ideas` "100+hrs Research Per Idea" claim** | `/explore-ideas` | View trust indicators | Hardcoded marketing claim with no verification mechanism. If the business evolves, this requires a code change.

19. **Console debug output in production** | `/api/explore-ideas` | Check server logs | Multiple `console.log` with emoji throughout the route. Clutters production logs.

20. **Debug/test pages publicly accessible** | `/debug-ideas`, `/test-purchase` | Visit these URLs | These developer pages are live on the production site. Not a security issue but unprofessional for real users who discover them.

---

## PASSING

- Homepage (`/`) loads correctly | HTTP 200, renders dual-path hero
- `/explore-ideas` page renders | HTTP 200 (page loads, but ideas grid fails due to Sheets being disconnected)
- `/validate-idea` page renders | HTTP 200 (3-step form loads and displays correctly)
- `/checkout` page renders | HTTP 200
- `/about` page renders | HTTP 200
- `/faq` page renders | HTTP 200
- `/implementation` page renders | HTTP 200 (content shows, Buy Now button broken)
- `/admin` redirects to login | HTTP 307 redirect for unauthenticated users
- `/admin/login` renders | HTTP 200
- `/waitlist` renders | HTTP 200
- `/templates` renders | HTTP 200
- `/ideas-stream` renders | HTTP 200
- `/login` renders | HTTP 200
- n8n is alive | healthz returns `{"status":"ok"}`
- n8n webhook responds | Returns JSON with `marketValidation.score` field
- PDF test endpoint accessible | HTTP 200
- Site header / nav renders on all pages
- Mobile hamburger menu present in markup
- No Lorem ipsum placeholder text found anywhere
- SEO metadata present on all major pages (title, description, OG tags)
- Dark theme consistent across most pages (except /about)
- Google Analytics (G-4YSQPT6D0J) tag present

---

## SUMMARY SCORECARD

| Area | Status |
|---|---|
| Homepage | ✅ Loads |
| Idea exploration | ❌ Broken (Sheets disconnected) |
| Idea validation form | ❌ Broken (500 on submit) |
| PDF generation | ✅ Working |
| Checkout / payment | ❌ Not integrated (WhatsApp only) |
| Admin dashboard | ⚠️ Auth is weak |
| Navigation links | ❌ Multiple 404s (/pricing, /contact, /revisions) |
| Live connections | ❌ Google Sheets down on production |
| Code quality | ⚠️ Placeholder links, inconsistent theme |

**Launch readiness: NOT READY** — 6 critical issues must be resolved first.
