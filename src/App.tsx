import { useState } from 'react'
import { Send, Loader } from 'lucide-react'
import { ChatMessage } from './components/ChatMessage'
import { MidiPlayerComponent } from './components/MidiPlayer'
import { callLLM } from './services/llmService'
import { createMidiFile, parseLLMResponse } from './services/midiService'
import { Message, NoteSequence, MessageContent } from './types'
import { validateJSONResponse } from './utils/jsonValidation'
import './index.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [midiData, setMidiData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const initialMessageContent: MessageContent = {
        title: "Creating Your Music",
        tasks: [
          { id: '1', description: 'Generating Musical Notes', status: 'pending' },
          { id: '2', description: 'Creating MIDI File', status: 'pending' },
          { id: '3', description: 'Preparing Response', status: 'pending' }
        ],
        response: ''
      }

      const botMessage: Message = {
        text: initialMessageContent,
        isUser: false
      }
      setMessages(prev => [...prev, botMessage])

      // Task 1: Generating Musical Notes
      const messageContent = { ...initialMessageContent }
      messageContent.tasks[0].status = 'in-progress'
      setMessages(prev => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], text: { ...messageContent } }
      ])

      const response = await callLLM(input)
      messageContent.tasks[0].status = 'completed'
      setMessages(prev => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], text: { ...messageContent } }
      ])

      // Task 2: Creating MIDI File
      messageContent.tasks[1].status = 'in-progress'
      setMessages(prev => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], text: { ...messageContent } }
      ])

      const musicData = parseLLMResponse(response)
      const midiDataUri = createMidiFile(musicData)
      setMidiData(midiDataUri)

      messageContent.tasks[1].status = 'completed'
      setMessages(prev => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], text: { ...messageContent } }
      ])

      // Task 3: Preparing Response
      messageContent.tasks[2].status = 'in-progress'
      setMessages(prev => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], text: { ...messageContent } }
      ])

      let noteSequence: NoteSequence | undefined
      try {
        noteSequence = validateJSONResponse(response)
      } catch (validationError) {
        console.error('Validation error:', validationError)
      }

      messageContent.response = response
      messageContent.tasks[2].status = 'completed'
      
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          ...prev[prev.length - 1],
          text: { ...messageContent },
          noteSequence
        }
      ])

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        text: 'Sorry, there was an error processing your request. Please try again.',
        isUser: false
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-text-primary p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          MidiGen Chat
        </h1>
        
        <div className="glass-container mb-6 h-[60vh] overflow-y-auto flex flex-col gap-4 p-6">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              role={message.isUser ? 'user' : 'assistant'}
              content={message.text}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <Loader className="animate-spin text-blue-400" size={24} />
            </div>
          )}
        </div>

        {midiData && (
          <div className="mb-6">
            <MidiPlayerComponent midiData={midiData} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the music you want to generate..."
            className="
              flex-1 
              glass-container
              px-6 
              py-4
              focus:outline-none 
              focus:ring-2 
              focus:ring-blue-500/50 
              placeholder-text-secondary
              pr-[100px]
            "
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              bg-blue-500/90
              hover:bg-blue-400/90 
              rounded-full
              p-3
              transition-all
              duration-200
              shadow-glass
              backdrop-blur-sm
              border
              border-blue-400/30
              hover:scale-105
              active:scale-95
              disabled:opacity-50 
              disabled:cursor-not-allowed
              disabled:hover:scale-100
              group
            `}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Send size={20} className="text-white group-hover:scale-110 transition-transform duration-200" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
