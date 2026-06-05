import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, googleLogin, verifyOTP, resendOTP } from '../controllers/authController.js';
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

export default router;
