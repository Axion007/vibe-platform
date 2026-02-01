
import { Location } from './types';

export const SAVED_LOCATIONS: Location[] = [
  { id: 'nyc', name: 'New York City', lat: 40.7128, lng: -74.0060, zoom: 12 },
  { id: 'tokyo', name: 'Tokyo, JP', lat: 35.6895, lng: 139.6917, zoom: 12 },
  { id: 'london', name: 'London, UK', lat: 51.5074, lng: -0.1278, zoom: 12 },
  { id: 'sf', name: 'San Francisco', lat: 37.7749, lng: -122.4194, zoom: 12 },
  { id: 'berlin', name: 'Berlin, DE', lat: 52.5200, lng: 13.4050, zoom: 12 }
];

export const SEVERITY_COLORS = {
  low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  critical: 'text-red-500 bg-red-500/10 border-red-500/30'
};
