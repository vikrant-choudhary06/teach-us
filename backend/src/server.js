import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';


import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import { startCronJobs } from './workers/cronJobs.js';


import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import classRoutes from './routes/classRoutes.js';
import graderRoutes from './routes/graderRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'https://teach-us.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app') || 
                      origin.startsWith('http://localhost:');
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/class', classRoutes);
app.use('/api/grader', graderRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/upload', uploadRoutes);


app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }[dbState] || 'unknown';

  res.json({
    status: 'online',
    database: dbStatus,
    timestamp: new Date(),
  });
});

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
server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(` ClassOS Backend Engine active on port ${PORT}`);
  console.log(` Live Environment: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
