# 🚨 EMERGENCY: Exposed API Keys Fix Guide

## ⚠️ **DANGER: Your API keys are public on GitHub!**

GitHub detected these exposed keys:
- `RESEND_API_KEY`: re_h4i4KPRs_L7gWmympxLqGf6dJqAcJvQMV
- `GOOGLE_GEMINI_API_KEY`: AIzaSyD5K3gy2BclR4rh_SCHitqxRpBX2jL7G4A

Anyone can use these keys right now! Follow these steps IMMEDIATELY:

---

## 🔥 **STEP 1: REVOKE OLD KEYS (DO THIS FIRST!)**

### **A. Revoke Resend Key:**
1. Go to: https://resend.com/api-keys
2. Login to your account
3. Find key: `re_h4i4KPRs_L7gWmympxLqGf6dJqAcJvQMV`
4. Click **Delete** or **Revoke**
5. ✅ Confirm deletion

### **B. Revoke Google/Gemini Key:**
1. Go to: https://aistudio.google.com/app/apikey
2. OR: https://console.cloud.google.com/apis/credentials
3. Find key: `AIzaSyD5K3gy2BclR4rh_SCHitqxRpBX2jL7G4A`
4. Click **Delete** or **Disable**
5. ✅ Confirm deletion

**Stop here and revoke both keys before continuing!**

---

## 🔑 **STEP 2: CREATE NEW KEYS**

### **A. Create New Resend Key:**
1. On https://resend.com/api-keys
2. Click **Create API Key**
3. Name: "YourExitPlans Production"
4. Copy the new key (you'll need it next)

### **B. Create New Gemini Key:**
1. On https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Copy the new key

---

## 📝 **STEP 3: UPDATE .env.local**

Open your `.env.local` file:
```bash
cd C:\Users\Darrin\Desktop\YEPV4\YEPv3
notepad .env.local
```

**Replace these lines with your NEW keys:**
```bash
# Resend (NEW KEY - paste here)
RESEND_API_KEY="re_YOUR_NEW_KEY_HERE"

# Google Gemini (NEW KEY - paste here)
GOOGLE_GEMINI_API_KEY="YOUR_NEW_GEMINI_KEY_HERE"
```

**Save and close.**

---

## 🗑️ **STEP 4: REMOVE KEYS FROM GIT HISTORY**

The old keys are still in your Git history. You need to remove them:

### **Option A: Simple Method (Recommended)**

Just delete the repo and start fresh:

```powershell
cd C:\Users\Darrin\Desktop\YEPV4\YEPv3

# Remove Git tracking
Remove-Item -Path .git -Recurse -Force

# Reinitialize
git init
git add .
git commit -m "Initial commit (clean - no API keys)"

# Push to GitHub (will need to force push)
git remote add origin YOUR_GITHUB_URL
git branch -M main
git push -u origin main --force
```

### **Option B: Advanced Method (Clean History)**

Run the PowerShell script I created:

```powershell
cd C:\Users\Darrin\Desktop\YEPV4\YEPv3
powershell -ExecutionPolicy Bypass -File remove-keys-from-git.ps1
```

**Warning:** This rewrites Git history!

---

## ✅ **STEP 5: VERIFY SECURITY**

### **Check 1: Keys Are Different**
```bash
# Old Resend key (should be REVOKED):
re_h4i4KPRs_L7gWmympxLqGf6dJqAcJvQMV

# New Resend key (should be DIFFERENT):
re_YOUR_NEW_KEY_HERE
```

### **Check 2: .env.local is Ignored**
```bash
git status
# Should NOT show .env.local
```

### **Check 3: No Keys in Git**
```bash
git log --all --full-history --source -- .env.local
# Should show "removed" or nothing
```

---

## 🛡️ **STEP 6: PREVENT FUTURE LEAKS**

### **A. Verify .gitignore**
Your `.gitignore` already has `.env*.local` ✅

### **B. Use git-secrets (Optional)**
```bash
# Install git-secrets to prevent committing secrets
# This will block commits that contain API keys
```

### **C. Double-check Before Pushing**
Always run before `git push`:
```bash
git status
git diff
# Make sure no .env files are staged!
```

---

## 🧪 **STEP 7: TEST WITH NEW KEYS**

```bash
# Restart your dev server
npm run dev

# Test a purchase
# Visit: http://localhost:3000/test-purchase
# Check if email sends with new Resend key
```

---

## 📋 **CHECKLIST:**

- [ ] Revoked old Resend key (re_h4i4KPRs...)
- [ ] Revoked old Gemini key (AIzaSyD5K3gy...)
- [ ] Created new Resend key
- [ ] Created new Gemini key
- [ ] Updated .env.local with new keys
- [ ] Removed .env.local from Git history
- [ ] Verified .env.local is in .gitignore
- [ ] Tested application with new keys
- [ ] No secrets in `git log`

---

## ⚠️ **IMPORTANT NOTES:**

1. **Never commit .env files** - they're in .gitignore for a reason!
2. **Check before pushing** - run `git status` and `git diff`
3. **Use environment variables** - keep secrets out of code
4. **Rotate keys regularly** - change them every 90 days
5. **Monitor usage** - check Resend/Google dashboards for unusual activity

---

## 🆘 **NEED HELP?**

If you're unsure about any step:
1. **FIRST**: Revoke the old keys (most important!)
2. **THEN**: Ask for help with the rest

**The old keys are public right now - revoke them ASAP!**

---

## 📚 **RESOURCES:**

- Resend Keys: https://resend.com/api-keys
- Google AI Studio: https://aistudio.google.com/app/apikey
- Git Secrets: https://git-secret.io/
- GitHub Security: https://docs.github.com/en/code-security

---

**Start with STEP 1 NOW - revoke those keys!** ⚠️
