
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAiAnswer = async (doubtTitle: string, doubtDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are a highly skilled software engineer and helpful mentor. 
        A student has the following doubt:
        
        Title: ${doubtTitle}
        Description: ${doubtDescription}
        
        Please provide a detailed, clear, and accurate answer to this doubt. 
        Include code examples if relevant and explain the logic step-by-step.
        Keep the tone professional yet encouraging.
      `,
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI answer. Please try again later.");
  }
};
