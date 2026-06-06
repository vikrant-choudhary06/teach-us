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

export const solveMathWithAI = async (problem, topic) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. AI Math solver is disabled.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `
      You are an expert Math Solver for ClassOS.
      Solve the following mathematical problem on the topic of "${topic || 'General Mathematics'}":
      "${problem}"

      Analyze the problem and calculate step-by-step analytical instructions.
      Provide the steps to solve the problem.
      Format your response strictly as a JSON string containing an array of strings under the key "solutionSteps", like this:
      {
        "solutionSteps": [
          "Step 1: Identify that...",
          "Step 2: Solve by...",
          "Step 3: Combine..."
        ]
      }
      Do NOT wrap the JSON inside markdown code blocks (e.g. \`\`\`json). Return ONLY the raw valid JSON string.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text() || '';

    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Gemini AI math solver service error:', error);
    throw error;
  }
};

export const digitizePaperWithAI = async (filePath, mimeType) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. AI Paper Digitizer is disabled.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const imagePart = fileToGenerativePart(filePath, mimeType || 'image/jpeg');

    const prompt = `
      You are an expert AI Paper Digitizer for ClassOS.
      You are scanning a student's notebook or page of handwritten notes.
      
      Extract all legible text from this page, clean it, and format it.
      Format your response strictly as a JSON object containing the title, subtitle, and sections, like this:
      {
        "title": "Extracted Notes Title",
        "subtitle": "Auto-transcribed handwritten text details",
        "sections": [
          {
            "title": "Transcription Section Name",
            "questions": [
              "Line or paragraph of notes 1...",
              "Line or paragraph of notes 2..."
            ]
          }
        ]
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
    console.error('Gemini AI Paper Digitizer service error:', error);
    throw error;
  }
};

export const generateLessonPlanWithAI = async (grade, subject, topic, duration, objectives) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. AI Lesson Planner is disabled.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `
      You are the ClassOS AI Auto-Lesson Planner.
      Generate a comprehensive lesson plan timeline for the following details:
      Grade/Class level: "${grade}"
      Subject: "${subject}"
      Topic: "${topic}"
      Duration: "${duration} Mins"
      Learning Objectives: "${objectives || 'Master core parameters of the topic.'}"

      Create a detailed plan. Your response must be a strict JSON object structure:
      {
        "title": "Comprehensive Lesson Title",
        "subject": "Syllabus subject name",
        "grade": "Grade level",
        "duration": "Duration in Mins",
        "objectives": "The student learning objectives...",
        "workflow": [
          {
            "id": 1,
            "phase": "Introduction & Hook",
            "duration": "10",
            "details": "Introduce concepts using visual slides..."
          },
          {
            "id": 2,
            "phase": "Core Concept Deep-Dive",
            "duration": "20",
            "details": "Teach core variables and equations..."
          },
          {
            "id": 3,
            "phase": "Interactive Quiz or Assignment",
            "duration": "10",
            "details": "Deploy a multi-path quiz..."
          },
          {
            "id": 4,
            "phase": "Recap & Exit Ticket",
            "duration": "5",
            "details": "Address doubts and wrap up..."
          }
        ]
      }
      Do NOT wrap the JSON inside markdown code blocks (e.g. \`\`\`json). Return ONLY the raw valid JSON string.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text() || '';

    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Gemini AI Lesson Planner service error:', error);
    throw error;
  }
};

export const generateVisualAidWithAI = async (promptText, type) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. AI Visual Aids is disabled.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const stylePrompt = type === 'diagram' 
      ? 'Create a valid Mermaid.js flowchart markdown string. Do NOT write full HTML, only the Mermaid graph syntax (e.g., graph TD; A-->B;).' 
      : 'Create a clean structured dataset for a bar/pie chart representing the requested statistics (e.g. Labels: [...], Values: [...]).';

    const promptBody = `
      You are the ClassOS AI Visual Aid Generator.
      Generate a visual aid based on this prompt: "${promptText}"
      Visual Aid Type: "${type}"
      
      Requirement:
      ${stylePrompt}
      
      Return your output strictly as a JSON object matching this structure:
      {
        "title": "Visual Aid Title",
        "data": "The mermaid code string or structured chart config string/data..."
      }
      Do NOT wrap the JSON inside markdown code blocks (e.g. \`\`\`json). Return ONLY the raw valid JSON string.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(promptBody);
    const response = await result.response;
    const responseText = response.text() || '';

    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Gemini AI Visual Aids service error:', error);
    throw error;
  }
};



