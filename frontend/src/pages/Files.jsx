import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, File, Folder } from 'lucide-react';
import { api } from '../api.js';
import Spinner from '../components/Spinner.jsx';
import Toast from '../components/Toast.jsx';

export default function Files() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      runSearch(initialQuery);
    }
  }, []);

  async function runSearch(q) {
    const trimmed = (q ?? query).trim();
    if (!trimmed) return;

    setLoading(true);
    setResults(null);

    try {
      const res = await api.searchFiles(trimmed);
      setResults(res.results || []);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    runSearch(query);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-textDark mb-6">Files</h1>

      <form onSubmit={handleSubmit} className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-textDark/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a file or folder by name..."
          className="input-field pl-11"
        />
      </form>

      <div className="card min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full py-12">
            <Spinner size={20} />
          </div>
        ) : results === null ? (
          <div className="flex items-center justify-center py-12 text-textDark/40 text-sm">
            Search your Desktop, Documents, and Downloads folders.
          </div>
        ) : results.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-textDark/40 text-sm">
            No files found matching "{query}".
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {results.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-card hover:bg-primary/5 transition-colors"
              >
                {item.isFolder ? (
                  <Folder size={16} className="text-secondary shrink-0" />
                ) : (
                  <File size={16} className="text-textDark/40 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm text-textDark truncate">{item.name}</p>
                  <p className="text-xs text-textDark/40 truncate">{item.path}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
