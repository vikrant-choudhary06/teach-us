import express from 'express';
import { createStudent, getStudents, getStudentStats } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Teacher'), createStudent)
  .get(protect, getStudents);

router.route('/:id/stats')
  .get(protect, getStudentStats);

export default router;
