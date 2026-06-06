import fs from 'fs';
import Gradebook from '../models/Gradebook.js';
import Student from '../models/Student.js';
import { 
  gradeHomeworkWithAI, 
  solveMathWithAI, 
  digitizePaperWithAI, 
  generateVisualAidWithAI 
} from '../services/aiService.js';




export const gradeHomework = async (req, res) => {
  const { studentId, title, rubric } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a homework image file' });
  }

  if (!studentId || !title) {

    fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'studentId and assignment title are required fields' });
  }

  try {

    const student = await Student.findById(studentId);
    if (!student) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log(`[AI Grader] Starting evaluation for student ${student.name} on assignment: "${title}"...`);


    const evaluation = await gradeHomeworkWithAI(
      req.file.path,
      rubric,
      req.file.mimetype
    );


    const gradeRecord = await Gradebook.create({
      studentId,
      title,
      score: evaluation.score || 0,
      maxScore: 100,
      feedback: evaluation.feedback || '',
      gradingRubric: rubric || 'Default completeness & accuracy criteria',
      evaluatedBy: 'AI',
    });


    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete temp file:', req.file.path, err);
    });

    res.status(201).json({
      message: 'Homework graded successfully by AI',
      evaluation: {
        score: evaluation.score,
        extractedText: evaluation.extractedText,
        feedback: evaluation.feedback,
        rubricAnalysis: evaluation.rubricAnalysis,
      },
      gradeRecord,
    });
  } catch (error) {

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Grader Controller error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const solveMath = async (req, res) => {
  const { problem, topic } = req.body;

  if (!problem) {
    return res.status(400).json({ message: 'Problem expression is required' });
  }

  try {
    const solution = await solveMathWithAI(problem, topic);
    res.json(solution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const digitizePaper = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a notebook/notes image file' });
  }

  try {
    const digitized = await digitizePaperWithAI(req.file.path, req.file.mimetype);

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete temp file:', req.file.path, err);
    });

    res.json(digitized);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

export const generateVisualAid = async (req, res) => {
  const { prompt, type } = req.body;

  if (!prompt || !type) {
    return res.status(400).json({ message: 'Prompt and type are required' });
  }

  try {
    const visualAid = await generateVisualAidWithAI(prompt, type);
    res.json(visualAid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
