import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Classroom from '../models/Classroom.js';
import StudentSession from '../models/StudentSession.js';
import Attendance from '../models/Attendance.js';
import Gradebook from '../models/Gradebook.js';

export const addStudentByUid = async (req, res) => {
  const { uid, classroom: roomName } = req.body;
  try {
    const studentProfile = await StudentProfile.findOne({ uid });
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student with this UID not found' });
    }
    const user = await User.findById(studentProfile.user);

    // Find or create classroom
    let classroomObj = await Classroom.findOne({ teacher: req.user._id, name: roomName || 'General' });
    if (!classroomObj) {
      classroomObj = await Classroom.create({ teacher: req.user._id, name: roomName || 'General', students: [] });
    }

    if (classroomObj.students.includes(user._id)) {
      return res.status(400).json({ message: 'Student is already in your class' });
    }

    classroomObj.students.push(user._id);
    await classroomObj.save();

    const session = await StudentSession.create({
      student: user._id,
      classroom: classroomObj._id,
    });

    res.status(201).json({ user, session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createStudent = async (req, res) => {
  const { name, email, parentEmail, classroom: roomName } = req.body;

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

    let user = email ? await User.findOne({ email }) : null;
    if (!user) {
      user = await User.create({
        name,
        email: email || `student_${Date.now()}@example.com`,
        password: 'studentpassword123',
        role: 'Student',
        isVerified: true,
      });
      const cleanName = user.name.replace(/\s+/g, '').toUpperCase();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      await StudentProfile.create({ user: user._id, uid: `${cleanName}#${randomSuffix}`, parentId });
    }

    let classroomObj = await Classroom.findOne({ teacher: req.user._id, name: roomName || 'General' });
    if (!classroomObj) {
      classroomObj = await Classroom.create({ teacher: req.user._id, name: roomName || 'General', students: [] });
    }

    if (!classroomObj.students.includes(user._id)) {
      classroomObj.students.push(user._id);
      await classroomObj.save();
    }

    const session = await StudentSession.findOne({ student: user._id, classroom: classroomObj._id }) || 
                    await StudentSession.create({ student: user._id, classroom: classroomObj._id });

    res.status(201).json({ user, session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getStudents = async (req, res) => {
  try {
    let studentIds = [];
    let classroomIds = [];

    if (req.user.role === 'Teacher') {
      const classrooms = await Classroom.find({ teacher: req.user._id });
      classroomIds = classrooms.map(c => c._id);
      classrooms.forEach(c => {
        studentIds = [...studentIds, ...c.students];
      });
    } else if (req.user.role === 'Parent') {
      const studentProfiles = await StudentProfile.find({ parentId: req.user._id });
      studentIds = studentProfiles.map(p => p.user);
    } else if (req.user.role === 'Student') {
      studentIds = [req.user._id];
    }

    const uniqueStudentIds = [...new Set(studentIds.map(id => id.toString()))];
    
    const students = await User.find({ _id: { $in: uniqueStudentIds } });
    
    const sessions = await StudentSession.find({ student: { $in: uniqueStudentIds } });

    const mappedStudents = students.map(user => {
      const session = sessions.find(s => s.student.toString() === user._id.toString()) || {};
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: session.status || 'focused',
        assignmentStatus: session.assignmentStatus || 'Not Started',
        currentProgress: session.currentProgress || 'Idle',
        doubt: session.doubt || null,
        row: session.row || 0,
        col: session.col || 0,
        grade: session.grade || 'N/A',
        aiFeedback: session.aiFeedback || ''
      };
    });

    res.json(mappedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getStudentStats = async (req, res) => {
  const studentId = req.params.id;

  try {
    const studentUser = await User.findById(studentId);
    if (!studentUser) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentProfile = await StudentProfile.findOne({ user: studentId }).populate('parentId', 'name email');

    // Authorization check
    if (req.user.role === 'Teacher') {
      const isTeacherClass = await Classroom.exists({ teacher: req.user._id, students: studentId });
      if (!isTeacherClass) return res.status(403).json({ message: 'Not authorized to view this student data' });
    } else if (req.user.role === 'Parent') {
      if (studentProfile?.parentId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this student data' });
      }
    } else if (req.user.role === 'Student') {
      if (studentId !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this student data' });
      }
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
      student: {
        _id: studentUser._id,
        name: studentUser.name,
        email: studentUser.email,
        parentId: studentProfile?.parentId,
        uid: studentProfile?.uid,
      },
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
    const studentUser = await User.findById(req.params.id);
    if (!studentUser) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const classroom = await Classroom.findOne({ teacher: req.user._id, students: req.params.id });
    if (!classroom) {
      return res.status(403).json({ message: 'Not authorized to update this student' });
    }

    let session = await StudentSession.findOne({ student: req.params.id, classroom: classroom._id });
    if (!session) {
      session = new StudentSession({ student: req.params.id, classroom: classroom._id });
    }

    const { row, col, status, assignmentStatus, currentProgress, doubt, grade, aiFeedback } = req.body;

    if (row !== undefined) session.row = row;
    if (col !== undefined) session.col = col;
    if (status !== undefined) session.status = status;
    if (assignmentStatus !== undefined) session.assignmentStatus = assignmentStatus;
    if (currentProgress !== undefined) session.currentProgress = currentProgress;
    if (doubt !== undefined) session.doubt = doubt;
    if (grade !== undefined) session.grade = grade;
    if (aiFeedback !== undefined) session.aiFeedback = aiFeedback;

    const updated = await session.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
