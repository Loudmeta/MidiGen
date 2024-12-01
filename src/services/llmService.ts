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

  console.log('Making LLM API call with prompt:', prompt);
  console.log('Using API key:', OPENROUTER_API_KEY ? 'Present' : 'Missing');

  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing');
  }

  const systemPrompt = `Generate a melody with 15 to 40 notes where each note is represented with one of the symbols
A, A#, B, C, C#, D, D#, E, F, F#, G, G#, an octave between 0 and 9, and a duration in milliseconds for which it should be played.

Format your response in markdown with the following structure:

### Generated Melody
[Brief description of the generated melody]

\`\`\`json
[The JSON array of note triples]
\`\`\`

The melody should be about:`;

  try {
    const requestBody = {
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
    };

    console.log('Request body:', requestBody);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data: LLMResponse = await response.json();
    console.log('API Response data:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in callLLM:', error);
    throw error;
  }
};