import express from 'express';
import { registerUser, loginUser, getUserProfile, googleLogin, verifyOTP, resendOTP } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/profile', protect, getUserProfile);

export default router;
