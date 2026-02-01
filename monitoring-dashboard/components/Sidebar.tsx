
import React from 'react';

interface SidebarProps {
  currentView: string;
  setView: (view: 'dashboard' | 'alerts' | 'users' | 'code') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-line', label: 'Overview' },
    { id: 'alerts', icon: 'fa-bullhorn', label: 'Dispatch Alert' },
    { id: 'users', icon: 'fa-users', label: 'User Registry' },
    { id: 'code', icon: 'fa-code', label: 'Cloud Function' },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
          <i className="fas fa-tower-broadcast"></i>
          GeoAlert
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">SMS Engine</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-900 rounded-lg p-3 text-xs text-slate-500">
          <p className="font-mono">Node: v18.x</p>
          <p className="font-mono">Runtime: Firebase v10</p>
          <div className="mt-2 flex items-center gap-2 text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Simulator Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
