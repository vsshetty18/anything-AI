const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'anything-ai.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// ---- Schema ----

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT DEFAULT 'Vighnesh'
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,        -- 'user' or 'ai'
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    gemini_api_key TEXT DEFAULT '',
    dark_mode INTEGER DEFAULT 0,
    user_name TEXT DEFAULT 'Vighnesh'
  );
`);

// ---- Seed dummy user (only if none exists) ----
const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get();
if (userCount.count === 0) {
  db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)')
    .run('vighnesh@anything.ai', 'password123', 'Vighnesh');
}

// ---- Seed default settings row (only if none exists) ----
const settingsCount = db.prepare('SELECT COUNT(*) AS count FROM settings').get();
if (settingsCount.count === 0) {
  db.prepare('INSERT INTO settings (id, gemini_api_key, dark_mode, user_name) VALUES (1, ?, 0, ?)')
    .run('', 'Vighnesh');
}

module.exports = db;
