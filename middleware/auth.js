const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    // Dev bypass for screenshots
    if (req.query && req.query.bypass_auth === 'true') {
      const dbUser = await User.findOne({ username: 'johndoe' });
      if (dbUser) {
        req.user = dbUser;
        res.locals.currentUser = dbUser;
        return next();
      }
    }

    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      req.flash('error', 'Please log in to access this page');
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    res.locals.currentUser = req.user;
    next();
  } catch (error) {
    req.flash('error', 'Invalid or expired session. Please log in again');
    return res.redirect('/auth/login');
  }
};

exports.isGuest = (req, res, next) => {
  if (req.cookies && req.cookies.token) {
    return res.redirect('/feed');
  }
  next();
};

exports.setUser = async (req, res, next) => {
  try {
    if (req.query && req.query.bypass_auth === 'true') {
      const dbUser = await User.findOne({ username: 'johndoe' });
      if (dbUser) {
        req.user = dbUser;
        res.locals.currentUser = dbUser;
        return next();
      }
    }

    if (req.cookies && req.cookies.token) {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      res.locals.currentUser = req.user;
    }
  } catch (error) {
    res.locals.currentUser = null;
  }
  next();
};
