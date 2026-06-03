import mongoose from 'mongoose';

const gradebookSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
      default: 100,
    },
    feedback: {
      type: String,
    },
    gradingRubric: {
      type: String,
    },
    evaluatedBy: {
      type: String,
      enum: ['AI', 'Teacher'],
      default: 'Teacher',
    },
  },
  {
    timestamps: true,
  }
);

const Gradebook = mongoose.model('Gradebook', gradebookSchema);
export default Gradebook;
