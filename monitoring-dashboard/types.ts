
export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export type DisasterType = 'FLOOD' | 'FIRE' | 'EARTHQUAKE' | 'STORM' | 'CHEMICAL' | 'OTHER';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface User {
  id: string;
  phone: string;
  location: Location;
  alertRadiusKm: number;
  disasterTypes: DisasterType[];
  minSeverity: Severity;
  name: string;
}

export interface Alert {
  id: string;
  type: DisasterType;
  severity: Severity;
  location: Location;
  message: string;
  createdAt: number;
}

export interface SentSMS {
  id: string;
  alertId: string;
  userId: string;
  phone: string;
  body: string;
  timestamp: number;
  status: 'SENT' | 'FAILED' | 'MOCKED' | 'DELIVERED';
}

export interface NotificationDocument {
  id: string;
  userId: string;
  alertId: string;
  phone: string;
  message: string;
  severity: Severity;
  channel: 'SMS_SIMULATED';
  status: 'DELIVERED';
  timestamp: number;
}

export const SEVERITY_ORDER: Record<Severity, number> = {
  [Severity.LOW]: 0,
  [Severity.MEDIUM]: 1,
  [Severity.HIGH]: 2,
  [Severity.CRITICAL]: 3,
};
