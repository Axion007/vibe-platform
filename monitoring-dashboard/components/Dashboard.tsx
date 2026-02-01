
import React from 'react';
// Fix: User, Alert, and SentSMS are in types.ts
import { User, Alert, SentSMS } from '../types';
// Fix: formatDate is in utils.ts
import { formatDate } from '../utils';

interface DashboardProps {
  users: User[];
  alerts: Alert[];
  smsLog: SentSMS[];
  onNavigateToAlerts: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ users, alerts, smsLog, onNavigateToAlerts }) => {
  const stats = [
    { label: 'Registered Users', value: users.length, icon: 'fa-users', color: 'bg-blue-500' },
    { label: 'Active Alerts (Total)', value: alerts.length, icon: 'fa-triangle-exclamation', color: 'bg-amber-500' },
    { label: 'SMS Notifications', value: smsLog.length, icon: 'fa-message', color: 'bg-emerald-500' },
    { label: 'Delivery Rate', value: '100%', icon: 'fa-check-circle', color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Overview</h2>
          <p className="text-slate-400">Real-time monitoring of regional emergency broadcasts</p>
        </div>
        <button 
          onClick={onNavigateToAlerts}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Trigger New Alert
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 p-6 rounded-xl hover:border-slate-600 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white shadow-lg`}>
                <i className={`fas ${stat.icon} text-lg`}></i>
              </div>
              <span className="text-xs text-slate-500 font-mono">LIVE_STAT</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent SMS Logs */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <h3 className="font-bold flex items-center gap-2">
              <i className="fas fa-history text-slate-400"></i>
              Notification Outbox
            </h3>
            <span className="text-xs bg-slate-900 text-slate-400 px-2 py-1 rounded">Last 50 events</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Recipient</th>
                  <th className="px-6 py-3 font-semibold">Message Body</th>
                  <th className="px-6 py-3 font-semibold">Timestamp</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {smsLog.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      No notifications sent yet. Trigger an alert to begin.
                    </td>
                  </tr>
                ) : (
                  smsLog.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{log.phone}</div>
                        <div className="text-xs text-slate-500 italic">User ID: {log.userId.slice(0, 8)}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        <span title={log.body}>{log.body}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 rounded-full text-[10px] font-bold">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts List */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-4 border-b border-slate-700 bg-slate-800/50">
            <h3 className="font-bold">Recent Alerts</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <i className="fas fa-ghost text-4xl mb-3 block opacity-20"></i>
                No alert history.
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-slate-900 border border-slate-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alert.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                      alert.severity === 'HIGH' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">{formatDate(alert.createdAt)}</span>
                  </div>
                  <h4 className="font-bold text-sm text-indigo-300 mb-1">{alert.type} - {alert.location.address}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
