# 🧪 Test Purchase Page - Setup Instructions

## ✅ The page is ready at: `/test-purchase`

---

## 🚀 Quick Start:

### **Step 1: Restart Dev Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd C:\Users\Darrin\Desktop\YEPV4\YEPv3
npm run dev
```

### **Step 2: Open Test Page**
```
http://localhost:3000/test-purchase
```

### **Step 3: Fill in the Form**
- **Email**: darrinmc1@yahoo.com (or your email)
- **Product**: Choose "Research Report" or "Implementation Plan"
- **Idea ID**: Enter `1` (or any ID from Column A of your Google Sheet)

### **Step 4: Click "Test FREE Delivery"**

---

## 📊 What You'll See:

**Success Response:**
```json
{
  "success": true,
  "message": "Purchase completed successfully",
  "purchaseId": "...",
  "deliveryStatus": "sent"
}
```

**Then check:**
- 📧 Your email inbox for the PDF
- 📊 Google Sheets Purchases tab for the record
- 🖥️ Browser console (F12) for detailed logs

---

## 🧪 Test Checklist:

- [ ] Page loads at http://localhost:3000/test-purchase
- [ ] Can enter email and idea ID
- [ ] Can select product type
- [ ] Click button shows "Processing..."
- [ ] Success message appears
- [ ] Email arrives with PDF attached
- [ ] Purchase appears in Google Sheets
- [ ] Console shows AI validation results

---

## 🐛 If It Still Errors:

**Try this:**
```bash
# Clear everything and rebuild
cd C:\Users\Darrin\Desktop\YEPV4\YEPv3
rmdir /s /q .next
rmdir /s /q node_modules\.cache
npm run dev
```

---

**Ready to test!** 🚀

Open: http://localhost:3000/test-purchase
