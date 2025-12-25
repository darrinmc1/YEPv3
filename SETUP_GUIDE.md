# Complete Setup Guide - AI Workflow Integration

## 🎯 What You've Got

Your YourExitPlans app now has:

✅ **Component Structure** - Organized folders created
✅ **Google Sheets** - Database service ready
✅ **Ollama** - Free idea validation AI
✅ **Gemini** - Free idea matching AI
✅ **Perplexity** - Research & competitive analysis
✅ **API Routes** - Fully integrated endpoints

---

## 📋 Step-by-Step Setup

### **STEP 1: Install Dependencies**

```bash
cd C:\Users\Darrin\Desktop\YEPV4\YEPv3

# Install Google Sheets and AI dependencies
npm install googleapis @google/generative-ai

# If not already installed
npm install zod
```

### **STEP 2: Setup Google Sheets**

#### 2.1 Create Your Spreadsheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create **3 new spreadsheets** with these names:
   - `YEP_ValidatedIdeas`
   - `YEP_ExploreRequests`
   - `YEP_IdeasLibrary`

#### 2.2 Setup Headers

**Sheet: YEP_ValidatedIdeas (Tab: "validated_ideas")**
```
Row 1 (Headers):
A: timestamp
B: email
C: idea_name
D: one_liner
E: problem_solved
F: target_customer
G: business_type
H: industry
I: price_range
J: score
K: market_validation
L: quick_wins
M: red_flags
N: ai_model_used
O: processing_time
P: status
```

**Sheet: YEP_ExploreRequests (Tab: "explore_requests")**
```
Row 1 (Headers):
A: timestamp
B: email
C: interests
D: industry
E: budget
F: time_commitment
G: difficulty
H: skills
I: avoid_topics
J: matched_ideas_count
K: ideas_delivered
L: status
```

**Sheet: YEP_IdeasLibrary (Tab: "ideas_library")**
```
Row 1 (Headers):
A: idea_id
B: title
C: one_liner
D: industry
E: score
F: market_size
G: growth_rate
H: difficulty
I: time_to_first_sale
J: startup_cost
K: why_now
L: quick_insights
M: full_content_json
N: tags
O: target_budget
P: required_skills
Q: created_at
```

#### 2.3 Get Google Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "YourExitPlans"
3. Enable **Google Sheets API**
4. Go to **Credentials** → **Create Credentials** → **Service Account**
5. Create service account: `yourexitplans-service`
6. **Download JSON key** (keep it safe!)
7. **Copy the service account email** (looks like: `yourexitplans-service@project-id.iam.gserviceaccount.com`)

#### 2.4 Share Sheets with Service Account

1. Open each of your 3 spreadsheets
2. Click **Share**
3. Paste the **service account email**
4. Grant **Editor** access
5. Get the **Sheet ID** from URL (between `/d/` and `/edit`):
   ```
   https://docs.google.com/spreadsheets/d/THIS-IS-THE-SHEET-ID/edit
   ```

### **STEP 3: Setup Ollama (Local AI - FREE)**

#### Option A: Local Installation (Recommended)

