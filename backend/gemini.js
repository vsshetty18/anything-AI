const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('./db');

function getApiKey() {
  const row = db.prepare('SELECT gemini_api_key FROM settings WHERE id = 1').get();
  return (row && row.gemini_api_key) || process.env.GEMINI_API_KEY || '';
}

function getModel() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not set. Please add it in Settings.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
}

// ---- Simple chat reply ----
async function chatWithGemini(message) {
  const model = getModel();
  const result = await model.generateContent(message);
  const response = result.response;
  return response.text();
}

// ---- Summarize extracted PDF text ----
async function summarizeText(text) {
  const model = getModel();
  const prompt = `Summarize the following document in clear, concise bullet points. Keep it short and easy to read:\n\n${text}`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

module.exports = { chatWithGemini, summarizeText };
