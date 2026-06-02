# CircleSphere - Windows Setup Guide

## 🚀 Windows पर CircleSphere Setup करें

**Important:** Windows पर PowerShell की जगह **Command Prompt (CMD)** use करें।

---

## Step 1: Command Prompt खोलें

### Method 1: Search से
1. Windows key दबाएं
2. "cmd" या "Command Prompt" type करें
3. **Command Prompt** पर click करें (PowerShell नहीं!)

### Method 2: Folder में
1. CircleSphere folder खोलें
2. Address bar में click करें
3. "cmd" type करें और Enter दबाएं

---

## Step 2: Install करें

Command Prompt में type करें:

```cmd
npm install
```

**यह करेगा:**
- सभी required packages download करेगा (22 packages)
- 2-3 minutes लगेंगे
- Internet connection चाहिए

---

## Step 3: MongoDB Setup करें

### Option A: MongoDB Atlas (Cloud - Recommended)

**Easiest option - कोई installation नहीं चाहिए!**

1. **Create Account:**
   - जाएं: https://www.mongodb.com/cloud/atlas/register
   - Sign up करें (free)

2. **Create Cluster:**
   - "Create Cluster" click करें
   - "Shared" (FREE) select करें
   - "Create" click करें (2-3 minutes wait)

3. **Create Database User:**
   - Left menu में "Database Access" click करें
   - "Add New Database User" click करें
   - Username: `circlesphere`
   - Password: `password123`
   - "Add User" click करें

4. **Network Access:**
   - Left menu में "Network Access" click करें
   - "Add IP Address" click करें
   - "Allow Access from Anywhere" click करें
   - "0.0.0.0/0" confirm करें

5. **Get Connection String:**
   - "Database" पर जाएं
   - "Connect" button click करें
   - "Connect your application" select करें
   - Connection string copy करें

6. **Update .env File:**
   - CircleSphere folder में `.env` file खोलें
   - इस line को बदलें:
   ```
   MONGODB_URI=mongodb://localhost:27017/circlesphere
   ```
   - नई line (अपना connection string paste करें):
   ```
   MONGODB_URI=mongodb+srv://circlesphere:password123@cluster0.xxxxx.mongodb.net/circlesphere
   ```
   - `<password>` को अपने password से replace करें
   - Save करें (Ctrl+S)

### Option B: Local MongoDB (Advanced Users)

1. Download: https://www.mongodb.com/try/download/community
2. Windows installer (.msi) download करें
3. Install करें (सभी default options रखें)
4. MongoDB service automatically start हो जाएगी

---

## Step 4: Sample Data Add करें

Command Prompt में:

```cmd
npm run seed
```

**Sample Login Credentials:**
```
Email: john@example.com
Password: password123
```

---

## Step 5: Server Start करें

Command Prompt में:

```cmd
npm start
```

**Success Message दिखना चाहिए:**
```
✓ MongoDB Connected
✓ Server listening on port 3000
```

---

## Step 6: Browser में खोलें

```
http://localhost:3000
```

**CircleSphere landing page दिखना चाहिए!** 🎉

---

## 🔧 Common Problems & Solutions

### Problem 1: "npm command not found"
**Solution:** Node.js install करें: https://nodejs.org/

### Problem 2: "Cannot connect to MongoDB"
**Solution:** Check internet connection और .env file में connection string verify करें

### Problem 3: "Port 3000 already in use"
**Solution:** `.env` file में PORT=5000 करें

### Problem 4: PowerShell में script error
**Solution:** Command Prompt (CMD) use करें

---

## 📱 Features Test करें

- ✅ Register account
- ✅ Create Post
- ✅ Like Post
- ✅ Add Comment
- ✅ Follow User
- ✅ Edit Profile

---

**CircleSphere ab ready hai!** 🌐

**Connect. Share. Belong.**
