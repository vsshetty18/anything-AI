const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { summarizeText } = require('../gemini');

// Store uploaded PDFs in memory - no need to save to disk, we only need the text
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/pdf/summarize - upload a PDF, extract text, summarize with Gemini
router.post('/pdf/summarize', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'PDF file is required.' });
  }

  try {
    const data = await pdfParse(req.file.buffer);
    const extractedText = data.text.trim();

    if (!extractedText) {
      return res.status(400).json({ success: false, message: 'Could not extract text from this PDF.' });
    }

    // Gemini has input limits - trim very long documents to keep it simple
    const trimmedText = extractedText.slice(0, 15000);

    const summary = await summarizeText(trimmedText);

    return res.json({ success: true, summary });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
