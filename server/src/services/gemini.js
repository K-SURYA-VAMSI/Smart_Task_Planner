import fetch from 'node-fetch';
import { config } from '../config/env.js';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

export async function generatePlanWithGemini(goalText) {
  if (!goalText || typeof goalText !== 'string') {
    throw new Error('Goal text is required and must be a string');
  }

  const prompt = `You are an expert project planner. Break down the following goal into a concise list of actionable tasks (3-8 tasks maximum).
For each task provide: title, 1-sentence description, and dependencies by index of prior tasks if any.
Return STRICT JSON with this schema: { "tasks": [ { "title": string, "description": string, "dependsOn": number[] } ] }.
Make sure all dependency indices are valid (within bounds of the task array).

Goal: ${goalText}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
  };

  const url = `${GEMINI_API_URL}?key=${encodeURIComponent(config.GEMINI_API_KEY)}`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${text}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    // Attempt to parse JSON even if model wrapped it in markdown code fences
    const cleaned = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Invalid JSON response from Gemini API');
    }

    if (!parsed?.tasks || !Array.isArray(parsed.tasks)) {
      throw new Error('Invalid Gemini response format - missing tasks array');
    }

    // Validate each task
    const validTasks = parsed.tasks.map((task, index) => {
      if (!task.title || typeof task.title !== 'string') {
        throw new Error(`Task ${index} missing valid title`);
      }
      return {
        title: task.title.trim(),
        description: (task.description || '').trim(),
        dependsOn: Array.isArray(task.dependsOn) ? task.dependsOn : []
      };
    });

    return validTasks;
  } catch (error) {
    if (error.message.includes('Gemini API')) {
      throw error;
    }
    throw new Error(`Failed to generate plan with AI: ${error.message}`);
  }
}


