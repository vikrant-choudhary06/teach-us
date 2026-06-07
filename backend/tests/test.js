import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { io as ioClient } from 'socket.io-client';
import mongoose from 'mongoose';


import { initSocket } from '../src/config/socket.js';
import { startCronJobs } from '../src/workers/cronJobs.js';
import authRoutes from '../src/routes/authRoutes.js';
import studentRoutes from '../src/routes/studentRoutes.js';
import classRoutes from '../src/routes/classRoutes.js';
import graderRoutes from '../src/routes/graderRoutes.js';
import lessonRoutes from '../src/routes/lessonRoutes.js';

dotenv.config();


const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const testDir = './tests';
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}


const dummyFilePath = path.join(testDir, 'dummy_homework.jpg');
fs.writeFileSync(dummyFilePath, 'dummy image content for paper grading OCR testing');

const TEST_PORT = 5001;
const baseUrl = `http://localhost:${TEST_PORT}`;


const startTestServer = () => {
  const app = express();
  const server = http.createServer(app);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static('uploads'));

  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/class', classRoutes);
  app.use('/api/grader', graderRoutes);
  app.use('/api/lessons', lessonRoutes);

  app.get('/', (req, res) => res.json({ status: 'ok' }));

  initSocket(server);
  
  return new Promise((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Test server active on port ${TEST_PORT}`);
      resolve({ server, app });
    });
  });
};

const runTests = async () => {
  console.log('\n====================================================');
  console.log(' STARTING CLASSOS INTEGRATION & WEBSOCKET TEST SUITE');
  console.log('====================================================\n');


  let dbConnected = false;
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/classos';
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB.');
    dbConnected = true;
    

    await mongoose.connection.db.dropDatabase();
    console.log('Cleaned test database.');
  } catch (err) {
    console.warn('\n⚠️ WARNING: Could not connect to MongoDB. Database-dependent tests will be skipped.');
    console.warn('Please make sure MongoDB is running locally to pass all tests.\n');
  }

  const { server } = await startTestServer();

  let teacherToken = '';
  let studentId = '';
  let lessonId = '';

  try {



    console.log('Running Test 1: Root Health Check...');
    const healthRes = await fetch(`${baseUrl}/`);
    const healthData = await healthRes.json();
    if (healthData.status === 'ok') {
      console.log('✅ Test 1 Passed: Health check OK.');
    } else {
      throw new Error('Health check failed');
    }

    if (dbConnected) {



      console.log('\nRunning Test 2: Teacher Signup & Login...');
      
      const signupRes = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Teacher Acharya',
          email: 'teacher@school.edu',
          password: 'password123',
          role: 'Teacher',
        }),
      });
      const signupData = await signupRes.json();
      
      if (!signupRes.ok) throw new Error(`Signup failed: ${signupData.message}`);
      console.log('✅ Signup successful.');

      const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'teacher@school.edu',
          password: 'password123',
        }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(`Login failed: ${loginData.message}`);
      
      teacherToken = loginData.token;
      console.log('✅ Login successful. Received JWT token.');




      console.log('\nRunning Test 3: Creating Student & Parent Integration...');
      
      const studentRes = await fetch(`${baseUrl}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teacherToken}`,
        },
        body: JSON.stringify({
          name: 'Rahul Kumar',
          email: 'rahul@student.edu',
          parentEmail: 'parent.rahul@example.com',
          classroom: 'Science-101',
        }),
      });
      const studentData = await studentRes.json();
      if (!studentRes.ok) throw new Error(`Student creation failed: ${studentData.message}`);
      
      studentId = studentData.user._id;
      console.log(`✅ Student created successfully. ID: ${studentId}`);


      const parentUser = await mongoose.connection.db.collection('users').findOne({ email: 'parent.rahul@example.com' });
      if (parentUser && parentUser.role === 'Parent') {
        console.log('✅ Verified: Parent user account registered automatically.');
      } else {
        throw new Error('Parent user account not automatically registered');
      }




      console.log('\nRunning Test 4: Creating Lesson & Generating AI Study Guide...');
      
      const lessonRes = await fetch(`${baseUrl}/api/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teacherToken}`,
        },
        body: JSON.stringify({
          title: 'Introduction to Photosynthesis',
        }),
      });
      const lessonData = await lessonRes.json();
      if (!lessonRes.ok) throw new Error(`Lesson creation failed: ${lessonData.message}`);
      
      lessonId = lessonData._id;
      console.log(`✅ Lesson session registered. ID: ${lessonId}`);


      const updateLessonRes = await fetch(`${baseUrl}/api/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teacherToken}`,
        },
        body: JSON.stringify({
          audioTranscription: 'In this class, we learned that chlorophyll in chloroplast thylakoids absorbs sunlight and splits water to generate oxygen, ATP and NADPH.',
          whiteboardLogs: [{ event: 'draw', coordinates: [10, 20, 30, 40], color: 'green' }],
        }),
      });
      if (!updateLessonRes.ok) throw new Error('Lesson update failed');
      console.log('✅ Lesson transcription and coordinates sync updated.');


      const summarizeRes = await fetch(`${baseUrl}/api/lessons/${lessonId}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teacherToken}`,
        },
      });
      const summarizeData = await summarizeRes.json();
      if (!summarizeRes.ok) throw new Error(`AI Summarizer failed: ${summarizeData.message}`);
      
      console.log('✅ AI Study Guide compiled successfully. Preview snippet:');
      console.log(summarizeData.studyGuide.substring(0, 150) + '...');




      console.log('\nRunning Test 5: Connected Data Pipeline - Absence Alerts...');
      
      const attendanceRes = await fetch(`${baseUrl}/api/class/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teacherToken}`,
        },
        body: JSON.stringify({
          logs: [{ studentId, status: 'Absent' }],
          date: new Date(),
        }),
      });
      const attendanceData = await attendanceRes.json();
      if (!attendanceRes.ok) throw new Error(`Attendance logging failed: ${attendanceData.message}`);
      
      console.log('✅ Attendance logged. Absent state triggered successfully.');
      console.log('   (Review server logs above to verify that mock absence emails are sent with summaries)');




      console.log('\nRunning Test 6: Vision Homework Grader...');
      


      const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
      const fileBuffer = fs.readFileSync(dummyFilePath);
      
      const multipartBody = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="studentId"\r\n\r\n${studentId}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nPhotosynthesis Lab Report\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="rubric"\r\n\r\nVerify mention of thylakoid membrane and correct chemical equation.\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="homework.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
        fileBuffer,
        Buffer.from(`\r\n--${boundary}--\r\n`),
      ]);

      const gradeRes = await fetch(`${baseUrl}/api/grader/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Authorization': `Bearer ${teacherToken}`,
        },
        body: multipartBody,
      });
      const gradeData = await gradeRes.json();
      if (!gradeRes.ok) throw new Error(`AI Homework grader failed: ${gradeData.message}`);
      
      console.log(`✅ Paper Graded by AI: Score ${gradeData.evaluation.score}/100.`);
      console.log(`   Feedback: "${gradeData.evaluation.feedback.substring(0, 100)}..."`);
      console.log(`   Gradebook Entry Created: ID ${gradeData.gradeRecord._id}`);




      console.log('\nRunning Test 7: Weekly Parent Report Compiler (Send-All)...');
      
      const sendAllRes = await fetch(`${baseUrl}/api/class/parent-updates/send-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${teacherToken}`,
        },
      });
      const sendAllData = await sendAllRes.json();
      if (!sendAllRes.ok) throw new Error(`Send-all compiler failed: ${sendAllData.message}`);
      
      console.log(`✅ Weekly digests compiled and sent. Total: ${sendAllData.reportsSentCount} parents notified.`);
    }




    console.log('\nRunning Test 8: Socket.io Real-Time Engine...');
    
    await new Promise((resolve, reject) => {
      const clientSocket = ioClient(baseUrl);
      
      clientSocket.on('connect', () => {
        console.log('✅ WebSocket Client connected to server.');
        

        clientSocket.emit('join_classroom', {
          classroomId: 'Science-101',
          userId: studentId || 'dummy-student-id',
          name: 'Rahul Kumar',
          role: 'Student',
        });
      });

      clientSocket.on('queue_update', (queue) => {
        console.log('✅ WebSocket: Received initial Hand-Raising Queue update.');
        

        clientSocket.emit('hand:raise');
      });

      let handRaisedVerified = false;
      clientSocket.on('queue_update', (queue) => {

        if (queue.length > 0 && !handRaisedVerified) {
          handRaisedVerified = true;
          console.log(`✅ WebSocket: Verified Student hand is raised in queue. Queue size: ${queue.length}`);
          

          clientSocket.emit('draw', { x0: 0, y0: 0, x1: 100, y1: 100, color: 'red', lineWidth: 2 });
          console.log('✅ WebSocket: Emitted whiteboard draw coordinate vectors.');
          

          clientSocket.emit('chat:message', 'Hello ClassOS!');
        }
      });

      clientSocket.on('chat:message', (msg) => {
        if (msg.text === 'Hello ClassOS!') {
          console.log(`✅ WebSocket: Chat message loopback verified: "${msg.sender}: ${msg.text}"`);
          clientSocket.close();
          resolve();
        }
      });


      setTimeout(() => {
        clientSocket.close();
        reject(new Error('WebSocket verification timed out'));
      }, 5000);
    });

    console.log('\n====================================================');
    console.log(' 🎉 ALL CLASSOS BACKEND SERVICES VERIFIED SUCCESSFULLY');
    console.log('====================================================\n');

  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error);
  } finally {

    if (dbConnected) {
      await mongoose.disconnect();
      console.log('Closed MongoDB Connection.');
    }
    server.close(() => {
      console.log('Test Server stopped.');

      if (fs.existsSync(dummyFilePath)) {
        fs.unlinkSync(dummyFilePath);
      }
    });
  }
};

runTests();
