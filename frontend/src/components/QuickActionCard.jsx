import React from 'react';

export default function QuickActionCard({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card flex flex-col items-start gap-3 hover:shadow-md text-left w-full"
    >
      <div className="w-11 h-11 rounded-card bg-primary/10 flex items-center justify-center">
        <Icon size={20} className="text-primary" />
      </div>
      <span className="font-medium text-textDark">{label}</span>
    </button>
  );
}
