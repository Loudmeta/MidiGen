# MidiGen - AI-Powered MIDI Music Generator

MidiGen is an interactive web application that generates musical melodies using AI. It provides a chat interface where users can describe the type of music they want, and the application generates MIDI compositions following specific musical rules and structure.

## Features

- 🎵 AI-powered melody generation
- 💬 Interactive chat interface
- 🎹 Real-time MIDI playback
- ⬇️ MIDI file download capability
- 🎼 Three-layer musical composition:
  - Melody line (octave 6)
  - Chord progression (octave 5)
  - Bass line (octave 4)

## Technical Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **MIDI Processing**: midi-player-js
- **AI Integration**: OpenRouter API

## Musical Structure

Each generated composition follows these rules:
- 8 bars of music
- 2 beats = 1 second (1000ms)
- 4 beats = 1 bar (2000ms)
- Total composition length = 8 bars (8000ms)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/midigen.git
cd midigen
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
VITE_OPENROUTER_API_KEY=your_api_key_here
VITE_SITE_URL=your_site_url
VITE_SITE_NAME=MidiGen
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Open the application in your browser
2. Type a description of the music you want to generate (e.g., "Create a happy jazz melody")
3. Wait for the AI to generate your composition
4. Use the player controls to play/pause the melody
5. Download the MIDI file if desired

## Project Structure

```
src/
├── components/        # React components
├── services/         # API and MIDI services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── App.tsx          # Main application component
```

## Environment Variables

- `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key
- `VITE_SITE_URL`: Your site URL (defaults to window.location.origin)
- `VITE_SITE_NAME`: Your site name (defaults to 'MidiGen')

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Improvements

- Enhanced MIDI generation capabilities
- Additional playback controls (tempo, volume)
- Save/load functionality for generated melodies
- Social sharing features
- Expanded musical style options
- Comprehensive test coverage

## License

This project is licensed under the MIT License - see the LICENSE file for details.
