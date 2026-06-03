import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';


import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import { startCronJobs } from './workers/cronJobs.js';


import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import classRoutes from './routes/classRoutes.js';
import graderRoutes from './routes/graderRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';


dotenv.config();


connectDB();

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


app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'ClassOS Engine API is fully functional',
    timestamp: new Date(),
  });
});


app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});


app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});


initSocket(server);


startCronJobs();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` ClassOS Backend Engine active on port ${PORT}`);
  console.log(` Live Environment: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
