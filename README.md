# Anything AI

A minimal, premium AI desktop assistant that combines AI, Full Stack, and Desktop Automation into one clean application.

Built as a final-year showcase project — production-structured, lightweight, and easy to understand.

---

## Features

- **AI Chat** — Conversational chat powered by Google Gemini, with full history stored locally
- **Notes** — Create, edit, delete notes with automatic autosave
- **Files** — Search your Desktop, Documents, and Downloads folders by filename
- **Screenshot** — Capture your screen and save it locally with one click
- **Open Website** — Launch any URL in your default browser
- **Summarize PDF** — Upload a PDF and get an instant AI-generated summary
- **Settings** — Manage your Gemini API key, display name, and dark mode

---

## Tech Stack

| Layer      | Technology                        |
|------------|------------------------------------|
| Frontend   | React, Vite, TailwindCSS          |
| Desktop    | Electron                          |
| Backend    | Express.js                        |
| Database   | SQLite (better-sqlite3)           |
| AI         | Google Gemini API                 |
| Icons      | Lucide Icons                      |

---

## Design

Premium, minimal, Apple-inspired interface.

- **Background:** Warm Off White `#F8F6F2`
- **Primary:** Brown `#7A5C45`
- **Secondary:** Brown `#A27B5C`
- Rounded corners, soft shadows, no gradients, no glassmorphism, no neon
- Full dark mode support

---

## Getting Started

### 1. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set up your Gemini API key

Either:
- Add it directly in the app under **Settings** after logging in, **or**
- Copy `backend/.env.example` to `backend/.env` and fill in `GEMINI_API_KEY`

Get a free key at: https://aistudio.google.com/apikey

### 3. Run the app

\`\`\`bash
npm start
\`\`\`

This launches the Vite dev server, the Express backend, and the Electron desktop window together.

### Demo Login

\`\`\`
Email: vighnesh@anything.ai
Password: password123
\`\`\`

---

## Project Structure

\`\`\`
anything-ai/
├── electron.js          # Electron main process
├── preload.js            # Secure IPC bridge
├── backend/               # Express API + SQLite + Gemini integration
│   └── routes/            # auth, chat, notes, files, system, pdf, settings
└── frontend/               # React + Vite + Tailwind app
    └── src/
        ├── pages/           # Login, Home, AIChat, Notes, Files, Settings
        └── components/      # Sidebar, QuickActionCard, Toast, Spinner
\`\`\`

---

## Notes

- No Redux, no Docker, no microservices, no LangChain — intentionally simple architecture
- SQLite schema kept minimal: Users, Notes, Chats, Settings
- No RAG or vector database for PDF summarization — direct prompt-based summarization
