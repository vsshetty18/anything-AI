import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { api } from '../api.js';
import Spinner from '../components/Spinner.jsx';
import Toast from '../components/Toast.jsx';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved'
  const [toast, setToast] = useState(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const res = await api.getNotes();
      setNotes(res.notes || []);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function selectNote(note) {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  async function handleCreateNote() {
    try {
      const res = await api.createNote('Untitled Note', '');
      setNotes((prev) => [res.note, ...prev]);
      selectNote(res.note);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  }

  async function handleDeleteNote(id, e) {
    e.stopPropagation();
    try {
      await api.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeNote?.id === id) {
        setActiveNote(null);
        setTitle('');
        setContent('');
      }
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  }

  // Autosave: debounce 800ms after the user stops typing
  function handleFieldChange(newTitle, newContent) {
    setTitle(newTitle);
    setContent(newContent);
    setSaveStatus('saving');

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      if (!activeNote) return;
      try {
        const res = await api.updateNote(activeNote.id, newTitle, newContent);
        setNotes((prev) =>
          prev
            .map((n) => (n.id === activeNote.id ? res.note : n))
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        );
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 1500);
      } catch (err) {
        setToast({ message: err.message, type: 'error' });
        setSaveStatus('');
      }
    }, 800);
  }

  return (
    <div className="max-w-5xl mx-auto flex gap-6 h-[calc(100vh-4rem)]">
      {/* Notes list */}
      <div className="w-72 shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-textDark">Notes</h1>
          <button onClick={handleCreateNote} className="btn-primary p-2">
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {loading ? (
            <div className="flex justify-center py-6">
              <Spinner size={18} />
            </div>
          ) : notes.length === 0 ? (
            <p className="text-sm text-textDark/40 px-2">No notes yet. Create one!</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                className={`card cursor-pointer flex items-start justify-between gap-2 !p-4 ${
                  activeNote?.id === note.id ? 'ring-2 ring-primary/30' : ''
                }`}
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm text-textDark truncate">{note.title}</p>
                  <p className="text-xs text-textDark/40 truncate mt-1">
                    {note.content || 'No content'}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  className="text-textDark/30 hover:text-red-400 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 card flex flex-col">
        {!activeNote ? (
          <div className="flex-1 flex items-center justify-center text-textDark/40 text-sm">
            Select a note or create a new one.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => handleFieldChange(e.target.value, content)}
                className="text-lg font-semibold text-textDark bg-transparent focus:outline-none w-full"
                placeholder="Note title"
              />
              {saveStatus === 'saving' && <Spinner size={14} />}
              {saveStatus === 'saved' && <Check size={16} className="text-primary" />}
            </div>
            <textarea
              value={content}
              onChange={(e) => handleFieldChange(title, e.target.value)}
              className="flex-1 bg-transparent focus:outline-none resize-none text-sm text-textDark/80 leading-relaxed"
              placeholder="Start writing..."
            />
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
