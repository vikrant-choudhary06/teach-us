import Student from '../models/Student.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Gradebook from '../models/Gradebook.js';

export const addStudentByUid = async (req, res) => {
  const { uid, classroom } = req.body;
  try {
    const user = await User.findOne({ uid, role: 'Student' });
    if (!user) {
      return res.status(404).json({ message: 'Student with this UID not found' });
    }

    // Check if student is already in teacher's roster
    const existing = await Student.findOne({ email: user.email, teacherId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Student is already in your class' });
    }

    const student = await Student.create({
      name: user.name,
      email: user.email,
      parentId: null, 
      teacherId: req.user._id,
      classroom: classroom || 'General',
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createStudent = async (req, res) => {
  const { name, email, parentEmail, classroom } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid student email address' });
  }
  if (parentEmail && !emailRegex.test(parentEmail)) {
    return res.status(400).json({ message: 'Please provide a valid parent email address' });
  }

  try {
    let parentId = null;

    if (parentEmail) {

      let parentUser = await User.findOne({ email: parentEmail, role: 'Parent' });
      if (!parentUser) {

        parentUser = await User.create({
          name: `Parent of ${name}`,
          email: parentEmail,
          password: 'parentpassword123',
          role: 'Parent',
          isVerified: true,
        });
        console.log(`Created parent user automatically for: ${parentEmail}`);
      }
      parentId = parentUser._id;
    }

    const student = await Student.create({
      name,
      email,
      parentId,
      teacherId: req.user._id,
      classroom: classroom || 'General',
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getStudents = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Teacher') {
      query = { teacherId: req.user._id };
    } else if (req.user.role === 'Parent') {
      query = { parentId: req.user._id };
    } else if (req.user.role === 'Student') {
      query = { email: req.user.email };
    }

    const students = await Student.find(query).populate('parentId', 'name email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getStudentStats = async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId).populate('parentId', 'name email');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }


    if (
      req.user.role === 'Teacher' &&
      student.teacherId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this student data' });
    }
    if (req.user.role === 'Parent' && student.parentId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this student data' });
    }
    if (req.user.role === 'Student' && student.email !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to view this student data' });
    }


    const grades = await Gradebook.find({ studentId });


    const attendanceLogs = await Attendance.find({ studentId }).sort({ date: -1 });


    const totalDays = attendanceLogs.length;
    const presentDays = attendanceLogs.filter(
      (log) => log.status === 'Present' || log.status === 'Late'
    ).length;
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    let overallGrade = 100;
    if (grades.length > 0) {
      const totalScored = grades.reduce((sum, g) => sum + g.score, 0);
      const totalMax = grades.reduce((sum, g) => sum + g.maxScore, 0);
      overallGrade = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 100;
    }

    res.json({
      student,
      attendanceRate,
      overallGrade,
      grades,
      attendanceLogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this student' });
    }

    const { row, col, status, assignmentStatus, currentProgress, doubt, grade, aiFeedback } = req.body;

    if (row !== undefined) student.row = row;
    if (col !== undefined) student.col = col;
    if (status !== undefined) student.status = status;
    if (assignmentStatus !== undefined) student.assignmentStatus = assignmentStatus;
    if (currentProgress !== undefined) student.currentProgress = currentProgress;
    if (doubt !== undefined) student.doubt = doubt;
    if (grade !== undefined) student.grade = grade;
    if (aiFeedback !== undefined) student.aiFeedback = aiFeedback;

    const updated = await student.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
