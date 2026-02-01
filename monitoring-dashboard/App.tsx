
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AlertCreator } from './components/AlertCreator';
import { UserList } from './components/UserList';
import { BackendCode } from './components/BackendCode';
import { User, Alert, SentSMS, Severity, DisasterType } from './types';

// Mock Initial Data - Populated with the 10 Residents requested
const INITIAL_USERS: User[] = [
  { 
    id: 'res-1', 
    name: 'John Doe', 
    phone: '+15550000', 
    location: { lat: 37.7749, lng: -122.4194, address: '123 Main St, San Francisco, CA' }, 
    alertRadiusKm: 10, 
    disasterTypes: ['FIRE', 'FLOOD', 'EARTHQUAKE', 'STORM'], 
    minSeverity: Severity.MEDIUM 
  },
  { 
    id: 'res-2', 
    name: 'Maria Gonzalez', 
    phone: '+14155589234', 
    location: { lat: 37.7599, lng: -122.4148, address: 'Mission District, San Francisco, CA' }, 
    alertRadiusKm: 8, 
    disasterTypes: ['FLOOD', 'STORM'], 
    minSeverity: Severity.HIGH 
  },
  { 
    id: 'res-3', 
    name: 'Ankit Sharma', 
    phone: '+919876543210', 
    location: { lat: 28.6327, lng: 77.2197, address: 'Connaught Place, New Delhi, India' }, 
    alertRadiusKm: 12, 
    disasterTypes: ['EARTHQUAKE', 'FIRE', 'CHEMICAL'], 
    minSeverity: Severity.MEDIUM 
  },
  { 
    id: 'res-4', 
    name: 'Priya Verma', 
    phone: '+919123456780', 
    location: { lat: 19.1136, lng: 72.8697, address: 'Andheri East, Mumbai, India' }, 
    alertRadiusKm: 15, 
    disasterTypes: ['FLOOD', 'STORM', 'CHEMICAL'], 
    minSeverity: Severity.HIGH 
  },
  { 
    id: 'res-5', 
    name: 'Daniel Kim', 
    phone: '+821012345678', 
    location: { lat: 37.4979, lng: 127.0276, address: 'Gangnam-gu, Seoul, South Korea' }, 
    alertRadiusKm: 6, 
    disasterTypes: ['EARTHQUAKE', 'FIRE'], 
    minSeverity: Severity.MEDIUM 
  },
  { 
    id: 'res-6', 
    name: 'Yuki Tanaka', 
    phone: '+819012345678', 
    location: { lat: 35.6938, lng: 139.7032, address: 'Shinjuku, Tokyo, Japan' }, 
    alertRadiusKm: 20, 
    disasterTypes: ['EARTHQUAKE', 'FIRE', 'STORM'], 
    minSeverity: Severity.LOW 
  },
  { 
    id: 'res-7', 
    name: 'Lucas Martin', 
    phone: '+33612345678', 
    location: { lat: 48.8919, lng: 2.2385, address: 'La Défense, Paris, France' }, 
    alertRadiusKm: 5, 
    disasterTypes: ['CHEMICAL', 'FIRE'], 
    minSeverity: Severity.MEDIUM 
  },
  { 
    id: 'res-8', 
    name: 'San Francisco Emergency Helpline', 
    phone: '+14155559911', 
    location: { lat: 37.7749, lng: -122.4194, address: 'SF Emergency Operations Center, CA' }, 
    alertRadiusKm: 25, 
    disasterTypes: ['FIRE', 'FLOOD', 'EARTHQUAKE', 'STORM', 'CHEMICAL', 'OTHER'], 
    minSeverity: Severity.LOW 
  },
  { 
    id: 'res-9', 
    name: 'City General Hospital', 
    phone: '+919999000111', 
    location: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru Central, Karnataka, India' }, 
    alertRadiusKm: 10, 
    disasterTypes: ['FIRE', 'CHEMICAL', 'EARTHQUAKE'], 
    minSeverity: Severity.LOW 
  },
  { 
    id: 'res-10', 
    name: 'Ramesh Patel', 
    phone: '+919812345678', 
    location: { lat: 23.5880, lng: 72.3693, address: 'Mehsana District, Gujarat, India' }, 
    alertRadiusKm: 30, 
    disasterTypes: ['FLOOD', 'STORM', 'EARTHQUAKE'], 
    minSeverity: Severity.MEDIUM 
  },
];

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'alerts' | 'users' | 'code'>('dashboard');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [smsLog, setSmsLog] = useState<SentSMS[]>([]);

  // Simulation of "Backend Listener"
  const handleNewAlert = (alert: Alert, notifications: SentSMS[]) => {
    setAlerts(prev => [alert, ...prev]);
    setSmsLog(prev => [...notifications, ...prev]);
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {view === 'dashboard' && (
            <Dashboard 
              users={users} 
              alerts={alerts} 
              smsLog={smsLog} 
              onNavigateToAlerts={() => setView('alerts')}
            />
          )}
          
          {view === 'alerts' && (
            <AlertCreator 
              users={users} 
              onAlertTriggered={handleNewAlert} 
            />
          )}
          
          {view === 'users' && (
            <UserList 
              users={users} 
              setUsers={setUsers} 
            />
          )}

          {view === 'code' && (
            <BackendCode />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
