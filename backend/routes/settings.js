const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/settings - fetch current settings
router.get('/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  return res.json({ success: true, settings });
});

// POST /api/settings - update settings (Gemini API key, dark mode, user name)
router.post('/settings', (req, res) => {
  const { gemini_api_key, dark_mode, user_name } = req.body;

  const existing = db.prepare('SELECT * FROM settings WHERE id = 1').get();

  db.prepare(`
    UPDATE settings
    SET gemini_api_key = ?, dark_mode = ?, user_name = ?
    WHERE id = 1
  `).run(
    gemini_api_key ?? existing.gemini_api_key,
    dark_mode !== undefined ? (dark_mode ? 1 : 0) : existing.dark_mode,
    user_name ?? existing.user_name
  );

  const updated = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  return res.json({ success: true, settings: updated });
});

module.exports = router;
