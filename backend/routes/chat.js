const express = require('express');
const router = express.Router();
const db = require('../db');
const { chatWithGemini } = require('../gemini');

// POST /api/chat - send a message, get Gemini's reply
router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }

  try {
    // Save user message
    db.prepare('INSERT INTO chats (role, message) VALUES (?, ?)').run('user', message);

    // Get AI reply
    const reply = await chatWithGemini(message);

    // Save AI reply
    db.prepare('INSERT INTO chats (role, message) VALUES (?, ?)').run('ai', reply);

    return res.json({ success: true, reply });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/chat/history - fetch all past chat messages
router.get('/chat/history', (req, res) => {
  const history = db.prepare('SELECT * FROM chats ORDER BY id ASC').all();
  return res.json({ success: true, history });
});

module.exports = router;
