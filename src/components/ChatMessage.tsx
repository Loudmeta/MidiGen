
import { User, Bot } from 'lucide-react'

interface ChatMessageProps {
  message: string
  isUser: boolean
}

export const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className={`max-w-[80%] rounded-lg p-3 ${isUser ? 'bg-blue-600' : 'bg-gray-700'}`}>
        <p className="text-white">{message}</p>
      </div>
    </div>
  )
}
      