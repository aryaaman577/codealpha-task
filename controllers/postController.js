const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.showCreatePost = (req, res) => {
  res.render('post/create', {
    title: 'Create Post - CircleSphere'
  });
};

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    
    let postData = {
      user: req.user._id,
      content
    };

    if (req.file) {
      postData.image = await uploadToCloudinary(req.file.buffer);
    }

    await Post.create(postData);

    req.flash('success', 'Post created successfully');
    res.redirect('/feed');
  } catch (error) {
    console.error('Create post error:', error);
    req.flash('error', 'Error creating post');
    res.redirect('/post/create');
  }
};

exports.showPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user')
      .populate({
        path: 'likes',
        select: 'username'
      });

    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/feed');
    }

    const comments = await Comment.find({ post: post._id })
      .populate('user')
      .sort({ createdAt: -1 });

    const isLiked = req.user && post.likes.some(like => like._id.equals(req.user._id));
    const isOwner = req.user && post.user._id.equals(req.user._id);

    res.render('post/detail', {
      title: 'Post - CircleSphere',
      post,
      comments,
      isLiked,
      isOwner
    });
  } catch (error) {
    console.error('Show post error:', error);
    req.flash('error', 'Error loading post');
    res.redirect('/feed');
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/feed');
    }

    if (!post.user.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to edit this post');
      return res.redirect('/feed');
    }

    post.content = content;
    await post.save();

    req.flash('success', 'Post updated successfully');
    res.redirect(`/post/${post._id}`);
  } catch (error) {
    console.error('Update post error:', error);
    req.flash('error', 'Error updating post');
    res.redirect('/feed');
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/feed');
    }

    if (!post.user.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to delete this post');
      return res.redirect('/feed');
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    req.flash('success', 'Post deleted successfully');
    res.redirect('/feed');
  } catch (error) {
    console.error('Delete post error:', error);
    req.flash('error', 'Error deleting post');
    res.redirect('/feed');
  }
};
