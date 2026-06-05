import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['Teacher', 'Student', 'Parent'],
      default: 'Teacher',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOTP: {
      type: String,
    },
    verificationOTPExpires: {
      type: Date,
    },
    subjectsTaught: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
    },
    qualification: {
      type: String,
      default: '',
    },
    aboutMe: {
      type: String,
      default: 'Dedicated and passionate educator with a focus on creating engaging and effective learning environments. Experienced in teaching various subjects. Committed to leveraging AI technology to enhance teaching efficiency and student outcomes.',
    },
    credits: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
