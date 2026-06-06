import BranchingCourse from '../models/BranchingCourse.js';

// Create a new branching course
export const createCourse = async (req, res) => {
  try {
    const { title, description, chapters } = req.body;
    if (!title || !chapters || chapters.length === 0) {
      return res.status(400).json({ message: 'Title and chapters are required' });
    }

    const course = await BranchingCourse.create({
      title,
      description,
      teacherId: req.user._id,
      chapters,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await BranchingCourse.find({}).populate('teacherId', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await BranchingCourse.findById(req.params.id).populate('teacherId', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
