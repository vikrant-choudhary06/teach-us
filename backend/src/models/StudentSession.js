import mongoose from 'mongoose';

const studentSessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
      required: true,
    },
    row: {
      type: Number,
      default: 0,
    },
    col: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'focused',
    },
    assignmentStatus: {
      type: String,
      default: 'Not Started',
    },
    currentProgress: {
      type: String,
      default: 'Idle',
    },
    doubt: {
      type: String,
      default: null,
    },
    grade: {
      type: String,
      default: 'N/A',
    },
    aiFeedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student only has one active session per classroom
studentSessionSchema.index({ student: 1, classroom: 1 }, { unique: true });

const StudentSession = mongoose.model('StudentSession', studentSessionSchema);
export default StudentSession;
