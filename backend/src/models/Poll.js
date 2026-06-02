import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    votes: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
        optionIndex: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classroomId: {
      type: String,
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

const Poll = mongoose.model('Poll', pollSchema);
export default Poll;
