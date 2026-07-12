import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { api } from '../api.js';
import Spinner from '../components/Spinner.jsx';
import Toast from '../components/Toast.jsx';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await api.getSettings();
      setApiKey(res.settings.gemini_api_key || '');
      setDarkMode(!!res.settings.dark_mode);
      setUserName(res.settings.user_name || '');
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function toggleDarkMode() {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateSettings({
        gemini_api_key: apiKey,
        dark_mode: darkMode,
        user_name: userName
      });
      setToast({ message: 'Settings saved successfully.', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={22} />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-textDark mb-6">Settings</h1>

      <div className="card flex flex-col gap-6">
        <div>
          <label className="text-sm text-textDark/70 mb-1.5 block">User Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="input-field"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="text-sm text-textDark/70 mb-1.5 block">Gemini API Key</label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="input-field pr-11"
              placeholder="Enter your Gemini API key"
            />
            <button
              type="button"
              onClick={() => setShowApiKey((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-textDark/40 hover:text-textDark"
            >
              {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-textDark/40 mt-1.5">
            Required for AI Chat and PDF Summarize features.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-textDark font-medium">Dark Mode</p>
            <p className="text-xs text-textDark/40">Switch to a darker color theme</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-7 rounded-full transition-colors duration-200 relative ${
              darkMode ? 'bg-primary' : 'bg-secondary/20'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center justify-center gap-2 mt-2"
        >
          {saving ? <Spinner size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
