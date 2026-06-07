import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
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

const TeacherProfile = mongoose.model('TeacherProfile', teacherProfileSchema);
export default TeacherProfile;
