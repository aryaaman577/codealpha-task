const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { validateComment, checkValidation } = require('../middleware/validation');

router.post('/post/:postId/comment', protect, validateComment, checkValidation, commentController.createComment);

router.post('/:id/delete', protect, commentController.deleteComment);

module.exports = router;
