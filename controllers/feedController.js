const Post = require('../models/Post');
const Follow = require('../models/Follow');
const User = require('../models/User');
const Profile = require('../models/Profile');

exports.showHomeFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const following = await Follow.find({ follower: req.user._id }).select('following');
    const followingIds = following.map(f => f.following);
    followingIds.push(req.user._id);

    const posts = await Post.find({ user: { $in: followingIds } })
      .populate('user')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ user: { $in: followingIds } });
    const totalPages = Math.ceil(totalPosts / limit);

    const suggestedUsers = await User.find({
      _id: { $nin: [...followingIds, req.user._id] }
    })
      .limit(5);

    const suggestedProfiles = await Profile.find({
      user: { $in: suggestedUsers.map(u => u._id) }
    });

    const suggested = suggestedUsers.map(user => {
      const profile = suggestedProfiles.find(p => p.user.equals(user._id));
      return { user, profile };
    });

    const postsWithLikeStatus = posts.map(post => ({
      ...post.toObject(),
      isLiked: post.likes.some(like => like.equals(req.user._id))
    }));

    res.render('feed/home', {
      title: 'Home Feed - CircleSphere',
      posts: postsWithLikeStatus,
      suggestedUsers: suggested,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error('Home feed error:', error);
    req.flash('error', 'Error loading feed');
    res.redirect('/');
  }
};

exports.showLanding = (req, res) => {
  res.render('landing', {
    title: 'CircleSphere - Connect. Share. Belong.'
  });
};
