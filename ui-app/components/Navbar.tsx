
import React, { useState, useEffect } from 'react';
import { Location } from '../types';
import { SAVED_LOCATIONS } from '../constants';

interface NavbarProps {
  currentLocation: Location;
  onLocationChange: (loc: Location) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentLocation, onLocationChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).toUpperCase();
  };

  return (
    <nav className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-50 shrink-0 shadow-2xl">
      {/* Brand & System Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-red-600 p-2 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <i className="fas fa-shield-alt text-white text-xl"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black text-white leading-none tracking-tighter">
              CRISIS<span className="text-red-500">OPS</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest mt-0.5">V4.2 // MASTER_CMD</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-slate-800">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">System Time</span>
            <span className="text-sm font-mono text-slate-300 font-bold tabular-nums">
              {formatTime(currentTime)} <span className="text-[10px] text-slate-500">UTC</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Date</span>
            <span className="text-sm font-mono text-slate-300 font-bold">
              {formatDate(currentTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search & Location */}
      <div className="flex-1 max-w-2xl px-8 flex items-center gap-3">
        <div className="relative flex-1 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors">
            <i className="fas fa-search text-sm"></i>
          </div>
          <input 
            type="text" 
            placeholder="Search coordinates, units, or incidents..." 
            className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-2 pl-10 pr-12 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 transition-all placeholder:text-slate-600"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-slate-800 text-[10px] text-slate-600 font-mono font-bold pointer-events-none">
            ⌘K
          </div>
        </div>

        <div className="relative group min-w-[180px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 animate-pulse">
            <i className="fas fa-crosshairs text-sm"></i>
          </div>
          <select
            value={currentLocation.id}
            onChange={(e) => {
              const loc = SAVED_LOCATIONS.find(l => l.id === e.target.value);
              if (loc) onLocationChange(loc);
            }}
            className="w-full bg-slate-900 text-slate-200 pl-10 pr-10 py-2 rounded-lg border border-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer hover:bg-slate-850 hover:border-slate-700 text-sm font-bold"
          >
            {SAVED_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <i className="fas fa-chevron-down text-xs"></i>
          </div>
        </div>
      </div>

      {/* Right: Utilities & User */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
          <button className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:text-white hover:bg-slate-800 transition-all" title="View Map Layers">
            <i className="fas fa-layer-group text-sm"></i>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:text-white hover:bg-slate-800 transition-all" title="Connectivity Stats">
            <i className="fas fa-satellite-dish text-sm"></i>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:text-white hover:bg-slate-800 transition-all relative" title="Notifications">
            <i className="fas fa-bell text-sm"></i>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-800 mx-1"></div>

        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-800 transition-all group">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-200 leading-none">COMMANDER</span>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Level 5 Access</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-slate-300 font-black text-xs border border-slate-600 shadow-lg group-hover:border-red-500/50 transition-colors">
            AD
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
