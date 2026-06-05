import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    classroom: {
      type: String,
      default: 'General',
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

const Student = mongoose.model('Student', studentSchema);
export default Student;
