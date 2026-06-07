import express from 'express';
import { 
  gradeHomework, 
  solveMath, 
  digitizePaper, 
  generateVisualAid 
} from '../controllers/graderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/grade', protect, authorize('Teacher'), upload.single('file'), gradeHomework);
router.post('/solve-math', protect, solveMath);
router.post('/digitize', protect, authorize('Teacher'), upload.single('file'), digitizePaper);
router.post('/visual-aid', protect, authorize('Teacher'), generateVisualAid);

export default router;
