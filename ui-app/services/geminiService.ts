
import { GoogleGenAI, Type } from "@google/genai";
import { Alert, Location } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchAlertsForLocation(location: Location): Promise<Alert[]> {
  const prompt = `Generate 5-7 realistic emergency or public safety alerts for the location: ${location.name} (${location.lat}, ${location.lng}). 
  Vary the severity (low, medium, high, critical) and categories (weather, traffic, fire, medical, police).
  Ensure coordinates are within a 0.1 degree radius of the center.
  Return as a JSON array of alert objects.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              radius: { type: Type.NUMBER, description: 'Radius in meters (e.g., 500)' },
              timestamp: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ['id', 'title', 'description', 'severity', 'lat', 'lng', 'radius', 'timestamp', 'category']
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((item: any) => ({
      ...item,
      status: 'active'
    }));
  } catch (error) {
    console.error("Error fetching alerts:", error);
    // Fallback static data if Gemini fails
    return [
      {
        id: 'fallback-1',
        title: 'System Connectivity Issue',
        description: 'Automatic alert generation failed. Displaying local cache.',
        severity: 'medium',
        lat: location.lat + 0.01,
        lng: location.lng + 0.01,
        radius: 300,
        timestamp: new Date().toISOString(),
        status: 'active',
        category: 'system'
      }
    ];
  }
}
