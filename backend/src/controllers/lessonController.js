import Lesson from '../models/Lesson.js';
import { summarizeLessonWithAI, generateLessonPlanWithAI } from '../services/aiService.js';




export const createLesson = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Lesson title is required' });
  }

  try {
    const lesson = await Lesson.create({
      title,
      teacherId: req.user._id,
      status: 'Active',
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getLessons = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Teacher') {
      query = { teacherId: req.user._id };
    }

    const lessons = await Lesson.find(query).sort({ createdAt: -1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateLesson = async (req, res) => {
  const { audioTranscription, whiteboardLogs, status } = req.body;

  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (lesson.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this lesson' });
    }

    if (audioTranscription !== undefined) lesson.audioTranscription = audioTranscription;
    if (whiteboardLogs !== undefined) lesson.whiteboardLogs = whiteboardLogs;
    if (status !== undefined) lesson.status = status;

    const updatedLesson = await lesson.save();
    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const generateLessonSummary = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (lesson.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage this lesson' });
    }

    console.log(`[AI Summarizer] Compiling study guide for lesson "${lesson.title}"...`);


    const studyGuideMarkdown = await summarizeLessonWithAI(
      lesson.audioTranscription,
      lesson.whiteboardLogs
    );


    lesson.studyGuide = studyGuideMarkdown;
    lesson.status = 'Completed';
    await lesson.save();

    res.json({
      message: 'Study guide compiled successfully by AI',
      studyGuide: studyGuideMarkdown,
      lesson,
    });
  } catch (error) {
    console.error('Lesson summary compilation controller error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const generateLessonPlan = async (req, res) => {
  const { grade, subject, topic, duration, objectives } = req.body;

  if (!grade || !subject || !topic || !duration) {
    return res.status(400).json({ message: 'Grade, subject, topic, and duration are required' });
  }

  try {
    const lessonPlan = await generateLessonPlanWithAI(grade, subject, topic, duration, objectives);
    res.json(lessonPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
