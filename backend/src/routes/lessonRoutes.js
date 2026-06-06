import express from 'express';
import {
  createLesson,
  getLessons,
  updateLesson,
  generateLessonSummary,
  generateLessonPlan,
} from '../controllers/lessonController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Teacher'), createLesson)
  .get(protect, getLessons);

router.post('/generate', protect, authorize('Teacher'), generateLessonPlan);

router.route('/:id')
  .put(protect, authorize('Teacher'), updateLesson);

router.post('/:id/summarize', protect, authorize('Teacher'), generateLessonSummary);

export default router;
