import { User, Bot } from 'lucide-react'
import { Message } from '../types'
import { JSONDisplay } from './JSONDisplay'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  message: Message
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { isUser, text, noteSequence } = message

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="text-white whitespace-pre-wrap"
          >
            {text}
          </ReactMarkdown>
        </div>
        {noteSequence && <div className="mt-4">
          <JSONDisplay data={noteSequence} />
        </div>}
      </div>
    </div>
  )
}