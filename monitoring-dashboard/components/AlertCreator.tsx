
import React, { useState } from 'react';
import { User, Alert, Severity, DisasterType, SEVERITY_ORDER, SentSMS, NotificationDocument } from '../types';
import { calculateDistance } from '../utils';
import { generateNotificationPayload, generateImpactReport } from '../gemini';

interface ImpactReport {
  score: number;
  usersAffected: number;
  summary: string;
  plan: string;
}

interface AlertCreatorProps {
  users: User[];
  onAlertTriggered: (alert: Alert, notifications: SentSMS[]) => void;
}

export const AlertCreator: React.FC<AlertCreatorProps> = ({ users, onAlertTriggered }) => {
  const [formData, setFormData] = useState({
    type: 'FIRE' as DisasterType,
    severity: Severity.HIGH,
    address: 'Mission District, San Francisco',
    lat: 37.7599,
    lng: -122.4148,
    message: 'Brush fire reported near Bernal Heights. High winds may cause rapid spreading.',
    radius: 10,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<NotificationDocument[]>([]);
  const [impactReport, setImpactReport] = useState<ImpactReport | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setGeneratedDocs([]);
    setImpactReport(null);

    const newAlert: Alert = {
      id: crypto.randomUUID(),
      type: formData.type,
      severity: formData.severity,
      location: {
        lat: formData.lat,
        lng: formData.lng,
        address: formData.address
      },
      message: formData.message,
      createdAt: Date.now()
    };

    if (SEVERITY_ORDER[newAlert.severity] < SEVERITY_ORDER[Severity.HIGH]) {
      alert("System Policy: Automatic SMS is only triggered for HIGH or CRITICAL severity.");
      setIsProcessing(false);
      return;
    }

    const matchedUsers = users.filter(user => {
      const typeMatch = user.disasterTypes.includes(newAlert.type);
      const severityMatch = SEVERITY_ORDER[newAlert.severity] >= SEVERITY_ORDER[user.minSeverity];
      const distance = calculateDistance(
        newAlert.location.lat, 
        newAlert.location.lng,
        user.location.lat,
        user.location.lng
      );
      // Use the radius from form for the logic filter if needed, or user's specific radius
      return typeMatch && severityMatch && (distance <= user.alertRadiusKm);
    });

    const [smsText, aiReport] = await Promise.all([
      generateNotificationPayload(newAlert),
      generateImpactReport(newAlert, matchedUsers.length)
    ]);

    // Heuristics for Score and Population
    const severityBase = SEVERITY_ORDER[newAlert.severity] === 3 ? 85 : 65; // CRITICAL vs HIGH
    const radiusBonus = Math.min(formData.radius * 1.5, 15);
    const impactScore = Math.min(Math.round((severityBase + radiusBonus) * (aiReport.densityFactor || 1)), 100);
    
    // Estimated population: simulator matches * 250 (heuristic for density)
    const estPop = Math.max(matchedUsers.length * 250, Math.round(formData.radius * formData.radius * 150));

    setImpactReport({
      score: impactScore,
      usersAffected: estPop,
      summary: aiReport.assessmentSummary,
      plan: aiReport.recommendedResponse
    });

    const docs: NotificationDocument[] = matchedUsers.map(user => ({
      id: crypto.randomUUID(),
      userId: user.id,
      alertId: newAlert.id,
      phone: user.phone,
      message: smsText,
      severity: newAlert.severity,
      channel: 'SMS_SIMULATED',
      status: 'DELIVERED',
      timestamp: Date.now()
    }));

    const sentLog: SentSMS[] = docs.map(d => ({
      id: d.id,
      alertId: d.alertId,
      userId: d.userId,
      phone: d.phone,
      body: d.message,
      timestamp: d.timestamp,
      status: 'DELIVERED'
    }));

    onAlertTriggered(newAlert, sentLog);
    setGeneratedDocs(docs);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Alert Dispatch Center</h2>
            <p className="text-indigo-100 opacity-80 text-sm">Target critical areas and notify affected residents.</p>
          </div>
          <i className="fas fa-satellite-dish text-3xl opacity-50"></i>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disaster Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as DisasterType }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              >
                <option value="FIRE">Wildfire / Structural Fire</option>
                <option value="FLOOD">Flood Warning</option>
                <option value="STORM">Severe Storm / Hurricane</option>
                <option value="EARTHQUAKE">Earthquake Response</option>
                <option value="CHEMICAL">Hazmat / Chemical Leak</option>
                <option value="OTHER">Other Emergency</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Severity Level</label>
              <select 
                value={formData.severity}
                onChange={e => setFormData(prev => ({ ...prev, severity: e.target.value as Severity }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              >
                <option value={Severity.HIGH}>High (Action Required)</option>
                <option value={Severity.CRITICAL}>Critical (Life Safety)</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Address</label>
              <input 
                type="text"
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Impact Radius (KM)</label>
              <input 
                type="number"
                value={formData.radius}
                onChange={e => setFormData(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
               <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lat</label>
                <input 
                  type="number" step="any"
                  value={formData.lat}
                  onChange={e => setFormData(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lng</label>
                <input 
                  type="number" step="any"
                  value={formData.lng}
                  onChange={e => setFormData(prev => ({ ...prev, lng: parseFloat(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Incident Briefing</label>
            <textarea 
              rows={3}
              value={formData.message}
              onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Provide a technical summary of the emergency..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
              isProcessing ? 'bg-slate-700 cursor-not-allowed text-slate-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner animate-spin"></i>
                Analyzing Impact & Routing...
              </>
            ) : (
              <>
                <i className="fas fa-broadcast-tower"></i>
                Initiate Emergency Broadcast
              </>
            )}
          </button>
        </form>
      </div>

      {impactReport && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden animate-fadeIn shadow-2xl">
          <div className="bg-slate-900 p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-indigo-400 uppercase tracking-widest text-sm">
              <i className="fas fa-chart-pie"></i>
              Post-Deployment Impact Analysis
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">ID: {crypto.randomUUID().slice(0,8)}</span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 flex items-center justify-center">
                  <svg className="absolute inset-0 h-full w-full -rotate-90">
                    <circle cx="48" cy="48" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-700" />
                    <circle cx="48" cy="48" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={276} strokeDashoffset={276 - (276 * impactReport.score) / 100} className="text-indigo-500 transition-all duration-1000" />
                  </svg>
                  <span className="text-2xl font-black text-white">{impactReport.score}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Impact Score</p>
                  <p className="text-lg font-bold text-white">Scale: {impactReport.score}/100</p>
                  <p className="text-xs text-slate-400">Calculated based on severity, density, and geography.</p>
                </div>
              </div>
              <div className="flex items-center gap-6 border-l border-slate-700 pl-8">
                <div className="bg-indigo-500/10 p-4 rounded-full text-indigo-400">
                  <i className="fas fa-users-viewfinder text-3xl"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Users Affected</p>
                  <p className="text-3xl font-black text-white">{impactReport.usersAffected.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">Projected residents in notification zone.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t border-slate-700 pt-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assessment Summary</h4>
                <p className="text-slate-200 leading-relaxed font-medium italic">"{impactReport.summary}"</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recommended Response</h4>
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg text-indigo-100 text-sm whitespace-pre-line leading-relaxed">
                  {impactReport.plan}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {generatedDocs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              <i className="fas fa-database"></i>
              Firestore Persistence Log
            </h3>
            <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-2 py-1 rounded">Channel: SMS_SIMULATED</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {generatedDocs.map((doc, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-4 overflow-x-auto shadow-inner group">
                <div className="flex justify-between mb-2">
                   <span className="text-[10px] text-slate-600 font-mono">DOC_ID: {doc.id}</span>
                   <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Status: {doc.status}</span>
                </div>
                <pre className="text-indigo-300 text-[10px] font-mono leading-relaxed">
                  {JSON.stringify(doc, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
