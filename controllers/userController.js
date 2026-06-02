const User = require('../models/User');
const Profile = require('../models/Profile');
const Post = require('../models/Post');
const Follow = require('../models/Follow');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.showProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/feed');
    }

    const profile = await Profile.findOne({ user: user._id });
    const posts = await Post.find({ user: user._id })
      .populate('user')
      .sort({ createdAt: -1 })
      .limit(20);

    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });
    
    let isFollowing = false;
    if (req.user) {
      isFollowing = await Follow.exists({
        follower: req.user._id,
        following: user._id
      });
    }

    const isOwnProfile = req.user && req.user._id.equals(user._id);

    res.render('user/profile', {
      title: `${user.username} - CircleSphere`,
      profileUser: user,
      profile: profile || {},
      posts,
      followersCount,
      followingCount,
      isFollowing,
      isOwnProfile
    });
  } catch (error) {
    console.error('Profile error:', error);
    req.flash('error', 'Error loading profile');
    res.redirect('/feed');
  }
};

exports.showEditProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    res.render('user/edit-profile', {
      title: 'Edit Profile - CircleSphere',
      profile: profile || {}
    });
  } catch (error) {
    console.error('Edit profile error:', error);
    req.flash('error', 'Error loading profile');
    res.redirect('/feed');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, location, website, skills } = req.body;

    let profileData = {
      firstName: firstName || '',
      lastName: lastName || '',
      bio: bio || '',
      location: location || '',
      website: website || '',
      skills: skills ? skills.split(',').map(s => s.trim()).filter(s => s) : []
    };

    if (req.files) {
      if (req.files.profilePicture && req.files.profilePicture[0]) {
        profileData.profilePicture = await uploadToCloudinary(req.files.profilePicture[0].buffer);
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        profileData.coverImage = await uploadToCloudinary(req.files.coverImage[0].buffer);
      }
    }

    await Profile.findOneAndUpdate(
      { user: req.user._id },
      profileData,
      { new: true, upsert: true }
    );

    req.flash('success', 'Profile updated successfully');
    res.redirect(`/user/${req.user.username}`);
  } catch (error) {
    console.error('Update profile error:', error);
    req.flash('error', 'Error updating profile');
    res.redirect('/user/edit');
  }
};

exports.showDashboard = async (req, res) => {
  try {
    const postsCount = await Post.countDocuments({ user: req.user._id });
    const followersCount = await Follow.countDocuments({ following: req.user._id });
    const followingCount = await Follow.countDocuments({ follower: req.user._id });

    const recentPosts = await Post.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user');

    const totalLikes = await Post.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$likesCount' } } }
    ]);

    const totalComments = await Post.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$commentsCount' } } }
    ]);

    res.render('dashboard', {
      title: 'Dashboard - CircleSphere',
      stats: {
        posts: postsCount,
        followers: followersCount,
        following: followingCount,
        likes: totalLikes[0]?.total || 0,
        comments: totalComments[0]?.total || 0
      },
      recentPosts
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/feed');
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.render('feed/search', {
        title: 'Search - CircleSphere',
        users: [],
        posts: [],
        query: ''
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);

    const userProfiles = await Profile.find({
      user: { $in: users.map(u => u._id) }
    });

    const usersWithProfiles = users.map(user => {
      const profile = userProfiles.find(p => p.user.equals(user._id));
      return { ...user.toObject(), profile };
    });

    const posts = await Post.find({
      content: { $regex: q, $options: 'i' }
    })
      .populate('user')
      .sort({ createdAt: -1 })
      .limit(20);

    res.render('feed/search', {
      title: `Search: ${q} - CircleSphere`,
      users: usersWithProfiles,
      posts,
      query: q
    });
  } catch (error) {
    console.error('Search error:', error);
    req.flash('error', 'Error performing search');
    res.redirect('/feed');
  }
};
