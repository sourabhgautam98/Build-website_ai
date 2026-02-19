import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert frontend web developer. The user will describe a website they want built.

Your job is to generate complete, working HTML, CSS, and JavaScript code for that website.

IMPORTANT: You MUST respond with ONLY a valid JSON object in this exact format — no markdown, no code fences, no explanation:
{
  "html": "<!DOCTYPE html>...",
  "css": "body { ... }",
  "js": "// JavaScript code here"
}

Rules:
1. The HTML must be a complete page with <!DOCTYPE html>, <html>, <head>, and <body> tags.
2. Do NOT include <style> or <script> tags inside the HTML — CSS and JS will be injected separately.
3. Use modern, beautiful design with vibrant colors, gradients, and smooth animations.
4. Make the design responsive and mobile-friendly.
5. Use Google Fonts when appropriate (via @import in CSS).
6. The JavaScript should be vanilla JS (no frameworks).
7. Make functional, interactive websites — not just static mockups.
8. If the user asks for a calculator, todo app, etc., make it fully working.
9. Always return valid JSON. Do not wrap the response in backticks or markdown.`;

const chatHistory = [];

export async function generateWebsite(userPrompt) {
  chatHistory.push({
    role: "user",
    parts: [{ text: userPrompt }],
  });

  const response = await ai.models.generateContent({
   model:"gemini-3-flash-preview",
    contents: chatHistory,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  chatHistory.push({
    role: "model",
    parts: [{ text }],
  });

  try {
    const parsed = JSON.parse(text);
    return {
      html: parsed.html || "",
      css: parsed.css || "",
      js: parsed.js || "",
    };
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        html: parsed.html || "",
        css: parsed.css || "",
        js: parsed.js || "",
      };
    }
    throw new Error("Failed to parse AI response as JSON");
  }
}

export function clearHistory() {
  chatHistory.length = 0;
}
