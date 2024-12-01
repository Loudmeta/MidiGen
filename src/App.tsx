import { useState } from 'react'
import { Send, Loader } from 'lucide-react'
import { ChatMessage } from './components/ChatMessage'
import { MidiPlayerComponent } from './components/MidiPlayer'
import { callLLM } from './services/llmService'
import './index.css'

interface Message {
  text: string
  isUser: boolean
  error?: boolean
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [midiData, setMidiData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validateJSONResponse = (response: string) => {
    try {
      const parsed = JSON.parse(response);
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }
      
      // Validate array structure
      const isValid = parsed.every(item => 
        Array.isArray(item) && 
        item.length === 3 && 
        typeof item[0] === 'string' && 
        typeof item[1] === 'number' && 
        typeof item[2] === 'number'
      );

      if (!isValid) {
        throw new Error('Invalid array structure');
      }

      return parsed;
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await callLLM(input)
      
      // Validate JSON response
      validateJSONResponse(response);

      const botMessage = {
        text: response,
        isUser: false
      }
      setMessages(prev => [...prev, botMessage])
      
      // Mock MIDI data (replace with actual MIDI generation)
      setMidiData('data:audio/midi;base64,YOUR_MIDI_DATA_HERE')
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: error instanceof Error 
          ? `Error: ${error.message}`
          : "Sorry, I encountered an error while processing your request.",
        isUser: false,
        error: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">MidiGen Chat</h1>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-4 h-[60vh] overflow-y-auto flex flex-col gap-4">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              message={message.text} 
              isUser={message.isUser} 
              error={message.error}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <Loader className="animate-spin" size={24} />
            </div>
          )}
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
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App