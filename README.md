# MidiGen

An AI-powered MIDI music generator built with React, TypeScript, and OpenRouter AI. Create unique musical compositions through natural language descriptions.

## Features

- 🎵 Generate MIDI music from text descriptions
- 🎹 Real-time MIDI playback
- 💾 Download generated MIDI files
- 🎨 Beautiful glass-morphism UI design
- 📱 Responsive layout
- 💬 Chat-based interface
- 📚 Chat history management
- 🔄 Multiple chat sessions support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MidiGen.git
cd MidiGen
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your OpenRouter API key:
```env
VITE_OPENROUTER_API_KEY=your_api_key_here
VITE_SITE_URL=your_site_url # Optional, defaults to window.location.origin
VITE_SITE_NAME=MidiGen # Optional, defaults to 'MidiGen'
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

1. Enter a description of the music you want to generate (e.g., "Create a happy jazz melody")
2. Wait for the AI to generate your composition
3. Use the player controls to play/pause the melody
4. Download the MIDI file if desired
5. Create new chat sessions or browse previous ones using the history feature

## Features in Detail

### Music Generation
- Three-part musical composition:
  - Melody line (octave 6)
  - Chord progression (octave 5)
  - Bass line (octave 4)
- 8-bar compositions with precise musical timing
- Velocity control for dynamic expression

### User Interface
- Glass-morphism design with smooth animations
- Chat-based interaction
- Real-time progress indicators
- MIDI playback controls
- Session management with history view
- Responsive and accessible design

### Chat Sessions
- Multiple chat session support
- Session history with previews
- Easy navigation between sessions
- Session management (new, clear, switch)

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatMessage     # Message display component
│   ├── MidiPlayer      # MIDI playback controls
│   ├── Navigation      # App navigation and history
│   └── JSONDisplay     # JSON data visualization
├── services/           # Core services
│   ├── llmService      # AI interaction handling
│   └── midiService     # MIDI file generation
├── types/             # TypeScript definitions
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

## Technical Details

- Built with React and TypeScript
- Uses Vite for fast development and building
- Tailwind CSS for styling
- OpenRouter AI for music generation
- Web MIDI API for playback
- Local storage for session persistence

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
- Mobile responsiveness improvements
- Advanced session management features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenRouter AI for providing the AI capabilities
- React and TypeScript communities
- Contributors and users of the project
