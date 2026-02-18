# AI Workflow Integration Guide

## Overview

This guide sets up your YourExitPlans app with:
- **Google Sheets** as database (until you get subscribers)
- **Ollama** for free idea validation (local/self-hosted)
- **Google Gemini** for free explore ideas (Google's free tier)
- **Perplexity** for research and competitive analysis

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Request                         │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   Validate Idea          Explore Ideas
        │                       │
        ▼                       ▼
   [Ollama]              [Gemini Pro]
   Local/Free            Free Tier
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
            [Perplexity API]
            (Research & Analysis)
                    │
                    ▼
           [Google Sheets DB]
           Store & Track
```

## Setup Steps

### 1. Google Sheets Setup

#### Create Sheets Structure

**Sheet 1: "validated_ideas"**
```
A: timestamp | B: email | C: idea_name | D: one_liner | E: problem_solved 
F: target_customer | G: business_type | H: industry | I: price_range
J: score | K: market_validation | L: quick_wins | M: red_flags
N: ai_model_used | O: processing_time | P: status
```

**Sheet 2: "explore_requests"**
```
A: timestamp | B: email | C: interests | D: industry | E: budget
F: time_commitment | G: difficulty | H: skills | I: avoid_topics
J: matched_ideas_count | K: ideas_delivered | L: status
```

**Sheet 3: "ideas_library"**
```
A: idea_id | B: title | C: one_liner | D: industry | E: score
F: market_size | G: growth_rate | H: difficulty | I: time_to_first_sale
J: startup_cost | K: why_now | L: quick_insights | M: full_content_json
N: tags | O: target_budget | P: required_skills | Q: created_at
```

#### Get Google Sheets API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project "YourExitPlans"
3. Enable Google Sheets API
4. Create Service Account
5. Download JSON credentials
6. Share your sheets with the service account email

### 2. Install Dependencies

```bash
npm install @google-cloud/sheets googleapis
npm install @anthropic-ai/sdk openai  # For Gemini and Perplexity
npm install zod  # Already installed, for validation
```

### 3. Environment Variables

Add to `.env.local`:

```env
# Google Sheets
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="yourexitplans@project-id.iam.gserviceaccount.com"
GOOGLE_SHEET_ID_VALIDATED="your-validated-ideas-sheet-id"
GOOGLE_SHEET_ID_EXPLORE="your-explore-requests-sheet-id"
GOOGLE_SHEET_ID_LIBRARY="your-ideas-library-sheet-id"

# Ollama (Local - no key needed if self-hosted)
OLLAMA_BASE_URL="http://localhost:11434"  # or your hosted URL
OLLAMA_MODEL="llama3.1:8b"  # or llama2, mistral, etc.

# Google Gemini (Free Tier)
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-1.5-flash"  # Free tier model

# Perplexity
PERPLEXITY_API_KEY="your-perplexity-api-key"
PERPLEXITY_MODEL="llama-3.1-sonar-small-128k-online"  # Most cost-effective

# Feature Flags
USE_FREE_TIER=true  # Set to false when ready to upgrade
ENABLE_RATE_LIMITING=true
FREE_VALIDATIONS_PER_DAY=3
FREE_EXPLORATIONS_PER_DAY=5
```

### 4. Create Service Files

Create these files in order:

---

## File 1: Google Sheets Service

**`lib/services/google-sheets.ts`**

This handles all database operations.
