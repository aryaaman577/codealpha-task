# CircleSphere - Deployment Guide

## Deployment Options

### Option 1: Railway (Recommended)

**Why Railway?**
- Free tier available
- Automatic MongoDB integration
- Easy GitHub deployment
- Environment variables management
- Custom domains

**Steps:**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your CircleSphere repository

3. **Add MongoDB**
   - Click "+ New"
   - Select "Database"
   - Choose "MongoDB"
   - Railway will create a MongoDB instance

4. **Configure Environment Variables**
   - Go to project settings
   - Add variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your_production_secret_key
   SESSION_SECRET=your_production_session_key
   MONGODB_URI=${{MongoDB.MONGO_URL}}
   ```

5. **Deploy**
   - Railway auto-deploys on git push
   - Get your public URL
   - Test the application

---

### Option 2: Render

**Steps:**

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository

3. **Configure Service**
   - Name: circlesphere
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add MongoDB Atlas**
   - Create free cluster at MongoDB Atlas
   - Get connection string
   - Add to Render environment variables

5. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret
   SESSION_SECRET=your_secret
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Access via provided URL

---

### Option 3: Heroku

**Steps:**

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create circlesphere-app
   ```

4. **Add MongoDB Atlas**
   - Create MongoDB Atlas cluster
   - Get connection string

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret
   heroku config:set SESSION_SECRET=your_secret
   heroku config:set MONGODB_URI=mongodb+srv://...
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Open App**
   ```bash
   heroku open
   ```

---

### Option 4: Vercel (Serverless)

**Note:** Vercel is optimized for static/serverless apps. For Express apps, Railway or Render are better options.

---

### Option 5: DigitalOcean App Platform

**Steps:**

1. **Create DigitalOcean Account**
   - Sign up at https://digitalocean.com

2. **Create New App**
   - Choose GitHub repository
   - Select CircleSphere

3. **Configure App**
   - Detected: Node.js
   - Build Command: `npm install`
   - Run Command: `npm start`

4. **Add MongoDB**
   - Use MongoDB Atlas
   - Or create DigitalOcean Managed MongoDB

5. **Environment Variables**
   - Add all required variables in app settings

6. **Deploy**
   - App auto-deploys on push

---

## MongoDB Atlas Setup (Required for Cloud Deployment)

### Step 1: Create Account
- Go to https://mongodb.com/cloud/atlas
- Sign up for free

### Step 2: Create Cluster
- Click "Create Cluster"
- Choose "Shared Clusters" (Free)
- Select provider and region
- Click "Create Cluster"

### Step 3: Create Database User
- Go to "Database Access"
- Click "Add New Database User"
- Choose password authentication
- Set username and password
- Save credentials securely

### Step 4: Configure Network Access
- Go to "Network Access"
- Click "Add IP Address"
- Choose "Allow Access from Anywhere" (0.0.0.0/0)
- Confirm

### Step 5: Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your database password
- Replace `<dbname>` with `circlesphere`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/circlesphere?retryWrites=true&w=majority
```

---

## Environment Variables Checklist

Before deploying, ensure these are set:

```env
# Required
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_connection_string

# Security (Change from defaults!)
JWT_SECRET=your_unique_production_secret_minimum_32_characters
SESSION_SECRET=your_unique_session_secret_minimum_32_characters

