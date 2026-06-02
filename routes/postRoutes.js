const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { validatePost, checkValidation } = require('../middleware/validation');
const { upload } = require('../config/cloudinary');

router.get('/create', protect, postController.showCreatePost);

router.post('/create',
  protect,
  upload.single('image'),
  validatePost,
  checkValidation,
  postController.createPost
);

router.get('/:id', protect, postController.showPost);

router.post('/:id/edit', protect, validatePost, checkValidation, postController.updatePost);

router.post('/:id/delete', protect, postController.deletePost);

module.exports = router;
