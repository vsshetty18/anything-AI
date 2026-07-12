import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, FileText, Camera, Globe, Clock } from 'lucide-react';
import QuickActionCard from '../components/QuickActionCard.jsx';
import Toast from '../components/Toast.jsx';
import Spinner from '../components/Spinner.jsx';
import { api } from '../api.js';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Home({ user }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [pdfSummary, setPdfSummary] = useState('');
  const [loadingAction, setLoadingAction] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  async function loadRecentActivity() {
    try {
      const [notesRes, chatRes] = await Promise.all([api.getNotes(), api.getChatHistory()]);

      const noteItems = (notesRes.notes || []).slice(0, 3).map((n) => ({
        type: 'note',
        label: `Note updated: ${n.title}`,
        time: n.updated_at
      }));

      const chatItems = (chatRes.history || [])
        .filter((c) => c.role === 'user')
        .slice(-3)
        .map((c) => ({
          type: 'chat',
          label: `Asked AI: ${c.message.slice(0, 50)}`,
          time: c.created_at
        }));

      const combined = [...noteItems, ...chatItems]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);

      setRecentActivity(combined);
    } catch {
      // non-critical - fail silently, home page still works without it
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/files?q=${encodeURIComponent(searchQuery)}`);
  }

  async function handleScreenshot() {
    setLoadingAction('screenshot');
    try {
      const result = window.desktop
        ? await window.desktop.takeScreenshot()
        : await api.takeScreenshot();

      if (result.success) {
        setToast({ message: `Screenshot saved: ${result.fileName}`, type: 'success' });
      } else {
        setToast({ message: result.error || 'Screenshot failed.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoadingAction('');
    }
  }

  async function handleOpenWebsite() {
    if (!websiteUrl.trim()) return;
    setLoadingAction('website');
    try {
      if (window.desktop) {
        await window.desktop.openWebsite(websiteUrl);
      } else {
        await api.openWebsite(websiteUrl);
      }
      setToast({ message: 'Website opened.', type: 'success' });
      setWebsiteUrl('');
      setShowWebsiteInput(false);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoadingAction('');
    }
  }

  async function handlePdfUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingAction('pdf');
    setPdfSummary('');
    try {
      const res = await api.summarizePdf(file);
      setPdfSummary(res.summary);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoadingAction('');
      e.target.value = '';
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textDark">
          {getGreeting()}, {user?.name || 'there'}
        </h1>
        <p className="text-textDark/50 mt-1">What would you like to do today?</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-textDark/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search files..."
          className="input-field pl-11"
        />
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <QuickActionCard icon={MessageSquare} label="Ask AI" onClick={() => navigate('/chat')} />
        <QuickActionCard
          icon={FileText}
          label="Summarize PDF"
          onClick={() => fileInputRef.current?.click()}
        />
        <QuickActionCard icon={Camera} label="Screenshot" onClick={handleScreenshot} />
        <QuickActionCard
          icon={Globe}
          label="Open Website"
          onClick={() => setShowWebsiteInput((v) => !v)}
        />
      </div>

      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handlePdfUpload}
        className="hidden"
      />

      {showWebsiteInput && (
        <div className="card mb-8 flex gap-3 items-center">
          <input
            type="text"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="example.com"
            className="input-field"
            onKeyDown={(e) => e.key === 'Enter' && handleOpenWebsite()}
          />
          <button onClick={handleOpenWebsite} disabled={loadingAction === 'website'} className="btn-primary shrink-0">
            {loadingAction === 'website' ? <Spinner size={16} /> : 'Open'}
          </button>
        </div>
      )}

      {loadingAction === 'pdf' && (
        <div className="card mb-8 flex items-center gap-3 text-textDark/60">
          <Spinner size={18} />
          Summarizing your PDF...
        </div>
      )}

      {pdfSummary && (
        <div className="card mb-8">
          <h3 className="font-medium text-textDark mb-3">PDF Summary</h3>
          <p className="text-sm text-textDark/70 whitespace-pre-line">{pdfSummary}</p>
        </div>
      )}

      <div className="card">
        <h3 className="font-medium text-textDark mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-textDark/40">No recent activity yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-textDark/70">
                <Clock size={14} className="text-textDark/30 shrink-0" />
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
