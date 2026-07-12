import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Folder, Notebook, Settings, LogOut } from 'lucide-react';

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/chat', label: 'AI Chat', icon: MessageSquare },
  { to: '/files', label: 'Files', icon: Folder },
  { to: '/notes', label: 'Notes', icon: Notebook },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="w-64 bg-card border-r border-secondary/10 flex flex-col p-6">
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-primary">Anything AI</h1>
        <p className="text-sm text-textDark/50 mt-1">{user?.name || 'Welcome'}</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="sidebar-link mt-4 text-textDark/50 hover:text-primary"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
