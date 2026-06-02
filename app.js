const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = null;
  res.locals.moment = require('moment');
  next();
});

const jwt = require('jsonwebtoken');
const User = require('./models/User');

app.use(async (req, res, next) => {
  try {
    if (req.cookies && req.cookies.token) {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      res.locals.currentUser = req.user;
    }
  } catch (error) {
    res.locals.currentUser = null;
  }
  next();
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const followRoutes = require('./routes/followRoutes');
const feedRoutes = require('./routes/feedRoutes');
const feedController = require('./controllers/feedController');

app.get('/', feedController.showLanding);
app.get('/developer', (req, res) => {
  res.render('developer', {
    title: 'Developer Profile - Aryaaman'
  });
});
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/api', likeRoutes);
app.use('/api', followRoutes);
app.use('/feed', feedRoutes);

const { notFound, errorHandler } = require('./middleware/errorHandler');

app.use(notFound);
app.use(errorHandler);

module.exports = app;
