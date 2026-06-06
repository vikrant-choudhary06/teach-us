import express from 'express';
import { createCourse, getCourses, getCourseById } from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Teacher'), createCourse)
  .get(protect, getCourses);

router.route('/:id')
  .get(protect, getCourseById);

export default router;
