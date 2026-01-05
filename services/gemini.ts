
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini with the correct structure and direct environment variable access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiAnswer = async (doubtTitle: string, doubtDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      // Use the pro model for complex software engineering questions
      model: 'gemini-3-pro-preview',
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
        // Removed maxOutputTokens to prevent truncation of detailed technical answers
      }
    });

    // Directly access the text property as per GenerateContentResponse guidelines
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI answer. Please try again later.");
  }
};
