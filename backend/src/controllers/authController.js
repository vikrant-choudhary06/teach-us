import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationOTP, sendWelcomeEmail } from '../services/emailService.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretclassoskey123!', {
    expiresIn: '30d',
  });
};




export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // If user exists but is not verified, overwrite credentials and send new OTP (auto-verify if test email)
      const isTestEmail = email === 'teacher@school.edu';
      userExists.name = name;
      userExists.password = password;
      userExists.role = role || 'Teacher';
      userExists.isVerified = isTestEmail;
      userExists.verificationOTP = isTestEmail ? undefined : otp;
      userExists.verificationOTPExpires = isTestEmail ? undefined : new Date(Date.now() + 10 * 60 * 1000);
      await userExists.save();

      if (!isTestEmail) {
        await sendVerificationOTP(email, name, otp);
      }

      return res.status(201).json({
        message: isTestEmail ? 'Signup successful' : 'Verification OTP sent to your email',
        email: userExists.email,
      });
    }

    const isTestEmail = email === 'teacher@school.edu';

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Teacher',
      isVerified: isTestEmail,
      verificationOTP: isTestEmail ? undefined : otp,
      verificationOTPExpires: isTestEmail ? undefined : new Date(Date.now() + 10 * 60 * 1000),
    });

    if (user) {
      if (!isTestEmail) {
        await sendVerificationOTP(email, name, otp);
      }
      
      res.status(201).json({
        message: isTestEmail ? 'Signup successful' : 'Verification OTP sent to your email',
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (!user.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationOTP = otp;
        user.verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendVerificationOTP(user.email, user.name, otp);

        return res.status(200).json({
          status: 'UNVERIFIED',
          message: 'Please verify your email address. A new OTP has been sent.',
          email: user.email,
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  const { token, role } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if user already exists by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // If user exists by email but googleId is not linked, link it
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.isVerified) {
        user.isVerified = true;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        role: role || 'Teacher',
        isVerified: true,
      });

      // Send welcome email asynchronously for new Google users
      sendWelcomeEmail(email, name).catch((err) => {
        console.error(`Failed to send welcome email to ${email}:`, err.message);
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ message: 'Google authentication failed: ' + error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (!otp) {
    return res.status(400).json({ message: 'Please provide the verification OTP' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.verificationOTP !== otp) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.verificationOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    // Send welcome email asynchronously
    sendWelcomeEmail(user.email, user.name).catch((err) => {
      console.error(`Failed to send welcome email to ${user.email}:`, err.message);
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: 'Account verified successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = otp;
    user.verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendVerificationOTP(user.email, user.name, otp);

    res.status(200).json({ message: 'A new verification OTP has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
