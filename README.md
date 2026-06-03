# Acharya AI (teach-us)

Acharya AI is a premium, spatial glassmorphic Educator Flight Deck and Classroom Assistant designed to modernize teaching workflows. It bridges the gap between physical class materials and digital engagement by digitizing papers, displaying live lecture slides, and providing interactive student insights.

---

## 🌟 Key Features

### 1. Live Flight Deck
- **Direct PDF Drag-and-Drop**: Upload a lecture PDF directly into the slides view. The browser's native PDF viewing engine opens it inside a clean, interactive frame.
- **Interactive Board Canvas**: A digital whiteboard where teachers can sketch ideas, select pen colors, and clear the board in real-time.
- **Real-Time Student Focus Analytics**: Simulated focus/distraction tracking.
- **Live Class Polls**: Create active checks for understanding, collecting simulated student votes in real-time.

### 2. Interactive Seating Chart
- **Drag-and-Drop Seat Swapping**: Swap students' desks dynamically in a grid layout.
- **Live Workstation Inspector**: Click any desk to monitor active student files and push extension challenges directly to their workstations.

### 3. Paper Digitizer
- **Handwritten Exam OCR**: Upload images of handwritten papers to parse and output clean digitizations.

### 4. Smart Lesson Planner
- **Hyper-Local Context**: Generates lessons and case studies tailored to specific regional contexts.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Framer Motion, Vanilla CSS, React Icons
- **Backend**: Node.js, Express
- **Native Integration**: HTML IFrame PDF blob streaming

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/syntaxcoder13/teach-us.git
   cd teach-us
   ```

2. **Run Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Run Backend**:
   ```bash
   cd ../backend
   npm install
   npm start
   ```