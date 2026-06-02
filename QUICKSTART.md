# CircleSphere - Quick Start Guide

## ⚡ 5-Minute Setup

Follow these steps to get CircleSphere running on your local machine.

---

## Prerequisites

✅ **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
✅ **MongoDB** - [Download](https://www.mongodb.com/try/download/community) OR use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)
✅ **Git** (optional) - [Download](https://git-scm.com/)

---

## Step 1: Get the Code

### Option A: Clone from GitHub (if available)
```bash
git clone <your-repository-url>
cd CircleSphere
```

### Option B: Download ZIP
1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal/command prompt in the folder

---

## Step 2: Install Dependencies

### Windows (Command Prompt - Recommended)
```cmd
npm install
```

### macOS/Linux
```bash
npm install
```

**What this does:** Installs all required Node.js packages (~22 dependencies)

**Expected output:**
```
added 150+ packages in 30s
```

---

## Step 3: Setup Database

### Option A: Local MongoDB (Faster for development)

**Windows:**
1. Install MongoDB Community Server
2. MongoDB should start automatically
3. Default connection: `mongodb://localhost:27017`

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud - No installation needed)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a free cluster (M0)
4. Create database user
5. Allow access from anywhere (0.0.0.0/0)
6. Get connection string
7. Update `.env` file with your connection string

---

## Step 4: Configure Environment

The `.env` file is already created with working defaults.

**For MongoDB Atlas users only:** Update this line in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/circlesphere
```

**Everything else works as-is for local development!**

---

## Step 5: Seed Sample Data (Optional but Recommended)

```bash
npm run seed
```

**What this does:** Creates 5 sample users with posts, comments, and follows

**Sample Login Credentials:**
```
Email: john@example.com
Password: password123

Email: jane@example.com
Password: password123
```

---

## Step 6: Start the Server

```bash
npm start
```

**Expected output:**
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║             🌐  CircleSphere Server                   ║
║         Connect. Share. Belong.                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

✓ MongoDB Connected: localhost
✓ Database Name: circlesphere
✓ Server running in development mode
✓ Server listening on port 3000
✓ Server URL: http://localhost:3000
```

---

## Step 7: Open in Browser

Navigate to:
```
http://localhost:3000
```

You should see the CircleSphere landing page! 🎉

---

## What to Do Next

### First Time User:

1. **Register Account**
   - Click "Get Started" or "Sign Up"
   - Enter username, email, password
   - Submit registration

2. **Explore Feed**
   - View home feed
   - See suggested users

3. **Create First Post**
   - Click "Create Post"
   - Write something
   - Optional: add image
   - Submit

4. **Interact**
   - Like posts
   - Comment on posts
   - Follow users
   - Search for people

### Using Sample Data:

1. **Login with sample account:**
   - Email: `john@example.com`
   - Password: `password123`

2. **Explore existing content:**
   - View feed with sample posts
   - See sample user profiles
   - Test all features

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Seed sample data
npm run seed

# Start server (production mode)
npm start

# Start server (development mode with auto-restart)
npm run dev

# Check if MongoDB is running (Windows)
tasklist | findstr mongod

# Check if MongoDB is running (macOS/Linux)
ps aux | grep mongod
```

---

## Common Issues & Fixes

### Issue: "npm command not found"
**Fix:** Install Node.js from nodejs.org

### Issue: "Scripts disabled" (Windows PowerShell)
**Fix:** Use Command Prompt instead
```cmd
cd path\to\CircleSphere
npm install
```

### Issue: "MongoDB connection failed"
**Fix:**
1. Check MongoDB is running: `mongod --version`
2. Start MongoDB service
3. Verify MONGODB_URI in .env

### Issue: "Port 3000 already in use"
**Fix:**
1. Change PORT in .env to 5000
2. Or stop process using port 3000

### Issue: "Cannot find module"
**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Development Tips

### Auto-Restart on File Changes

Install nodemon globally (optional):
```bash
npm install -g nodemon
```

Then use:
```bash
npm run dev
```

### View Database Content

#### Option 1: MongoDB Compass (GUI)
- Download: https://www.mongodb.com/try/download/compass
- Connect to: `mongodb://localhost:27017`
- View collections: users, profiles, posts, etc.

#### Option 2: Command Line
```bash
mongosh
use circlesphere
show collections
db.users.find().pretty()
```

### Check Server Status

Server is running when you see:
```
✓ Server listening on port 3000
```

Stop server: `Ctrl + C`

---

## Testing Checklist

Verify everything works:

- [ ] Landing page loads
- [ ] Can register new account
- [ ] Can login
- [ ] Feed displays
- [ ] Can create post
- [ ] Can like post
- [ ] Can comment
- [ ] Can follow user
- [ ] Can view profile
- [ ] Can edit profile
- [ ] Can search
- [ ] Dashboard displays

---

## File Structure Quick Reference

```
CircleSphere/
├── server.js           ← Start here (entry point)
├── app.js              ← Express app configuration
├── package.json        ← Dependencies
├── .env                ← Environment variables
├── models/             ← Database schemas
├── controllers/        ← Business logic
├── routes/             ← API endpoints
├── views/              ← EJS templates
├── public/             ← CSS, JS, images
└── README.md           ← Full documentation
```

---

## Folder Tour

### Backend Files
- `server.js` - Server startup
- `app.js` - Express configuration
- `models/` - Database models
- `controllers/` - Route handlers
- `routes/` - URL endpoints
- `middleware/` - Auth & validation

### Frontend Files
- `views/` - EJS templates
- `public/css/` - Stylesheets
- `public/js/` - Client scripts
- `public/images/` - Logo & assets

### Configuration
- `.env` - Environment variables
- `package.json` - Dependencies
- `config/` - Database, Cloudinary

---

## Learning Path

### Beginner
1. Explore the UI as a user
2. Register and test features
3. View the code structure
4. Read inline comments

### Intermediate
1. Understand the MVC pattern
2. Follow a request flow
3. Examine database models
4. Study authentication flow

### Advanced
1. Add custom features
2. Modify the design
3. Optimize queries
4. Deploy to production

---

## Next Steps

### Customize
- Update colors in `public/css/style.css`
- Modify logo in `public/images/logo.svg`
- Add new features in `controllers/`
- Create new routes in `routes/`

### Deploy
- Follow `DEPLOYMENT.md` guide
- Choose a platform (Railway, Render, Heroku)
- Set environment variables
- Push to production

### Portfolio
- Add screenshots
- Record demo video
- Write about technical decisions
- Share on LinkedIn/GitHub

---

## Getting Help

### Documentation
- `README.md` - Complete guide
- `INSTALLATION.md` - Detailed setup
- `FEATURES.md` - Feature list
- `DEPLOYMENT.md` - Production guide

### Debug Mode
Add to server.js for detailed logs:
```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(require('morgan')('dev'));
}
```

### Check Logs
Server logs show errors, requests, and database operations.

---

## Success Indicators

You're all set when you see:

✅ No error messages in terminal
✅ Landing page loads at localhost:3000
✅ Can register and login
✅ MongoDB connected message appears
✅ Can create and view posts

---

## Time Estimates

- **Installation**: 5 minutes
- **First Run**: 2 minutes
- **Testing Features**: 10 minutes
- **Understanding Code**: 30-60 minutes
- **Customization**: Varies

---

## Pro Tips

1. **Use sample data** (`npm run seed`) to test faster
2. **Open MongoDB Compass** to visualize database
3. **Check browser console** for frontend errors
4. **Check terminal** for backend errors
5. **Read code comments** for understanding
6. **Test on mobile** with responsive design
7. **Try all features** before customizing
8. **Make small changes** and test frequently

---

## Congratulations! 🎉

You now have CircleSphere running locally!

**What you've accomplished:**
- ✅ Installed a full-stack application
- ✅ Connected to MongoDB
- ✅ Started a Node.js server
- ✅ Explored a social media platform

**Ready to dive deeper?**
- Read `README.md` for complete documentation
- Check `FEATURES.md` for feature details
- See `DEPLOYMENT.md` when ready to deploy

---

**CircleSphere** - *Connect. Share. Belong.* 🌐

Happy coding! 💻
