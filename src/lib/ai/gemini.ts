export interface GenerateTextOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function callGeminiApi(options: GenerateTextOptions): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your-gemini-api-key')) {
    return null; // Signals caller to use deterministic local engine
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: options.prompt }],
          },
        ],
        systemInstruction: options.systemInstruction
          ? { parts: [{ text: options.systemInstruction }] }
          : undefined,
        generationConfig: {
          temperature: options.temperature ?? 0.3,
          maxOutputTokens: options.maxTokens ?? 1500,
        },
      }),
    });

    if (!response.ok) {
      console.warn('Gemini API call returned non-200 status:', response.status);
      return null;
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;
    return text || null;
  } catch (error) {
    console.warn('Failed to call Gemini API, falling back to local engine:', error);
    return null;
  }
}
