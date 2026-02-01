
import { GoogleGenAI, Type } from "@google/genai";
import { Alert } from "./types";

export async function generateNotificationPayload(alert: Alert): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Generate an urgent emergency SMS message for the following alert:
    - Type: ${alert.type}
    - Severity: ${alert.severity}
    - Location: ${alert.location.address || 'your current area'}
    - Details: ${alert.message}
    
    Output ONLY the text of the SMS message (max 160 chars).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });

    return response.text?.trim() || `EMERGENCY: ${alert.severity} ${alert.type} alert in your area. Follow local instructions.`;
  } catch (error) {
    console.error("Gemini SMS Generation Error:", error);
    return `EMERGENCY: ${alert.severity} ${alert.type} alert in your area.`;
  }
}

export async function generateImpactReport(alert: Alert, matchedUserCount: number) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As an emergency response expert, analyze this alert:
    - Type: ${alert.type}
    - Severity: ${alert.severity}
    - Location: ${alert.location.address}
    - Description: ${alert.message}
    - Active Subscriptions in Area: ${matchedUserCount}

    Generate a response in JSON format with these fields:
    - assessmentSummary: A professional, authoritative 2-sentence summary of the situation.
    - recommendedResponse: A 3-step actionable plan for local authorities.
    - densityFactor: A number between 0.8 and 1.2 representing population density logic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assessmentSummary: { type: Type.STRING },
            recommendedResponse: { type: Type.STRING },
            densityFactor: { type: Type.NUMBER }
          },
          required: ["assessmentSummary", "recommendedResponse", "densityFactor"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Impact Report Generation Error:", error);
    return {
      assessmentSummary: "Situation requires immediate monitoring. High risk of escalation due to regional conditions.",
      recommendedResponse: "1. Deploy local responders. 2. Establish perimeter. 3. Monitor communication channels.",
      densityFactor: 1.0
    };
  }
}
