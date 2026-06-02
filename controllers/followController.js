const Follow = require('../models/Follow');
const User = require('../models/User');
const Profile = require('../models/Profile');

exports.toggleFollow = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);

    if (!userToFollow) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (userToFollow._id.equals(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }

    const existingFollow = await Follow.findOne({
      follower: req.user._id,
      following: userToFollow._id
    });

    if (existingFollow) {
      await existingFollow.deleteOne();

      return res.json({
        success: true,
        following: false,
        message: 'Unfollowed successfully'
      });
    } else {
      await Follow.create({
        follower: req.user._id,
        following: userToFollow._id
      });

      return res.json({
        success: true,
        following: true,
        message: 'Followed successfully'
      });
    }
  } catch (error) {
    console.error('Toggle follow error:', error);
    return res.status(500).json({ success: false, message: 'Error toggling follow' });
  }
};

exports.showFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/feed');
    }

    const followers = await Follow.find({ following: user._id })
      .populate('follower')
      .sort({ createdAt: -1 });

    const followerUsers = await Promise.all(
      followers.map(async (follow) => {
        const profile = await Profile.findOne({ user: follow.follower._id });
        return { user: follow.follower, profile };
      })
    );

    res.render('user/followers', {
      title: `${user.username}'s Followers - CircleSphere`,
      profileUser: user,
      followers: followerUsers
    });
  } catch (error) {
    console.error('Show followers error:', error);
    req.flash('error', 'Error loading followers');
    res.redirect('/feed');
  }
};

exports.showFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/feed');
    }

    const following = await Follow.find({ follower: user._id })
      .populate('following')
      .sort({ createdAt: -1 });

    const followingUsers = await Promise.all(
      following.map(async (follow) => {
        const profile = await Profile.findOne({ user: follow.following._id });
        return { user: follow.following, profile };
      })
    );

    res.render('user/following', {
      title: `${user.username}'s Following - CircleSphere`,
      profileUser: user,
      following: followingUsers
    });
  } catch (error) {
    console.error('Show following error:', error);
    req.flash('error', 'Error loading following');
    res.redirect('/feed');
  }
};
