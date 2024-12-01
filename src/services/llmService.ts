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

  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing');
  }

  const systemPrompt = `You are a musical melody generator. Generate melodies following these strict musical rules:

Musical Structure Rules:
1. Generate exactly 8 bars of music
2. Musical timing: 
   - 2 beats = 1 second (1000ms)
   - 4 beats = 1 bar (2000ms)
   - Total composition length = 8 bars (8000ms)

3. Generate three parallel musical lines:
   - Melody line: in octave 6 (main tune)
   - Chord progression: in octave 5 (harmonic support)
   - Bass line: in octave 4 (rhythmic foundation)

Note Requirements:
- Each note must be represented as a triple containing:
  - Note symbol (only use: A, A#, B, C, C#, D, D#, E, F, F#, G, G#)
  - Octave (must be exactly 4, 5, or 6 depending on the musical line)
  - Duration in milliseconds (based on musical timing rules)
  - Velocity (integer between 0-100, controlling note intensity)

The output must be formatted in markdown as follows:

### Generated Melody
[Write a brief description of the melody, including its style, mood, and how the three lines interact IN A SINGLE SENTENCE]

\`\`\`json
{
  "melodyLine": [
    ["note", 6, duration, velocity],
    ...
  ],
  "chordProgression": [
    ["note", 5, duration, velocity],
    ...
  ],
  "bassLine": [
    ["note", 4, duration, velocity],
    ...
  ]
}
\`\`\`

Important rules:
- Each note must be one of: A, A#, B, C, C#, D, D#, E, F, F#, G, G#
- Octaves must be exactly: 6 for melody, 5 for chords, 4 for bass
- Durations must follow the musical timing (in milliseconds)
- Velocity must be between 0-100
- Total duration of each line must equal 8000ms (8 bars)
- Ensure the JSON is valid and properly formatted

The melody should be about:`;

  try {
    const requestBody = {
      "model": "meta-llama/llama-3.2-90b-vision-instruct:free",
      "messages": [
        {
          "role": "system",
          "content": systemPrompt
        },
        {
          "role": "user",
          "content": prompt
        }
      ],
      "temperature": 0.7,
      "max_tokens": 1000
    };

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