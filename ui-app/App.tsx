
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AlertFeed from './components/AlertFeed';
import MapContainer from './components/MapContainer';
import { Location, Alert, MapState } from './types';
import { SAVED_LOCATIONS } from './constants';
import { fetchAlertsForLocation } from './services/geminiService';

const App: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location>(SAVED_LOCATIONS[0]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapState, setMapState] = useState<MapState>({
    center: { lat: SAVED_LOCATIONS[0].lat, lng: SAVED_LOCATIONS[0].lng },
    zoom: SAVED_LOCATIONS[0].zoom,
    highlightedAlertId: null
  });

  // Fetch alerts whenever location changes
  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      const data = await fetchAlertsForLocation(currentLocation);
      setAlerts(data);
      setLoading(false);
      
      // Recenter map on location change
      setMapState({
        center: { lat: currentLocation.lat, lng: currentLocation.lng },
        zoom: currentLocation.zoom,
        highlightedAlertId: null
      });
    };

    loadAlerts();
  }, [currentLocation]);

  // Handle Location Switcher
  const handleLocationChange = (loc: Location) => {
    setCurrentLocation(loc);
  };

  // Sync Feed and Map
  const handleAlertSelect = useCallback((id: string) => {
    setMapState(prev => {
      const selectedAlert = alerts.find(a => a.id === id);
      if (selectedAlert) {
        return {
          ...prev,
          center: { lat: selectedAlert.lat, lng: selectedAlert.lng },
          zoom: 15, // Zoom in closer for specific alerts
          highlightedAlertId: id
        };
      }
      return prev;
    });
  }, [alerts]);

  // Alert Actions
  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'acknowledged' as const } : a
    ));
  };

  const handleMarkSafe = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'safe' as const } : a
    ));
  };

  const handleViewOnMap = (alert: Alert) => {
    handleAlertSelect(alert.id);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      <Navbar 
        currentLocation={currentLocation} 
        onLocationChange={handleLocationChange} 
      />
      
      <main className="flex flex-1 overflow-hidden">
        <AlertFeed 
          alerts={alerts}
          loading={loading}
          selectedId={mapState.highlightedAlertId}
          onAlertSelect={handleAlertSelect}
          onAcknowledge={handleAcknowledge}
          onMarkSafe={handleMarkSafe}
          onViewOnMap={handleViewOnMap}
        />
        
        <MapContainer 
          alerts={alerts}
          mapState={mapState}
          onAlertClick={handleAlertSelect}
        />
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">System Operational</span>
          </div>
          <div className="text-[10px] text-slate-600">
            SECURE LINK ESTABLISHED
          </div>
        </div>
        <div className="text-[10px] text-slate-600 font-mono">
          REFRESH_RATE: 30s | NODES: 24 | LATENCY: 42ms
        </div>
      </footer>
    </div>
  );
};

export default App;
