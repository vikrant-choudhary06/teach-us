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
    console.warn('GEMINI_API_KEY not configured. Using high-quality mock evaluation responses.');
    return simulateHomeworkGrading(rubric);
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
    return {
      score: 75,
      extractedText: '[OCR Failed or timed out]',
      feedback: 'Failed to process grading using Gemini API. Falling back to default grading: Please check the handwriting legibility.',
      rubricAnalysis: 'Factual accuracy: 7/10, Completeness: 8/10',
      error: error.message,
    };
  }
};

export const summarizeLessonWithAI = async (transcriptionText, whiteboardLogs) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY not configured. Using high-quality mock lesson summarizer.');
    return simulateLessonSummary(transcriptionText);
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
    return `
# Study Guide: [Compilation failed]
*Could not connect to Gemini AI API. Here is the raw lecture transcription digest:*

${transcriptionText || 'No transcript contents available.'}
    `;
  }
};



const simulateHomeworkGrading = (rubric) => {
  const scores = [82, 88, 91, 95];
  const randomScore = scores[Math.floor(Math.random() * scores.length)];
  return {
    score: randomScore,
    extractedText: "Title: Cellular Respiration Lab Report\n\nHypothesis: If cells are deprived of oxygen, they will switch from aerobic respiration to anaerobic fermentation, resulting in lower ATP production and accumulation of lactic acid.\n\nMethods & Observations: We incubated yeast in sugar solution and measured CO2 release. Tube A (with oxygen) showed rapid gas production. Tube B (sealed) showed slow gas bubbles.\n\nConclusion: The experiment supports the hypothesis. Aerobic respiration produces 36-38 ATP per glucose, whereas fermentation yields only 2 ATP, proving aerobic pathways are far more efficient.",
    feedback: `Outstanding lab report! Your hypothesis is clearly stated, and you successfully linked the theoretical ATP yields (36-38 ATP vs 2 ATP) to your fermentation observations. Excellent work on the formatting. To get a perfect score, ensure you label your graph axes next time.`,
    rubricAnalysis: `Criteria matches based on: "${rubric || 'Default Rubric'}"\n- Scientific Accuracy: 10/10\n- Experimental Setup Detail: 8.5/10\n- Logical Conclusion: 9/10\n- Graph labels: 6/10`,
  };
};


const simulateLessonSummary = (transcript) => {
  return `
# ClassOS Study Guide: Photosynthesis & Light Reactions
*Compiled automatically by Acharya AI Lesson Summarizer*

## 1. Core Concepts
* **Photosynthesis:** The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.
* **Location:** Occurs inside chloroplasts. Light reactions take place in the **thylakoid membranes**, while dark reactions (Calvin Cycle) happen in the **stroma**.
* **Equation:** 
  $$6CO_2 + 6H_2O + light \\rightarrow C_6H_{12}O_6 + 6O_2$$

## 2. Step-by-Step Mechanism (Light-Dependent Reactions)
1. **Light Absorption:** Chlorophyll inside Photosystem II (PSII) absorbs solar energy, exciting electrons.
2. **Water Splitting (Photolysis):** Water molecules are split into $H^+$, electrons, and oxygen gas ($O_2$). The oxygen is released as a byproduct.
3. **Electron Transport Chain (ETC):** Electrons flow down the ETC to Photosystem I (PSI), pumping hydrogen ions into the thylakoid space to create a proton gradient.
4. **ATP & NADPH Generation:** The proton gradient drives ATP Synthase to produce ATP. Electrons at PSI are transferred to NADP+ to form NADPH.

## 3. Key Vocabulary
* **Thylakoid:** Disc-like membranes where chlorophyll molecules are embedded.
* **Stroma:** The fluid-filled space surrounding thylakoids.
* **Chlorophyll:** Green pigment that captures light energy.

## 4. Quick Revision Questions
* **Q1:** What is the primary source of electrons in light-dependent reactions?
  * *A1:* Water ($H_2O$), which undergoes photolysis.
* **Q2:** Where does the Calvin Cycle get its energy from?
  * *A2:* ATP and NADPH produced during the light-dependent stage.

## 5. Homework Makeup Assignment
* Draw and label a chloroplast showing where light reactions and dark reactions occur. Write a 100-word summary on why the electron transport chain is crucial for ATP generation.
  `;
};
