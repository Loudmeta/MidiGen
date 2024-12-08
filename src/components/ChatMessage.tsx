import { Download, Check, Loader } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { createMidiFile, parseLLMResponse } from '../services/midiService'
import { Task, MessageContent } from '../types'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string | MessageContent
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const handleDownload = () => {
    try {
      if (role === 'assistant') {
        const messageContent = typeof content === 'string' ? content : content.response
        const musicData = parseLLMResponse(messageContent)
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

  const renderTaskStatus = (status: Task['status']) => {
    switch (status) {
      case 'loading':
        return <Loader size={16} className="text-blue-400 animate-spin" />
      case 'completed':
        return <Check size={16} className="text-green-400" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
    }
  }

  const renderAssistantMessage = (content: string | MessageContent) => {
    if (typeof content === 'string') {
      return (
        <ReactMarkdown 
          className="prose prose-invert max-w-none prose-pre:bg-surface/50 prose-pre:border prose-pre:border-border prose-p:leading-relaxed prose-p:text-text-primary prose-headings:text-text-primary"
        >
          {content}
        </ReactMarkdown>
      )
    }

    return (
      <div className="space-y-4">
        <div className="text-lg font-semibold text-text-primary mb-4 border-b border-border pb-2">
          {content.title}
        </div>
        
        <div className="space-y-2 bg-surface/30 rounded-lg p-4">
          <div className="text-sm font-medium text-text-secondary mb-3">Generation Steps:</div>
          {content.tasks.map((task: Task, index: number) => (
            <div 
              key={task.id} 
              className="flex items-center gap-2 transition-all duration-300"
              style={{ 
                opacity: task.status === 'pending' ? 0.5 : 1,
                transform: `translateX(${task.status === 'pending' ? '-4px' : '0'})`
              }}
            >
              <div className="flex-shrink-0">
                {renderTaskStatus(task.status)}
              </div>
              <span className="text-text-primary text-sm">
                {task.description}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <ReactMarkdown 
            className="prose prose-invert max-w-none prose-pre:bg-surface/50 prose-pre:border prose-pre:border-border prose-p:leading-relaxed prose-p:text-text-primary prose-headings:text-text-primary"
          >
            {content.response}
          </ReactMarkdown>
        </div>
      </div>
    )
  }

  const containerClass = role === 'user' ? 'justify-end' : 'justify-start'
  const messageClass = role === 'user' 
    ? 'bg-blue-600/90 backdrop-blur-sm text-white ml-auto border-blue-500/30' 
    : 'glass-container text-text-primary mr-auto border-border'

  const downloadButton = role === 'assistant' && (
    <button
      onClick={handleDownload}
      className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 p-2.5 rounded-full bg-blue-500/90 hover:bg-blue-400/90 shadow-glass backdrop-blur-sm transition-all duration-200 border border-blue-400/30 group hover:scale-105 active:scale-95 z-10"
      title="Download MIDI"
    >
      <Download 
        size={18} 
        className="text-white group-hover:scale-110 transition-transform duration-200" 
      />
    </button>
  )

  return (
    <div className={`flex w-full mb-6 ${containerClass}`}>
      <div className={`relative max-w-[85%] rounded-xl p-6 shadow-glass transition-all duration-200 hover:shadow-lg border ${messageClass}`}>
        {role === 'assistant' ? renderAssistantMessage(content) : (
          <ReactMarkdown 
            className="prose prose-invert max-w-none prose-pre:bg-surface/50 prose-pre:border prose-pre:border-border prose-p:leading-relaxed prose-p:text-text-primary prose-headings:text-text-primary"
          >
            {content as string}
          </ReactMarkdown>
        )}
        {downloadButton}
      </div>
    </div>
  )
}
