const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const notesRoutes = require('./routes/notes');
const filesRoutes = require('./routes/files');
const systemRoutes = require('./routes/system');
const pdfRoutes = require('./routes/pdf');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from your deployed frontend (Vercel) and local dev.
// Set FRONTEND_URL on Render to your Vercel domain, e.g. https://anything-ai.vercel.app
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Electron desktop app, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Mount all routes under /api
app.use('/api', authRoutes);
app.use('/api', chatRoutes);
app.use('/api', notesRoutes);
app.use('/api', filesRoutes);
app.use('/api', systemRoutes);
app.use('/api', pdfRoutes);
app.use('/api', settingsRoutes);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Anything AI backend is running.' });
});

// Friendly error handler for anything unhandled
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Anything AI backend running on http://localhost:${PORT}`);
});
