
import { useState } from 'react'
import { Send } from 'lucide-react'
import { ChatMessage } from './components/ChatMessage'
import { MidiPlayerComponent } from './components/MidiPlayer'
import './index.css'

interface Message {
  text: string
  isUser: boolean
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [midiData, setMidiData] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // TODO: Replace this with actual LLM API call
    // This is a mock response
    setTimeout(() => {
      const botMessage = {
        text: "I've generated a MIDI file based on your prompt.",
        isUser: false
      }
      setMessages(prev => [...prev, botMessage])
      
      // Mock MIDI data (replace with actual MIDI generation)
      setMidiData('data:audio/midi;base64,YOUR_MIDI_DATA_HERE')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">MidiGen Chat</h1>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-4 h-[60vh] overflow-y-auto flex flex-col gap-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message.text} isUser={message.isUser} />
          ))}
        </div>

        {midiData && (
          <div className="mb-4">
            <MidiPlayerComponent midiData={midiData} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the music you want to generate..."
            className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
      