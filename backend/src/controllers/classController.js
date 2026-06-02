import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import Lesson from '../models/Lesson.js';
import Poll from '../models/Poll.js';
import { sendAbsentAlert } from '../services/emailService.js';
import { compileWeeklyReports } from '../workers/cronJobs.js';




export const markAttendance = async (req, res) => {
  const { logs, date } = req.body;

  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    return res.status(400).json({ message: 'Please provide attendance logs array' });
  }

  try {
    const attendanceRecords = [];
    const attendanceDate = date ? new Date(date) : new Date();

    for (const log of logs) {
      const { studentId, status } = log;


      const attendance = await Attendance.findOneAndUpdate(
        {
          studentId,

          date: {
            $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
            $lt: new Date(attendanceDate.setHours(23, 59, 59, 999)),
          },
        },
        {
          studentId,
          status,
          markedBy: req.user._id,
          date: new Date(),
        },
        { upsert: true, new: true }
      );

      attendanceRecords.push(attendance);


      if (status === 'Absent') {

        triggerAbsenceAutomation(studentId, req.user._id).catch((err) =>
          console.error(`Absence automation pipeline failed for student ${studentId}:`, err)
        );
      }
    }

    res.status(201).json({
      message: 'Attendance logged successfully',
      records: attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const triggerAbsenceAutomation = async (studentId, teacherId) => {
  console.log(`[Connected Pipeline] Absent state detected for Student ${studentId}. Initializing alert workflow...`);


  const student = await Student.findById(studentId).populate('parentId');
  if (!student || !student.parentId || !student.parentId.email) {
    console.log(`[Connected Pipeline] Aborting: No parent email registered for Student ${studentId}`);
    return;
  }


  const latestLesson = await Lesson.findOne({ teacherId })
    .sort({ createdAt: -1 });

  const studyGuide = latestLesson?.studyGuide || '';
  const makeupAssignment = latestLesson
    ? `Please read the study guide for "${latestLesson.title}". Complete a 200-word essay summary and submit it to the teacher.`
    : 'Please review the textbook chapter for today and write a short summary.';


  await sendAbsentAlert(student.parentId.email, student.name, studyGuide, makeupAssignment);
  console.log(`[Connected Pipeline] Completed automated absence workflow for student ${student.name}`);
};




export const createPoll = async (req, res) => {
  const { question, options, classroomId } = req.body;

  if (!question || !options || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ message: 'Poll must contain a question and at least 2 options' });
  }

  try {
    const poll = await Poll.create({
      question,
      options,
      teacherId: req.user._id,
      classroomId: classroomId || 'General',
      status: 'Open',
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const closePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (poll.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage this poll' });
    }

    poll.status = 'Closed';
    await poll.save();

    res.json({
      message: 'Poll closed successfully',
      poll,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getPolls = async (req, res) => {
  const { classroomId } = req.query;
  const filter = classroomId ? { classroomId } : {};

  try {
    const polls = await Poll.find(filter).sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const sendAllParentUpdates = async (req, res) => {
  try {
    const count = await compileWeeklyReports();
    res.json({
      message: 'Parent digests compiled and sent successfully',
      reportsSentCount: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
