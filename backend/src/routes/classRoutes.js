import express from 'express';
import {
  markAttendance,
  createPoll,
  closePoll,
  getPolls,
  sendAllParentUpdates,
} from '../controllers/classController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/attendance', protect, authorize('Teacher'), markAttendance);
router.post('/parent-updates/send-all', protect, authorize('Teacher'), sendAllParentUpdates);

router.route('/polls')
  .post(protect, authorize('Teacher'), createPoll)
  .get(protect, getPolls);

router.post('/polls/:id/close', protect, authorize('Teacher'), closePoll);

router.post('/upload-pdf', protect, authorize('Teacher'), upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl, filename: req.file.originalname });
});

export default router;

