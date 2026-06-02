import express from 'express';
import {
  markAttendance,
  createPoll,
  closePoll,
  getPolls,
  sendAllParentUpdates,
} from '../controllers/classController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/attendance', protect, authorize('Teacher'), markAttendance);
router.post('/parent-updates/send-all', protect, authorize('Teacher'), sendAllParentUpdates);

router.route('/polls')
  .post(protect, authorize('Teacher'), createPoll)
  .get(protect, getPolls);

router.post('/polls/:id/close', protect, authorize('Teacher'), closePoll);

export default router;