1. Download Ollama: [ollama.ai](https://ollama.ai)
2. Install Ollama
3. Open terminal and pull a model:
   ```bash
   ollama pull llama3.1:8b
   # or
   ollama pull mistral
   ```
4. Test it:
   ```bash
   ollama run llama3.1:8b "Hello"
   ```
5. Ollama will run at `http://localhost:11434`

#### Option B: Cloud Hosting (If you can't run locally)

- Use [Modal](https://modal.com) or [Replicate](https://replicate.com)
- Get hosted Ollama URL
- Update `OLLAMA_BASE_URL` in .env

### **STEP 4: Setup Google Gemini (FREE)**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Get API Key**
3. Create API key
4. Copy the key (looks like: `AIza...`)
5. **Free tier**: 15 requests/minute, 1500/day (plenty for testing!)

### **STEP 5: Setup Perplexity (PAID - Optional)**

1. Go to [Perplexity](https://www.perplexity.ai/settings/api)
2. Create API key
3. Copy key
4. **Cost**: ~$0.002 per request with sonar-small model
5. **Budget**: Set $5-10 limit for testing

### **STEP 6: Create .env.local**

Create file: `C:\Users\Darrin\Desktop\YEPV4\YEPv3\.env.local`

```env
# ============================================
# GOOGLE SHEETS DATABASE
# ============================================
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_FROM_JSON\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="yourexitplans-service@project-id.iam.gserviceaccount.com"
GOOGLE_SHEET_ID_VALIDATED="your-validated-sheet-id"
GOOGLE_SHEET_ID_EXPLORE="your-explore-sheet-id"
GOOGLE_SHEET_ID_LIBRARY="your-library-sheet-id"

# ============================================
# OLLAMA (Local AI - FREE)
# ============================================
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1:8b"

# ============================================
# GOOGLE GEMINI (FREE TIER)
# ============================================
GOOGLE_GEMINI_API_KEY="AIza..."
GEMINI_MODEL="gemini-1.5-flash"

# ============================================
# PERPLEXITY (PAID - Optional)
# ============================================
# Leave empty to skip research enhancement
PERPLEXITY_API_KEY=""
PERPLEXITY_MODEL="llama-3.1-sonar-small-128k-online"

# ============================================
# RATE LIMITING
# ============================================
ENABLE_RATE_LIMITING=true
FREE_VALIDATIONS_PER_DAY=3
FREE_EXPLORATIONS_PER_DAY=5
USE_FREE_TIER=true
```

**IMPORTANT for private key:**
1. Open your downloaded JSON file
2. Find the `private_key` field
3. Copy the ENTIRE value including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
4. Replace `\n` with actual newlines OR keep as `\n` (both work)

### **STEP 7: Seed Ideas Library**

Create test ideas in your `YEP_IdeasLibrary` sheet:

```
Row 2 (Example idea):
idea-001 | AI Resume Optimizer | Help job seekers beat ATS | SaaS / Software | 85 | $4.2B | +23% | Intermediate | 4-6 weeks | $500 - $2,000 | AI tools mainstream, competitive job market | ["40M+ job seekers annually","Competitors overpriced","Can start with GPT MVP"] | {"locked":"content"} | ai,saas,jobs | medium | technical,marketing | 2025-01-15
```

Add at least 5-10 ideas to test matching.

### **STEP 8: Update Form Webhooks**

Update these files to use your new API routes:

**File: `components/idea-validation-form.tsx`**

Change line ~130:
```typescript
// OLD
const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

// NEW
const webhookUrl = '/api/validate-idea'
```

**File: `components/explore-ideas-form.tsx`**

Change line ~180:
```typescript
// OLD
const webhookUrl = process.env.NEXT_PUBLIC_N8N_EXPLORE_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

// NEW
const webhookUrl = '/api/explore-ideas'
```

### **STEP 9: Test Everything**

```bash
# Start dev server
npm run dev

# Open browser
http://localhost:3000
```

#### Test Validation Flow:
1. Go to `/validate-idea`
2. Fill in form
3. Submit
4. Check:
   - ✅ Ollama logs in terminal
   - ✅ Response appears
   - ✅ New row in Google Sheet

#### Test Explore Flow:
1. Go to `/explore-ideas`
2. Enter interests + filters
3. Submit
4. Check:
   - ✅ Gemini matching logs
   - ✅ Ideas returned
   - ✅ New row in Google Sheet

#### Test Health Check:
```bash
# Check all services
curl http://localhost:3000/api/validate-idea?check=health

# Should return:
{
  "status": "ok",
  "services": {
    "ollama": true,
    "perplexity": false,  # if not configured
    "sheets": true
  }
}
```

---

## 🔧 Troubleshooting

### Ollama Not Working

**Error: "ECONNREFUSED"**
```bash
# Check if Ollama is running
ollama serve

# Check available models
ollama list

# Pull model if missing
ollama pull llama3.1:8b
```

### Google Sheets Error

**Error: "Unable to authenticate"**
- Check private key has `\n` properly formatted
- Verify service account email is exact
- Confirm sheets are shared with service account

**Error: "Requested entity was not found"**
- Double-check Sheet IDs in .env
- Verify tab names match exactly: `validated_ideas`, `explore_requests`, `ideas_library`

### Gemini Rate Limit

**Error: 429 Too Many Requests**
- Free tier: 15/min, 1500/day
- Add delays between requests
- Cache results

### Import Errors

**Error: "Cannot find module"**
```bash
# Re-install dependencies
npm install

# Check tsconfig.json has correct paths
# Should have: "@/*": ["./*"]
```

---

## 📊 Monitoring & Analytics

### Check Usage

**Ollama:**
```bash
# See which models are loaded
ollama ps

# Check model info
ollama show llama3.1:8b
```

**Gemini:**
- Dashboard: https://makersuite.google.com
- See API usage and quotas

**Perplexity:**
- Dashboard: https://www.perplexity.ai/settings/api
- Monitor costs

**Google Sheets:**
- Open each sheet to see real-time data
- Use filters to analyze patterns

---

## 🚀 Next Steps

### 1. Component Restructuring
   - Follow `RESTRUCTURING_GUIDE.md`
   - Move components to new folders
   - Update imports

### 2. Add More Ideas
   - Research 50-100 business ideas
   - Add to ideas library sheet
   - Include detailed metadata

### 3. Email Integration
   - Setup SendGrid or Resend
   - Send validation results via email
   - Weekly idea newsletter

### 4. Upgrade Path
   - When you get subscribers
   - Move to PostgreSQL or Supabase
   - Keep Google Sheets for analytics

### 5. Testing
   - Add rate limiting tests
   - Test with multiple users
   - Verify data accuracy

---

## 💡 Cost Estimates

**Current Setup (Free Tier):**
- Ollama: $0 (local)
- Gemini: $0 (1500 requests/day)
- Google Sheets: $0
- **TOTAL**: $0/month

**With Perplexity (Optional):**
- Perplexity: ~$0.002/request
- 100 requests = $0.20
- 1000 requests = $2.00
- **TOTAL**: ~$5-10/month for testing

**When You Scale:**
- Consider Claude API
- Upgrade to Supabase
- Add caching layer

---

## ✅ Checklist

Before going live:

- [ ] All 3 Google Sheets created with headers
- [ ] Service account created and sheets shared
- [ ] .env.local configured with all credentials
- [ ] Ollama installed and model pulled
- [ ] Gemini API key obtained
- [ ] Dependencies installed (`npm install`)
- [ ] Form webhooks updated to new API routes
- [ ] Test validation flow works
- [ ] Test explore flow works
- [ ] Health check returns OK
- [ ] Ideas library seeded with 5+ ideas
- [ ] Rate limiting tested
- [ ] Data appears in Google Sheets

---

## 🆘 Need Help?

Common issues and fixes in `TROUBLESHOOTING.md` (create this if needed)

Next: Follow `RESTRUCTURING_GUIDE.md` to organize your components!
