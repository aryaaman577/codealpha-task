const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const { protect } = require('../middleware/auth');

router.post('/user/:userId/follow', protect, followController.toggleFollow);

module.exports = router;
