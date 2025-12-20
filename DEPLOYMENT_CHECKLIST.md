# Production Deployment Checklist

## ✅ Completed - Rate Limiting Fix

- [x] Install Upstash Redis packages
- [x] Create centralized rate limiting utility
- [x] Update API routes with Redis-based rate limiting
- [x] Add environment variable configuration
- [x] Create comprehensive documentation
- [x] Verify build passes

---

## 🔴 Critical - Do Before Production Launch

### 1. Setup Upstash Redis (5 minutes)
- [ ] Create account at https://console.upstash.com/
- [ ] Create new Redis database
- [ ] Copy `UPSTASH_REDIS_REST_URL`
- [ ] Copy `UPSTASH_REDIS_REST_TOKEN`
- [ ] Add to Vercel environment variables
- [ ] Test locally with `.env.local`

**Guide:** See [RATE_LIMITING_GUIDE.md](RATE_LIMITING_GUIDE.md#setup-instructions)

### 2. Fix Database (SQLite → PostgreSQL)
- [ ] Create database on Vercel Postgres, Supabase, or Neon
- [ ] Update `prisma/schema.prisma` datasource
- [ ] Run migrations: `npx prisma migrate dev`
- [ ] Update `DATABASE_URL` in environment variables
- [ ] Test database connection

**Why:** SQLite doesn't work on Vercel (ephemeral file system)

### 3. Fix Admin Authentication
- [ ] Review `middleware.ts` admin auth logic
- [ ] Implement proper password hashing (bcrypt)
- [ ] Add session expiration
- [ ] Use NextAuth properly or implement JWT
- [ ] Remove hardcoded "authenticated" cookie check

**Why:** Current admin auth is insecure (static cookie value)

### 4. Environment Variables Audit
- [ ] Review all `.env.example` variables
- [ ] Ensure all secrets are in Vercel (not in code)
- [ ] Verify `NEXTAUTH_SECRET` is strong random string
- [ ] Check `N8N_WEBHOOK_URL` is set
- [ ] Confirm email settings for production SMTP

---

## 🟡 High Priority - Do Soon

### 5. Complete Admin Dashboard Refactoring
- [ ] Extract PricingPage component (lines 837-1027 from original)
- [ ] Extract OrdersPage component (lines 1029-1362)
- [ ] Extract SettingsPage component (lines 1439-1552)
- [ ] Test refactored dashboard thoroughly
- [ ] Replace `page.tsx` with `page-refactored.tsx`

**Status:** 60% complete - excellent work so far!
**Guide:** See [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)

### 6. Add Error Monitoring
- [ ] Sign up for Sentry.io (free tier)
- [ ] Install `@sentry/nextjs`
- [ ] Add to `next.config.js`
- [ ] Configure error boundaries
- [ ] Test error reporting

### 7. Add Testing
- [ ] Install Vitest + Testing Library
- [ ] Write tests for rate limiting hooks
- [ ] Test admin dashboard components
- [ ] Add E2E tests for critical flows
- [ ] Set up CI/CD testing

---

## 🟢 Medium Priority - Nice to Have

### 8. Security Hardening
- [ ] Add proper Content Security Policy headers
- [ ] Implement CSRF protection for forms
- [ ] Add request signing for webhooks
- [ ] Set up security headers audit
- [ ] Review OWASP Top 10 vulnerabilities

### 9. Performance Optimization
- [ ] Run Lighthouse audit
- [ ] Optimize images (use Next.js Image component everywhere)
- [ ] Analyze bundle size (`npm run build`)
- [ ] Consider code splitting for large components
- [ ] Test plasma background performance impact

### 10. Git Cleanup
- [ ] Commit staged changes (`.claude/settings.local.json`)
- [ ] Review `.gitignore` (ensure no secrets committed)
- [ ] Clean up old backup files
- [ ] Add pre-commit hooks (Husky)

---

## Pre-Launch Verification

### Final Checks Before Going Live
- [ ] All environment variables set in Vercel
- [ ] Database migrated and tested
- [ ] Rate limiting working (test with curl)
- [ ] Admin authentication secure
- [ ] Error monitoring active
- [ ] All forms tested (idea validation, login)
- [ ] Mobile responsive design verified
- [ ] SEO meta tags reviewed
- [ ] Analytics tracking confirmed
- [ ] Backup strategy in place

### Post-Launch Monitoring (First 24 Hours)
- [ ] Monitor Vercel Analytics
- [ ] Check Upstash Redis analytics
- [ ] Review error logs in Sentry
- [ ] Test all critical user flows
- [ ] Monitor rate limit hits
- [ ] Check database performance
- [ ] Verify email delivery

---

## Prioritized Timeline

### This Week (Critical)
1. Setup Upstash Redis (5 min)
2. Migrate to PostgreSQL (2 hours)
3. Fix admin authentication (3 hours)
4. Test everything (1 hour)

### Next Week (Important)
5. Complete admin refactoring (4 hours)
6. Add error monitoring (1 hour)
7. Security audit (2 hours)

### Following Week (Polish)
8. Add testing infrastructure (4 hours)
9. Performance optimization (2 hours)
10. Final pre-launch checks (2 hours)

---

## Quick Reference

### Most Critical Issues (Fix First)
1. **Rate Limiting** - ✅ FIXED
2. **Database** - ❌ Still on SQLite
3. **Admin Auth** - ❌ Still insecure

### Documentation
- Rate limiting: [RATE_LIMITING_GUIDE.md](RATE_LIMITING_GUIDE.md)
- Rate limit summary: [RATE_LIMITING_SUMMARY.md](RATE_LIMITING_SUMMARY.md)
- Admin refactoring: [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)
- Architecture: [app/admin/ARCHITECTURE.md](app/admin/ARCHITECTURE.md)

### Support
- GitHub: https://github.com/darrinmc1/YEPv3
- Upstash: https://console.upstash.com/
- Vercel: https://vercel.com/dashboard

---

**Last Updated:** December 20, 2025
**Next Major Milestone:** PostgreSQL Migration + Admin Auth Fix
