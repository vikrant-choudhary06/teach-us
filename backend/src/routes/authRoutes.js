import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, googleLogin, verifyOTP, resendOTP } from '../controllers/authController.js';
import { getFriends, sendFriendRequest, respondFriendRequest } from '../controllers/socialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/social/friends')
  .get(protect, getFriends);

router.route('/social/friends/request')
  .post(protect, sendFriendRequest);

router.route('/social/friends/request/:id')
  .put(protect, respondFriendRequest);

export default router;
