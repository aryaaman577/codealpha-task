const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { protect } = require('../middleware/auth');

router.post('/post/:postId/like', protect, likeController.toggleLike);

module.exports = router;