# Cookie Settings
COOKIE_EXPIRE=7

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Important:** Generate secure random secrets:
```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

## Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Run `npm run seed` to verify database
- [ ] Update JWT_SECRET and SESSION_SECRET
- [ ] Configure MongoDB Atlas
- [ ] Test MongoDB connection
- [ ] Add environment variables
- [ ] Update CORS settings if needed
- [ ] Test registration and login
- [ ] Test post creation
- [ ] Test image uploads
- [ ] Verify responsive design
- [ ] Check error pages
- [ ] Test on mobile device

---

## Post-Deployment Steps

1. **Test Live Application**
   - Register new account
   - Create posts
   - Test all features
   - Check mobile responsiveness

2. **Seed Production Database (Optional)**
   ```bash
   # If using Heroku
   heroku run npm run seed
   
   # If using Railway/Render
   # Use their CLI or web interface to run seed script
   ```

3. **Monitor Performance**
   - Check server logs
   - Monitor response times
   - Watch for errors

4. **Update README**
   - Add live demo link
   - Update deployment status
   - Add screenshots

---

## Domain Configuration (Optional)

### Custom Domain Setup

1. **Purchase Domain**
   - GoDaddy, Namecheap, Google Domains

2. **Configure DNS**
   - Add CNAME record pointing to your deployment URL
   - Example: `circlesphere.yourdomain.com` → `your-app.railway.app`

3. **Update Platform Settings**
   - Add custom domain in platform dashboard
   - Verify domain ownership
   - SSL certificate auto-generated

---

## SSL/HTTPS

Most deployment platforms provide automatic HTTPS:
- ✅ Railway - Automatic SSL
- ✅ Render - Automatic SSL
- ✅ Heroku - Automatic SSL
- ✅ DigitalOcean - Automatic SSL

No additional configuration needed!

---

## Performance Optimization for Production

### 1. Enable Compression
Add to `app.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

Install:
```bash
npm install compression
```

### 2. Security Headers
Add helmet.js:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

Install:
```bash
npm install helmet
```

### 3. Rate Limiting
Add to `app.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

Install:
```bash
npm install express-rate-limit
```

---

## Troubleshooting Deployment Issues

### Issue: "Application Error"
**Solutions:**
- Check deployment logs
- Verify environment variables
- Ensure MongoDB connection string is correct
- Check if PORT is properly configured

### Issue: "MongoDB Connection Failed"
**Solutions:**
- Verify connection string
- Check database user credentials
- Ensure IP whitelist includes 0.0.0.0/0
- Test connection locally with production URI

### Issue: "Static Files Not Loading"
**Solutions:**
- Verify `express.static` configuration
- Check file paths are correct
- Ensure public folder is committed to git

### Issue: "JWT Errors"
**Solutions:**
- Verify JWT_SECRET is set
- Check token expiration settings
- Clear cookies and try again

---

## Monitoring and Maintenance

### Logging
- Use platform-provided logging
- Add winston or morgan for custom logging
- Monitor error rates

### Backups
- MongoDB Atlas provides automatic backups
- Export data periodically
- Version control your code

### Updates
- Keep dependencies updated
- Security patches
- Feature additions
- Bug fixes

---

## Cost Estimates (Monthly)

### Free Tier Deployments:
- **Railway**: $0 (with limits)
- **Render**: $0 (with sleep after inactivity)
- **MongoDB Atlas**: $0 (512MB storage)
- **Cloudinary**: $0 (25GB storage, 25GB bandwidth)

### Paid Tiers (Optional):
- **Railway Pro**: $5/month
- **Render**: $7/month
- **Heroku**: $7/month
- **MongoDB Atlas M10**: $57/month
- **DigitalOcean**: $5/month

---

## GitHub Actions CI/CD (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      # Add deployment steps based on platform
```

---

## Success Metrics

After deployment, track:
- Uptime percentage
- Response times
- Error rates
- User registrations
- Active users
- Posts created
- Engagement metrics

---

## Demo Deployment Checklist for Portfolio

- [ ] Deploy to production
- [ ] Seed with sample data
- [ ] Create demo account credentials
- [ ] Add live demo link to README
- [ ] Take screenshots for portfolio
- [ ] Record demo video
- [ ] Test all features live
- [ ] Share on LinkedIn/GitHub
- [ ] Add to resume

---

## Support

For deployment issues:
1. Check platform documentation
2. Review deployment logs
3. Test locally with production environment variables
4. Verify all environment variables are set
5. Check MongoDB Atlas connectivity

---

**CircleSphere is now ready for production deployment!** 🚀

Choose your preferred platform and follow the guide above. Most platforms offer free tiers perfect for portfolio projects and CodeAlpha submissions.
