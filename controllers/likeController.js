const Post = require('../models/Post');

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
      post.likesCount = post.likes.length;
      await post.save();

      return res.json({
        success: true,
        liked: false,
        likesCount: post.likesCount
      });
    } else {
      post.likes.push(req.user._id);
      post.likesCount = post.likes.length;
      await post.save();

      return res.json({
        success: true,
        liked: true,
        likesCount: post.likesCount
      });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    return res.status(500).json({ success: false, message: 'Error toggling like' });
  }
};
