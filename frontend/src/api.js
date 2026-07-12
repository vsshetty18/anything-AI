const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
}

export const api = {
  // ---- Auth ----
  login: (email, password) =>
    request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // ---- Chat ----
  sendChatMessage: (message) =>
    request('/chat', { method: 'POST', body: JSON.stringify({ message }) }),

  getChatHistory: () => request('/chat/history'),

  // ---- Notes ----
  getNotes: () => request('/notes'),

  createNote: (title, content) =>
    request('/notes', { method: 'POST', body: JSON.stringify({ title, content }) }),

  updateNote: (id, title, content) =>
    request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify({ title, content }) }),

  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),

  // ---- Files ----
  searchFiles: (query) => request(`/files/search?q=${encodeURIComponent(query)}`),

  // ---- System (open website / screenshot - OS fallback if not in Electron) ----
  openWebsite: (url) =>
    request('/system/open-website', { method: 'POST', body: JSON.stringify({ url }) }),

  takeScreenshot: () => request('/system/screenshot', { method: 'POST' }),

  // ---- PDF ----
  summarizePdf: (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    return request('/pdf/summarize', { method: 'POST', body: formData });
  },

  // ---- Settings ----
  getSettings: () => request('/settings'),

  updateSettings: (settings) =>
    request('/settings', { method: 'POST', body: JSON.stringify(settings) })
};
