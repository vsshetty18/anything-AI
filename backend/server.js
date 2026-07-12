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

app.use(cors());
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
