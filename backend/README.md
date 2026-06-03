# ClassOS: Backend Engine

This directory houses the backend engine for **ClassOS: The Generative Classroom Ecosystem**. Built using the MERN stack (Node.js, Express, Socket.io, MongoDB), it operates as a low-latency, real-time live classroom data pipe, integrated with automated AI helpers and communication compilers.

---

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (using Mongoose ODM)
* **Real-time Communication:** Socket.io
* **AI Integration:** Google Gemini API (`@google/generative-ai`)
* **Background Jobs:** Node-cron
* **Email dispatch:** Nodemailer

---

## 📂 Directory Structure

```
backend/
├── src/
│   ├── config/          # Database connection & socket listeners
│   ├── controllers/     # API Business logic (Auth, Students, Class, AI)
│   ├── middleware/      # Authentication (JWT) & file uploads (Multer)
│   ├── models/          # MongoDB schemas (User, Student, Lesson, Poll, etc.)
│   ├── routes/          # Express route mounts
│   ├── services/        # Third-party wrappers (Gemini AI, Nodemailer)
│   ├── workers/         # Background scheduler cron tasks
│   └── server.js        # Entry point configuring server, middleware, and ports
├── tests/               # Automatic integration & WebSocket test scripts
├── .env                 # Environment configurations (local settings)
├── .env.example         # Environment template configuration
└── package.json         # Scripts and package dependencies
```

---

## 🚀 Setup & Run Instructions

### Prerequisites
* Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) installed.
* Make sure a local instance of [MongoDB](https://www.mongodb.com/) is running on standard port `27017`.

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

### Running Server
* **Development Mode (using nodemon for hot-reloading):**
  ```bash
  npm run dev
  ```
* **Production Mode:**
  ```bash
  npm start
  ```

### Running Integration Tests
To run the automated suite testing REST endpoints and WebSocket channels:
```bash
npm test
```

---

## 🔑 Environment Variables (`.env`)

Create a `.env` file in the backend root folder with the following keys:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | The port the backend listens on | `5000` |
| `MONGODB_URI` | MongoDB Connection URL | `mongodb://localhost:27017/classos` |
| `JWT_SECRET` | Secret key for signing Auth Tokens | `supersecretclassoskey123!` |
| `GEMINI_API_KEY` | Your Google Gemini API Key | *(Optional - falls back to high-quality simulated OCR/Summarizer if empty)* |
| `EMAIL_USER` | SMTP Email username for parent reports | *(Optional - prints email contents to console log if empty)* |
| `EMAIL_PASS` | SMTP Email password | *(Optional)* |

---

## 🔌 API Endpoints Documentation

All REST routes are prefixed with `/api`. Access is restricted via Role-Based Access Control (RBAC) utilizing JWT tokens passed in the `Authorization: Bearer <TOKEN>` header.

### 1. Authentication & RBAC

| Method | Endpoint | Access | Body Parameters | Response | Description |
| :---: | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | `name`, `email`, `password`, `role` | User JSON + Token | Sign up a new Teacher, Student, or Parent user. |
| `POST` | `/api/auth/login` | Public | `email`, `password` | User JSON + Token | Authenticate credentials and receive token. |
| `GET` | `/api/auth/profile` | Private | None | User Profile JSON | Retrieve metadata of current logged-in user. |

### 2. Student Management

| Method | Endpoint | Access | Body Parameters | Response | Description |
| :---: | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/students` | Teacher | `name`, `email`, `parentEmail`, `classroom` | Student JSON | Registers a student. If parent email is new, it automatically registers a Parent user. |
| `GET` | `/api/students` | Private | None | Array of Students | Fetches students (Teachers see their class, parents see their children, students see themselves). |
| `GET` | `/api/students/:id/stats` | Private | None | Performance Metrics JSON | Gathers student profile, attendance history logs, and assignment grade list. |

### 3. Class Control & Attendance

| Method | Endpoint | Access | Body Parameters | Response | Description |
| :---: | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/class/attendance` | Teacher | `logs: [{ studentId, status }]`, `date` | Record confirmation | Logs attendance (Present/Late/Absent). Setting `Absent` triggers an async pipeline emailing parent the lesson summary. |
| `POST` | `/api/class/parent-updates/send-all` | Teacher | None | Dispatch Report count | Manually compiles weekly report card digests and emails them to all linked parents. |

### 4. Interactive Live Polls

| Method | Endpoint | Access | Body Parameters | Response | Description |
| :---: | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/class/polls` | Teacher | `question`, `options`, `classroomId` | Poll JSON | Creates a live classroom pop-up poll. |
| `POST` | `/api/class/polls/:id/close` | Teacher | None | Updated Poll JSON | Marks a poll as closed for voting. |
| `GET` | `/api/class/polls` | Private | None | Array of Polls | Retrieves polls active for a classroom. |

### 5. Paper Grader & Lesson Summarizer (AI Services)

| Method | Endpoint | Access | Body Parameters/Form Data | Response | Description |
| :---: | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/grader/grade` | Teacher | Form Data: `file` (image), `studentId`, `title`, `rubric` | Grading JSON + Gradebook Record | Uploads handwritten homework photo, runs OCR/Gemini grading, and registers score in Gradebook. |
| `POST` | `/api/lessons` | Teacher | `title` | Lesson JSON | Creates a new lesson log session. |
| `PUT` | `/api/lessons/:id` | Teacher | `audioTranscription`, `whiteboardLogs`, `status` | Updated Lesson JSON | Updates lecture transcripts or whiteboard coordinate vector logs. |
| `POST` | `/api/lessons/:id/summarize` | Teacher | None | Study Guide Markdown | Compiles whiteboard snapshots and transcription into a formatted Markdown study guide. |

---

## ⚡ WebSockets Real-Time API (Socket.io)

Socket.io runs alongside the HTTP engine on the configured backend port.

### Client-to-Server Emitted Events
* `join_classroom` (payload: `{ classroomId, userId, name, role }`): Binds client socket to a specific classroom namespace.
* `draw` (payload: `{ x0, y0, x1, y1, color, lineWidth }`): Syncs live whiteboard pen coordinates from teacher screen to students.
* `clear_canvas`: Broadcasts clear viewport instruction to classroom screen.
* `hand:raise`: Registers a student in the hand-raising priority queue.
* `hand:lower`: Pulls a student out of the hand-raising queue.
* `poll:vote` (payload: `{ pollId, optionIndex }`): Registers a live student vote in DB and recalculates aggregates.
* `chat:message` (payload: `text`): Sends message content to classroom chat room.

### Server-to-Client Broadcasted Events
* `queue_update` (payload: `[{ studentId, name, timestamp }]`): Broadcasts current active hand-raising list to users.
* `draw` (payload: `{ coordinates }`): Echoes drawing lines to class participants.
* `clear_canvas`: Clears canvas view on participant screens.
* `poll:results` (payload: `{ pollId, results: [{ option, votes }], totalVotes }`): Emits updated aggregate poll numbers to the classroom.
* `chat:message` (payload: `{ sender, role, text, timestamp }`): Pushes chat messages to the room.

---

## 🕒 Background Cron Jobs

The system automatically initializes standard background schedulers:
* **Weekly Parent Report Compiler:** Set to run automatically every Friday at 4:00 PM (`0 16 * * 5`). It calculates attendance rate percentages for the past 7 days, gathers recent grade averages, compiles behavioral notes, and emails progress reports to parents.
