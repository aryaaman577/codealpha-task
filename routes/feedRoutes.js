const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const { protect } = require('../middleware/auth');

router.get('/', protect, feedController.showHomeFeed);

module.exports = router;
