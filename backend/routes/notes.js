const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/notes - fetch all notes
router.get('/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all();
  return res.json({ success: true, notes });
});

// POST /api/notes - create a new note
router.post('/notes', (req, res) => {
  const { title, content } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Title is required.' });
  }

  const result = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)')
    .run(title, content || '');

  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
  return res.json({ success: true, note });
});

// PUT /api/notes/:id - update a note (used for edit + autosave)
router.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const existing = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Note not found.' });
  }

  db.prepare(`
    UPDATE notes
    SET title = ?, content = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(title ?? existing.title, content ?? existing.content, id);

  const updated = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
  return res.json({ success: true, note: updated });
});

// DELETE /api/notes/:id - delete a note
router.delete('/notes/:id', (req, res) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Note not found.' });
  }

  db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  return res.json({ success: true });
});

module.exports = router;
