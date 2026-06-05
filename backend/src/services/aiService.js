import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';


const fileToGenerativePart = (path, mimeType) => {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  };
};

export const gradeHomeworkWithAI = async (filePath, rubric, mimeType) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. AI homework grading is disabled.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const imagePart = fileToGenerativePart(filePath, mimeType || 'image/jpeg');

    const prompt = `
      You are an expert AI Paper Grader for ClassOS.
      You are grading a student's physical handwritten homework image.
      
      Grading Rubric / Criteria:
      ${rubric || 'Verify completeness, factual accuracy, clear explanations, and structure.'}
      
      Analyze the handwritten homework in this image. Do the following:
      1. Extract all legible text (OCR).
      2. Grade the work based on the provided rubric. Provide a numerical score out of 100.
      3. Write a constructive feedback summary highlighting strengths and areas of improvement.
      4. Format your output strictly in JSON using the following structure:
      {
        "score": 85,
        "extractedText": "The text read from the page...",
        "feedback": "This is a detailed qualitative feedback summarizing performance.",
        "rubricAnalysis": "Detailed criteria matches, e.g. Grammar: 9/10, Detail: 8/10, Accuracy: 8/10."
      }
      Do NOT wrap the JSON inside markdown code blocks (e.g. \`\`\`json). Return ONLY the raw valid JSON string.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const responseText = response.text() || '';


    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Gemini AI grading service error:', error);
    throw error;
  }
};

export const summarizeLessonWithAI = async (transcriptionText, whiteboardLogs) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. AI lesson summarizer is disabled.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const whiteboardContext = whiteboardLogs && whiteboardLogs.length > 0
      ? `Whiteboard strokes captured: ${JSON.stringify(whiteboardLogs.slice(0, 100))} (contains coordinates, colors, and clear events)`
      : 'No whiteboard logs recorded.';

    const prompt = `
      You are ClassOS AI Auto-Lesson Summarizer.
      Your task is to take the audio transcription of the class lecture and whiteboard activity, and compile a beautifully formatted "Study Guide" in Markdown format for the students.
      
      Audio Lecture Transcription:
      "${transcriptionText || 'The class discusses the core concepts of Photosynthesis, highlighting the role of chlorophyll, light dependent reactions in thylakoid membranes, and the Calvin cycle in the stroma.'}"
      
      Class whiteboard logs:
      ${whiteboardContext}
      
      Create a detailed Study Guide that includes:
      1. Lecture Overview & Core Concepts
      2. Step-by-Step Mechanism breakdown
      3. Key Vocabulary list
      4. Quick revision questions with answers
      5. Suggested homework makeup assignment.
      
      Format beautifully in clean GitHub-Flavored Markdown.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || 'No summary could be generated.';
  } catch (error) {
    console.error('Gemini AI lesson summarizer service error:', error);
    throw error;
  }
};



