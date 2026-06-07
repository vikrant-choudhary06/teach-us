import User from '../models/User.js';
import TeacherProfile from '../models/TeacherProfile.js';
import StudentProfile from '../models/StudentProfile.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationOTP, sendWelcomeEmail } from '../services/emailService.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id, email = '') => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET || 'supersecretclassoskey123!', {
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
      if (user.role === 'Teacher') {
        await TeacherProfile.create({ user: user._id });
      } else if (user.role === 'Student') {
        const cleanName = user.name.replace(/\s+/g, '').toUpperCase();
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        await StudentProfile.create({ user: user._id, uid: `${cleanName}#${randomSuffix}` });
      }

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

      let uid = undefined;

      if (user.role === 'Student') {
        let studentProfile = await StudentProfile.findOne({ user: user._id });
        if (!studentProfile) {
          const cleanName = user.name.replace(/\s+/g, '').toUpperCase();
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          studentProfile = await StudentProfile.create({ user: user._id, uid: `${cleanName}#${randomSuffix}` });
        } else if (!studentProfile.uid) {
          const cleanName = user.name.replace(/\s+/g, '').toUpperCase();
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          studentProfile.uid = `${cleanName}#${randomSuffix}`;
          await studentProfile.save();
        }
        uid = studentProfile.uid;
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        uid: uid,
        token: generateToken(user._id, user.email),
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
      const userObj = user.toObject();
      if (user.role === 'Teacher') {
        const profile = await TeacherProfile.findOne({ user: user._id });
        if (profile) Object.assign(userObj, profile.toObject(), { _id: user._id });
      } else if (user.role === 'Student') {
        const profile = await StudentProfile.findOne({ user: user._id });
        if (profile) Object.assign(userObj, profile.toObject(), { _id: user._id });
      }
      res.json(userObj);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, picture, subjectsTaught, experience, qualification, aboutMe, credits } = req.body;

    if (name !== undefined) user.name = name;
    if (picture !== undefined) user.picture = picture;
    const updatedUser = await user.save();
    
    let updatedProfile = null;
    if (user.role === 'Teacher') {
      let profile = await TeacherProfile.findOne({ user: user._id });
      if (!profile) profile = new TeacherProfile({ user: user._id });
      
      if (subjectsTaught !== undefined) profile.subjectsTaught = subjectsTaught;
      if (experience !== undefined) profile.experience = experience;
      if (qualification !== undefined) profile.qualification = qualification;
      if (aboutMe !== undefined) profile.aboutMe = aboutMe;
      if (credits !== undefined) profile.credits = credits;
      
      updatedProfile = await profile.save();
    }

    const userObj = updatedUser.toObject();
    if (updatedProfile) Object.assign(userObj, updatedProfile.toObject(), { _id: user._id });

    res.json({
      _id: userObj._id,
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      picture: userObj.picture,
      uid: userObj.uid,
      subjectsTaught: userObj.subjectsTaught,
      experience: userObj.experience,
      qualification: userObj.qualification,
      aboutMe: userObj.aboutMe,
      credits: userObj.credits,
    });
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
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Strict Role Verification (Option 1 enhancement)
      if (role && user.role !== role) {
        return res.status(403).json({ 
          message: `Access Denied: This account is already registered as a ${user.role}. Please select the ${user.role} portal to login.` 
        });
      }

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
      if (picture && user.picture !== picture) {
        user.picture = picture;
        updated = true;
      }
      let uid = undefined;
      if (user.role === 'Student') {
        let studentProfile = await StudentProfile.findOne({ user: user._id });
        if (!studentProfile) {
          const cleanName = user.name.replace(/\s+/g, '').toUpperCase();
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          studentProfile = await StudentProfile.create({ user: user._id, uid: `${cleanName}#${randomSuffix}` });
        } else if (!studentProfile.uid) {
          const cleanName = user.name.replace(/\s+/g, '').toUpperCase();
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          studentProfile.uid = `${cleanName}#${randomSuffix}`;
          await studentProfile.save();
        }
        uid = studentProfile.uid;
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
        picture,
      });

      if (user.role === 'Teacher') {
        await TeacherProfile.create({ user: user._id });
      } else if (user.role === 'Student') {
        const cleanName = user.name.replace(/\s+/g, '').toUpperCase();
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        await StudentProfile.create({ user: user._id, uid: `${cleanName}#${randomSuffix}` });
      }

      // Send welcome email asynchronously for new Google users
      sendWelcomeEmail(email, name).catch((err) => {
        console.error(`Failed to send welcome email to ${email}:`, err.message);
      });
    }

    let finalUid = undefined;
    if (user.role === 'Student') {
      const studentProfile = await StudentProfile.findOne({ user: user._id });
      if (studentProfile) finalUid = studentProfile.uid;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
      uid: finalUid,
      token: generateToken(user._id, user.email),
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
      picture: user.picture,
      uid: user.uid,
      token: generateToken(user._id, user.email),
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
