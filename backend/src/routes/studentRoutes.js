import express from 'express';
import { createStudent, getStudents, getStudentStats, updateStudent } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Teacher'), createStudent)
  .get(protect, getStudents);

router.route('/:id')
  .put(protect, authorize('Teacher'), updateStudent);

router.route('/:id/stats')
  .get(protect, getStudentStats);

export default router;
