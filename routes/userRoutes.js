const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateProfile, checkValidation } = require('../middleware/validation');
const { upload } = require('../config/cloudinary');

router.get('/search', protect, userController.searchUsers);

router.get('/dashboard', protect, userController.showDashboard);

router.get('/edit', protect, userController.showEditProfile);

router.post('/edit', 
  protect, 
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  validateProfile,
  checkValidation,
  userController.updateProfile
);

router.get('/:username', protect, userController.showProfile);

router.get('/:username/followers', protect, require('../controllers/followController').showFollowers);

router.get('/:username/following', protect, require('../controllers/followController').showFollowing);

module.exports = router;
