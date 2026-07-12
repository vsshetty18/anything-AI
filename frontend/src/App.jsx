import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import AIChat from './pages/AIChat.jsx';
import Notes from './pages/Notes.jsx';
import Files from './pages/Files.jsx';
import Settings from './pages/Settings.jsx';
import { api } from './api.js';

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('anything-ai-user');
    return stored ? JSON.parse(stored) : null;
  });

  // Apply dark mode class on load, based on saved settings
  useEffect(() => {
    if (!user) return;

    api.getSettings()
      .then((res) => {
        if (res.settings?.dark_mode) {
          document.documentElement.classList.add('dark');
        }
      })
      .catch(() => {
        // settings fetch failed silently - not critical for app to function
      });
  }, [user]);

  function handleLogin(userData) {
    localStorage.setItem('anything-ai-user', JSON.stringify(userData));
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem('anything-ai-user');
    setUser(null);
    document.documentElement.classList.remove('dark');
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home user={user} />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/files" element={<Files />} />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  );
}
