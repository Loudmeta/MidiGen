interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const callLLM = async (prompt: string): Promise<string> => {
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;
  const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'MidiGen';

  const systemPrompt = `Generate a melody with 15 to 40 notes where each note is represented with one of the symbols
A, A#, B, C, C#, D, D#, E, F, F#, G, G#, an octave between 0 and 9, and a duration in milliseconds for which it should be played.

Output the result as a JSON array of triples where the first element of the triple is the note, the second is the octave, and the third is the duration in milliseconds.
In your response return only the JSON array without any additional strings before and after.

The melody should be about:`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "qwen/qwq-32b-preview",
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data: LLMResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling LLM:', error);
    throw error;
  }
};