
import React from 'react';
import { Alert, Severity } from '../types';
import { SEVERITY_COLORS } from '../constants';

interface AlertCardProps {
  alert: Alert;
  isSelected: boolean;
  onClick: () => void;
  onAcknowledge: (id: string) => void;
  onMarkSafe: (id: string) => void;
  onViewOnMap: (alert: Alert) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ 
  alert, 
  isSelected, 
  onClick, 
  onAcknowledge, 
  onMarkSafe, 
  onViewOnMap 
}) => {
  const getSeverityIcon = (sev: Severity) => {
    switch (sev) {
      case 'critical': return 'fa-exclamation-triangle';
      case 'high': return 'fa-fire';
      case 'medium': return 'fa-info-circle';
      default: return 'fa-dot-circle';
    }
  };

  const isResolved = alert.status !== 'active';

  return (
    <div 
      onClick={onClick}
      className={`p-4 border-l-4 transition-all duration-200 cursor-pointer mb-3 rounded-r-lg group
        ${isSelected ? 'bg-slate-800 border-red-500 shadow-lg shadow-black/40' : 'bg-slate-850 border-transparent hover:bg-slate-800/60'}
        ${isResolved ? 'opacity-60 grayscale-[0.5]' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${SEVERITY_COLORS[alert.severity]}`}>
          {alert.severity}
        </span>
        <span className="text-slate-500 text-[10px] flex items-center gap-1">
          <i className="far fa-clock"></i>
          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <h3 className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
        {alert.title}
      </h3>
      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
        {alert.description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50 mt-2">
        {alert.status === 'active' ? (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); onAcknowledge(alert.id); }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold py-1.5 rounded transition-colors uppercase tracking-wider"
            >
              Acknowledge
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMarkSafe(alert.id); }}
              className="flex-1 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white text-[10px] font-bold py-1.5 rounded transition-all uppercase tracking-wider"
            >
              Safe
            </button>
          </>
        ) : (
          <div className="flex-1 text-[10px] font-bold text-center py-1.5 rounded bg-slate-800 text-slate-500 uppercase tracking-widest italic">
            {alert.status}
          </div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onViewOnMap(alert); }}
          className={`px-3 py-1.5 rounded transition-colors ${isSelected ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
          title="View on Map"
        >
          <i className="fas fa-location-arrow text-[10px]"></i>
        </button>
      </div>
    </div>
  );
};

export default AlertCard;
