
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Alert, MapState } from '../types';

interface MapContainerProps {
  alerts: Alert[];
  mapState: MapState;
  onAlertClick: (id: string) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ alerts, mapState, onAlertClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([mapState.center.lat, mapState.center.lng], mapState.zoom);

    // Add high-performance dark theme tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // Add Zoom Control at custom position
    L.control.zoom({ position: 'topright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update View when MapState changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const currentCenter = mapInstanceRef.current.getCenter();
    const currentZoom = mapInstanceRef.current.getZoom();

    const targetCenter = [mapState.center.lat, mapState.center.lng] as L.LatLngExpression;
    const targetZoom = mapState.zoom;

    // Only animate if there's a significant change
    if (
      Math.abs(currentCenter.lat - mapState.center.lat) > 0.0001 ||
      Math.abs(currentCenter.lng - mapState.center.lng) > 0.0001 ||
      currentZoom !== targetZoom
    ) {
      mapInstanceRef.current.flyTo(targetCenter, targetZoom, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [mapState.center, mapState.zoom]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    alerts.forEach(alert => {
      const isSelected = mapState.highlightedAlertId === alert.id;
      const color = alert.severity === 'critical' ? '#ef4444' : 
                    alert.severity === 'high' ? '#f97316' : 
                    alert.severity === 'medium' ? '#fbbf24' : '#60a5fa';

      // Custom Marker Icon
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative; width: 12px; height: 12px;">
            ${isSelected ? `<div class="marker-pulse" style="background: ${color}"></div>` : ''}
            <div style="
              width: 12px; 
              height: 12px; 
              background: ${color}; 
              border: 2px solid white; 
              border-radius: 50%;
              box-shadow: 0 0 10px ${color};
              z-index: 2;
              position: relative;
            "></div>
          </div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      // Impact Radius Circle
      const circle = L.circle([alert.lat, alert.lng], {
        radius: alert.radius,
        color: color,
        fillColor: color,
        fillOpacity: isSelected ? 0.25 : 0.1,
        weight: isSelected ? 2 : 1,
      }).addTo(markersLayerRef.current!);

      // Marker
      const marker = L.marker([alert.lat, alert.lng], { icon })
        .on('click', () => onAlertClick(alert.id))
        .addTo(markersLayerRef.current!);

      if (isSelected) {
        marker.setZIndexOffset(1000);
      }
    });
  }, [alerts, mapState.highlightedAlertId, onAlertClick]);

  return (
    <div className="flex-1 relative overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* HUD Overlays */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400 font-mono shadow-2xl z-[1000] pointer-events-none">
        LAT: {mapState.center.lat.toFixed(6)}<br/>
        LNG: {mapState.center.lng.toFixed(6)}<br/>
        ZOOM: {mapState.zoom.toFixed(1)}
      </div>

      {/* Legend Overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-slate-800 shadow-2xl z-[1000] pointer-events-none">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Alert Intensity</h4>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
            <span className="text-[10px] text-slate-300">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
            <span className="text-[10px] text-slate-300">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
            <span className="text-[10px] text-slate-300">Medium</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
