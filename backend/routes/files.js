const express = require('express');
const router = express.Router();
const fs = require('fs');
const os = require('os');
const path = require('path');

// Folders to search - kept simple, just common user folders
const SEARCH_DIRS = [
  path.join(os.homedir(), 'Desktop'),
  path.join(os.homedir(), 'Documents'),
  path.join(os.homedir(), 'Downloads')
];

const MAX_RESULTS = 50;

function searchDir(dir, query, results) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // folder doesn't exist or no permission - skip silently
  }

  for (const entry of entries) {
    if (results.length >= MAX_RESULTS) return;

    const fullPath = path.join(dir, entry.name);

    if (entry.name.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        name: entry.name,
        path: fullPath,
        isFolder: entry.isDirectory()
      });
    }

    // Search one level of subfolders only - no deep recursion, keeps it fast
    if (entry.isDirectory()) {
      try {
        const subEntries = fs.readdirSync(fullPath, { withFileTypes: true });
        for (const sub of subEntries) {
          if (results.length >= MAX_RESULTS) return;
          if (sub.name.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              name: sub.name,
              path: path.join(fullPath, sub.name),
              isFolder: sub.isDirectory()
            });
          }
        }
      } catch {
        // skip inaccessible subfolder
      }
    }
  }
}

// GET /api/files/search?q=filename
router.get('/files/search', (req, res) => {
  const query = (req.query.q || '').trim();

  if (!query) {
    return res.status(400).json({ success: false, message: 'Search query is required.' });
  }

  const results = [];
  for (const dir of SEARCH_DIRS) {
    if (results.length >= MAX_RESULTS) break;
    searchDir(dir, query, results);
  }

  return res.json({ success: true, results });
});

module.exports = router;
