import { Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { createMidiFile, parseLLMResponse } from '../services/midiService'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const handleDownload = () => {
    try {
      if (role === 'assistant') {
        const musicData = parseLLMResponse(content)
        const midiDataUri = createMidiFile(musicData)
        
        const link = document.createElement('a')
        link.href = midiDataUri
        link.download = 'generated-music.mid'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error downloading MIDI:', error)
    }
  }

  return (
    <div 
      className={`flex w-full mb-6 ${
        role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`
          relative 
          max-w-[85%] 
          rounded-[20px]
          p-6 
          shadow-md
          ${
            role === 'user'
              ? 'bg-blue-600 text-white ml-auto rounded-br-md'
              : 'bg-gray-750 text-gray-100 mr-auto rounded-bl-md'
          }
          transition-all 
          duration-200 
          hover:shadow-lg
          border
          ${
            role === 'user'
              ? 'border-blue-500/30'
              : 'border-gray-600/30'
          }
        `}
      >
        <ReactMarkdown 
          className="prose prose-invert max-w-none prose-pre:bg-gray-800/50 prose-pre:border prose-pre:border-gray-600/30 prose-p:leading-relaxed"
        >
          {content}
        </ReactMarkdown>
        
        {role === 'assistant' && (
          <button
            onClick={handleDownload}
            className="
              absolute 
              bottom-0
              right-0
              translate-y-1/2
              translate-x-1/2
              p-2.5 
              rounded-full 
              bg-blue-500
              hover:bg-blue-400
              shadow-md
              hover:shadow-lg
              transition-all 
              duration-200
              border
              border-blue-400/30
              group
              hover:scale-105
              active:scale-95
              z-10
            "
            title="Download MIDI"
          >
            <Download 
              size={18} 
              className="text-white group-hover:scale-110 transition-transform duration-200" 
            />
          </button>
        )}
      </div>
    </div>
  )
}