import nodemailer from 'nodemailer';


const createTransporter = () => {

  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'test@example.com') {
    return {
      sendMail: async (mailOptions) => {
        console.log('\n=================== MOCK EMAIL SENT ===================');
        console.log(`To:      ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log('--------------------- HTML BODY ---------------------');
        console.log(mailOptions.html);
        console.log('========================================================\n');
        return { messageId: 'mock-id-' + Date.now() };
      },
    };
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendAbsentAlert = async (parentEmail, studentName, studyGuideMarkdown, makeupAssignment) => {
  const transporter = createTransporter();


  const studyGuideHTML = studyGuideMarkdown
    ? studyGuideMarkdown
        .replace(/#/g, '')
        .replace(/\n/g, '<br/>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
    : 'No lesson summary recorded for today.';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfcfc;">
      <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">ClassOS Absence Notification</h2>
      <p>Dear Parent/Guardian,</p>
      <p>We noticed that <strong>${studentName}</strong> was marked <strong>Absent</strong> from today's class.</p>
      
      <p>To ensure they do not fall behind, ClassOS has compiled today's lecture summary and makeup assignment automatically.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #10b981;">
        <h3 style="margin-top: 0; color: #374151;">Today's Lesson Summary</h3>
        <div style="font-size: 14px; color: #4b5563; line-height: 1.5;">
          ${studyGuideHTML}
        </div>
      </div>

      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #f59e0b;">
        <h3 style="margin-top: 0; color: #78350f;">Makeup Assignment</h3>
        <p style="font-size: 14px; color: #92400e; line-height: 1.5; margin-bottom: 0;">
          ${makeupAssignment || 'Please review the Study Guide notes and write a 1-page summary to submit in the next class.'}
        </p>
      </div>

      <p style="margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center;">
        This is an automated notification from Acharya AI (ClassOS). If you have questions, please reach out directly to the class teacher.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER || 'classos@school.edu',
    to: parentEmail,
    subject: `ClassOS Alert: ${studentName} was Absent today`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Absence alert email sent successfully to ${parentEmail}. Info ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending absence alert email to ${parentEmail}:`, error);
    throw error;
  }
};

export const sendWeeklyParentReport = async (parentEmail, parentName, reportData) => {
  const transporter = createTransporter();

  const { studentName, attendanceRate, gradesList, overallGrade, notes } = reportData;


  let gradesRows = '';
  if (gradesList && gradesList.length > 0) {
    gradesList.forEach((g) => {
      gradesRows += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${g.title}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: ${g.score >= 80 ? '#047857' : g.score >= 50 ? '#b45309' : '#b91c1c'};">${g.score}/${g.maxScore}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">${g.feedback || 'No comments'}</td>
        </tr>
      `;
    });
  } else {
    gradesRows = `<tr><td colspan="3" style="padding: 10px; text-align: center; color: #9ca3af;">No graded assignments recorded this week.</td></tr>`;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfcfc;">
      <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #10b981; margin: 0;">ClassOS Weekly Report Card</h2>
        <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Weekly performance digest for ${studentName}</p>
      </div>

      <p>Dear ${parentName || 'Parent/Guardian'},</p>
      <p>Here is your weekly progress digest compiled automatically by ClassOS from actual live classroom interactions:</p>
      
      <!-- Key Stats -->
      <div style="display: flex; justify-content: space-around; margin: 20px 0; background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #f3f4f6;">
        <div style="text-align: center; flex: 1;">
          <span style="font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: bold;">Attendance</span>
          <div style="font-size: 20px; font-weight: 900; color: #111827; margin-top: 5px;">${attendanceRate}%</div>
        </div>
        <div style="border-left: 1px solid #e5e7eb; margin: 0 10px;"></div>
        <div style="text-align: center; flex: 1;">
          <span style="font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: bold;">Current Grade</span>
          <div style="font-size: 20px; font-weight: 900; color: #10b981; margin-top: 5px;">${overallGrade}%</div>
        </div>
      </div>

      <!-- Grades Table -->
      <h4 style="color: #374151; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">Recent Assignment Scores</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6; text-align: left; font-size: 12px; color: #4b5563;">
            <th style="padding: 8px;">Assignment</th>
            <th style="padding: 8px; text-align: center;">Score</th>
            <th style="padding: 8px;">Feedback</th>
          </tr>
        </thead>
        <tbody>
          ${gradesRows}
        </tbody>
      </table>

      <!-- Behavioral and Teacher Notes -->
      <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-top: 15px;">
        <h4 style="margin-top: 0; color: #1e3a8a; margin-bottom: 5px;">Teacher Remarks & Velocity Notes</h4>
        <p style="font-size: 14px; color: #1e40af; line-height: 1.5; margin-bottom: 0;">
          ${notes || `${studentName} is participating actively in whiteboard session tasks. Keep up the encouragement at home!`}
        </p>
      </div>

      <p style="margin-top: 25px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 15px;">
        Acharya AI ClassOS Ecosystem - Streamlining classroom administration to focus on what matters: teaching.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER || 'classos@school.edu',
    to: parentEmail,
    subject: `ClassOS Weekly Digest: ${studentName}'s Progress Report`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Weekly digest email sent successfully to parent ${parentEmail}. Info ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending weekly digest email to ${parentEmail}:`, error);
    throw error;
  }
};

export const sendVerificationOTP = async (email, name, otp) => {
  const transporter = createTransporter();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfcfc;">
      <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #10b981; margin: 0;">Acharya AI Verification</h2>
        <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Verify your educator account</p>
      </div>

      <p>Hello ${name || 'User'},</p>
      <p>Thank you for registering with <strong>Acharya AI</strong>. Please use the following One-Time Password (OTP) to complete your registration. This OTP is valid for 10 minutes:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #10b981; background-color: #f0fdf4; padding: 12px 24px; border-radius: 8px; border: 1px dashed #10b981; display: inline-block;">
          ${otp}
        </span>
      </div>

      <p>If you did not request this verification code, please ignore this email.</p>
      
      <p style="margin-top: 25px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 15px;">
        Acharya AI Ecosystem - Modern tools for modern classrooms.
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"Acharya AI" <${process.env.EMAIL_USER || 'classos@school.edu'}>`,
    to: email,
    subject: `Acharya AI: Verify Your Account (OTP: ${otp})`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification OTP email sent successfully to ${email}. Info ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending verification OTP email to ${email}:`, error);
    throw error;
  }
};

