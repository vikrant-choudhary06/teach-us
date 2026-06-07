import cron from 'node-cron';
import StudentProfile from '../models/StudentProfile.js';
import Attendance from '../models/Attendance.js';
import Gradebook from '../models/Gradebook.js';
import User from '../models/User.js';
import { sendWeeklyParentReport } from '../services/emailService.js';


export const compileWeeklyReports = async () => {
  console.log('Starting compilation of weekly parent reports...');
  try {
    const studentProfiles = await StudentProfile.find({}).populate('parentId').populate('user');
    console.log(`Found ${studentProfiles.length} students to process.`);

    let reportsProcessed = 0;

    for (const profile of studentProfiles) {
      if (!profile.parentId || !profile.parentId.email || !profile.user) {
        console.log(`Skipping student: No parent account linked or no email available.`);
        continue;
      }

      const student = profile.user;
      const parentEmail = profile.parentId.email;
      const parentName = profile.parentId.name;


      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const attendanceLogs = await Attendance.find({
        studentId: student._id,
        date: { $gte: oneWeekAgo },
      });

      const totalDays = attendanceLogs.length;
      const presentDays = attendanceLogs.filter(
        (log) => log.status === 'Present' || log.status === 'Late'
      ).length;

      const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;


      const grades = await Gradebook.find({ studentId: student._id });
      const gradesList = grades.map((g) => ({
        title: g.title,
        score: g.score,
        maxScore: g.maxScore,
        feedback: g.feedback,
      }));


      let overallGrade = 100;
      if (grades.length > 0) {
        const totalScored = grades.reduce((sum, g) => sum + g.score, 0);
        const totalMax = grades.reduce((sum, g) => sum + g.maxScore, 0);
        overallGrade = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 100;
      }


      const reportData = {
        studentName: student.name,
        attendanceRate,
        gradesList,
        overallGrade,
        notes: `Weekly update: ${student.name} is making steady progress. Attendance rate is ${attendanceRate}%. ${
          overallGrade >= 85
            ? 'Performing excellently in class assignments!'
            : overallGrade >= 65
            ? 'Maintaining satisfactory marks. Continued review is recommended.'
            : 'Struggling with assignments. Please coordinate a tutorial support session.'
        }`,
      };


      await sendWeeklyParentReport(parentEmail, parentName, reportData);
      reportsProcessed++;
    }

    console.log(`Weekly parent report compilation completed. Processed ${reportsProcessed} reports.`);
    return reportsProcessed;
  } catch (error) {
    console.error('Error during weekly parent report compilation:', error);
    throw error;
  }
};


export const startCronJobs = () => {


  cron.schedule('0 16 * * 5', async () => {
    console.log('Cron Job Triggered: Weekly Parent Update Compiler');
    try {
      await compileWeeklyReports();
    } catch (err) {
      console.error('Cron job parent report compilation failed:', err);
    }
  });

  console.log('Background Cron Schedulers Initialized.');
};
