
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'safe';

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  lat: number;
  lng: number;
  radius: number;
  timestamp: string;
  status: AlertStatus;
  category: string;
}

export interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  highlightedAlertId: string | null;
}
