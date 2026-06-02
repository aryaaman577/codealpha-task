const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/feed');
    }

    await Comment.create({
      post: postId,
      user: req.user._id,
      content
    });

    post.commentsCount += 1;
    await post.save();

    req.flash('success', 'Comment added successfully');
    res.redirect(`/post/${postId}`);
  } catch (error) {
    console.error('Create comment error:', error);
    req.flash('error', 'Error adding comment');
    res.redirect('back');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      req.flash('error', 'Comment not found');
      return res.redirect('back');
    }

    if (!comment.user.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to delete this comment');
      return res.redirect('back');
    }

    const post = await Post.findById(comment.post);
    
    await comment.deleteOne();

    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save();
    }

    req.flash('success', 'Comment deleted successfully');
    res.redirect('back');
  } catch (error) {
    console.error('Delete comment error:', error);
    req.flash('error', 'Error deleting comment');
    res.redirect('back');
  }
};
