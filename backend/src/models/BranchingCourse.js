import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  chapterTitle: {
    type: String,
    required: true,
  },
  mainVideoUrl: {
    type: String,
    required: true,
  },
  quizQuestion: {
    type: String,
    required: true,
  },
  quizOptions: {
    type: [String],
    required: true,
  },
  quizCorrectIndex: {
    type: Number,
    required: true,
  },
  advancedVideoUrl: {
    type: String,
    required: true,
  },
  remedialVideoUrl: {
    type: String,
    required: true,
  },
});

const branchingCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chapters: [chapterSchema],
  },
  {
    timestamps: true,
  }
);

const BranchingCourse = mongoose.model('BranchingCourse', branchingCourseSchema);
export default BranchingCourse;
