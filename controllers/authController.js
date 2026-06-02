const User = require('../models/User');
const Profile = require('../models/Profile');
const { sendTokenResponse, clearTokenResponse } = require('../utils/tokenUtils');

exports.showRegisterForm = (req, res) => {
  res.render('auth/register', {
    title: 'Register - CircleSphere'
  });
};

exports.showLoginForm = (req, res) => {
  res.render('auth/login', {
    title: 'Login - CircleSphere'
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password
    });

    await Profile.create({
      user: user._id,
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=111827&color=fff&size=200`
    });

    req.flash('success', 'Registration successful! Welcome to CircleSphere');
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', error.message || 'Registration failed');
    res.redirect('/auth/register');
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    req.flash('success', 'Welcome back to CircleSphere!');
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Login failed');
    res.redirect('/auth/login');
  }
};

exports.logout = (req, res) => {
  req.flash('success', 'You have been logged out successfully');
  clearTokenResponse(res);
};
