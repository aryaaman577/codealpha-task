# CircleSphere - Installation Guide

## Prerequisites Verification

### 1. Check Node.js Installation
```bash
node --version
```
Should display: v14.0.0 or higher (✓ You have v24.16.0)

### 2. Check npm Installation
```bash
npm --version
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
Download and install MongoDB Community Server:
- Windows: https://www.mongodb.com/try/download/community
- Run MongoDB service after installation

#### Option B: MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster
3. Get connection string
4. Update MONGODB_URI in .env file

---

## Installation Steps

### Step 1: Install Dependencies

**For Windows PowerShell (if script execution is disabled):**

Option 1 - Use Command Prompt instead:
```cmd
cd CircleSphere
npm install
```

Option 2 - Enable PowerShell scripts (Run as Administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then run:
```powershell
npm install
```

**For macOS/Linux:**
```bash
npm install
```

### Step 2: Configure Environment

The `.env` file is already created with default values.

**Important**: Update these values in `.env`:
```env
# Change these for production
JWT_SECRET=your_unique_secret_key_here
SESSION_SECRET=your_unique_session_key_here

# Update MongoDB connection
MONGODB_URI=mongodb://localhost:27017/circlesphere
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/circlesphere
```

### Step 3: Start MongoDB

**Windows:**
- MongoDB should start automatically as a service
- Or manually: `"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"`

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 4: Seed Database (Optional)

```bash
npm run seed
```

This creates 5 sample users with sample data.

**Login with:**
- Email: `john@example.com`
- Password: `password123`

(Or any of the other 4 sample accounts listed in README.md)

### Step 5: Start the Application

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### Step 6: Access the Application

Open your browser:
```
http://localhost:3000
```

You should see the CircleSphere landing page!

---

## Troubleshooting

### Issue: "Cannot find module"
**Solution:**
```bash
npm install
```

### Issue: "MongoDB connection error"
**Solution:**
1. Verify MongoDB is running
2. Check MONGODB_URI in .env file
3. Test connection: Open MongoDB Compass and connect to your URI

### Issue: "Port 3000 is already in use"
**Solution:**
1. Change PORT in .env to another port (e.g., 5000)
2. Or kill the process using port 3000:
   - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
   - macOS/Linux: `lsof -ti:3000 | xargs kill`

### Issue: "npm command not found" or "scripts disabled"
**Solution:**

Windows - Use Command Prompt (cmd) instead of PowerShell:
1. Open Command Prompt
2. Navigate to project: `cd path\to\CircleSphere`
3. Run: `npm install`

Or enable PowerShell scripts (as Administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: "Cloudinary errors"
**Solution:**
Image uploads are optional. Leave Cloudinary credentials as "demo" in .env.
Or sign up for free at https://cloudinary.com and add your credentials.

---

## Verification Checklist

After installation, verify everything works:

- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Landing page displays correctly
- [ ] Can register a new account
- [ ] Can login with credentials
- [ ] Can create a post
- [ ] Can view feed
- [ ] Can view profile
- [ ] MongoDB is storing data

---

## Quick Start (After Installation)

```bash
# Start MongoDB (if not running)
mongod

# In another terminal/command prompt
cd CircleSphere
npm start

# Open browser to http://localhost:3000
```

---

## For CodeAlpha Submission

1. ✅ Complete installation following this guide
2. ✅ Run `npm run seed` to populate sample data
3. ✅ Test all features (register, login, post, comment, like, follow)
4. ✅ Take screenshots for documentation
5. ✅ Verify MongoDB has all required collections
6. ✅ Push to GitHub repository

---

## MongoDB Collections Verification

After running the application, verify these collections exist:

```bash
# Connect to MongoDB
mongosh

# Switch to database
use circlesphere

# Show collections
show collections

# Should display:
# - users
# - profiles
# - posts
# - comments
# - follows
```

---

## Support Resources

- **MongoDB Installation**: https://docs.mongodb.com/manual/installation/
- **Node.js**: https://nodejs.org/en/download/
- **npm Documentation**: https://docs.npmjs.com/
- **Git**: https://git-scm.com/downloads

---

## Next Steps

1. Explore the application features
2. Customize the design in `public/css/style.css`
3. Add your own features
4. Deploy to production (Heroku, Railway, Render, etc.)

---

**Need Help?**

Check the main README.md for:
- Feature documentation
- API endpoints
- Database schema
- Project structure
