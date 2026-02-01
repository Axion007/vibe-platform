
import React from 'react';
import { Alert } from '../types';
import AlertCard from './AlertCard';

interface AlertFeedProps {
  alerts: Alert[];
  selectedId: string | null;
  onAlertSelect: (id: string) => void;
  onAcknowledge: (id: string) => void;
  onMarkSafe: (id: string) => void;
  onViewOnMap: (alert: Alert) => void;
  loading: boolean;
}

const AlertFeed: React.FC<AlertFeedProps> = ({ 
  alerts, 
  selectedId, 
  onAlertSelect, 
  onAcknowledge, 
  onMarkSafe, 
  onViewOnMap,
  loading 
}) => {
  return (
    <div className="w-80 md:w-96 flex flex-col bg-slate-900 border-r border-slate-800 shrink-0 h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Incident Feed</h2>
        <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {alerts.length} Total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-800/50 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : alerts.length > 0 ? (
          alerts.map(alert => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              isSelected={selectedId === alert.id}
              onClick={() => onAlertSelect(alert.id)}
              onAcknowledge={onAcknowledge}
              onMarkSafe={onMarkSafe}
              onViewOnMap={onViewOnMap}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <i className="fas fa-check-circle text-4xl mb-4 text-slate-700"></i>
            <p className="text-sm font-medium">All clear. No active alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertFeed;
