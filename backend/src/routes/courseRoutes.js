import express from 'express';
import { createCourse, getCourses, getCourseById, updateCourse, getActiveFeed } from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/feed')
  .get(protect, getActiveFeed);

router.route('/')
  .post(protect, authorize('Teacher'), createCourse)
  .get(protect, getCourses);

router.route('/:id')
  .get(protect, getCourseById)
  .put(protect, authorize('Teacher'), updateCourse);

export default router;
