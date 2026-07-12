const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

module.exports = router;
