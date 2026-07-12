import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { api } from '../api.js';
import Spinner from '../components/Spinner.jsx';
import Toast from '../components/Toast.jsx';

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [toast, setToast] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadHistory() {
    try {
      const res = await api.getChatHistory();
      setMessages(res.history || []);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoadingHistory(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setInput('');
    setSending(true);

    // Optimistically show the user's message right away
    setMessages((prev) => [...prev, { role: 'user', message: trimmed, id: `temp-${Date.now()}` }]);

    try {
      const res = await api.sendChatMessage(trimmed);
      setMessages((prev) => [...prev, { role: 'ai', message: res.reply, id: `ai-${Date.now()}` }]);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-semibold text-textDark mb-6">AI Chat</h1>

      <div className="flex-1 overflow-y-auto card mb-4 flex flex-col gap-4">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full text-textDark/40">
            <Spinner size={20} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-textDark/40 text-sm">
            Ask me anything to get started.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-8 h-8 rounded-card bg-primary/10 flex items-center justify-center shrink-0">
                {msg.role === 'user' ? (
                  <User size={16} className="text-primary" />
                ) : (
                  <Bot size={16} className="text-primary" />
                )}
              </div>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-card text-sm whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-secondary/10 text-textDark'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        )}

        {sending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-card bg-primary/10 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-primary" />
            </div>
            <div className="px-4 py-2.5 rounded-card bg-secondary/10">
              <Spinner size={14} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input-field"
          disabled={sending}
        />
        <button type="submit" disabled={sending || !input.trim()} className="btn-primary shrink-0">
          <Send size={18} />
        </button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
