import { User, Bot, AlertCircle } from 'lucide-react'
import { JSONDisplay } from './JSONDisplay'

interface ChatMessageProps {
  message: string
  isUser: boolean
  error?: boolean
}

export const ChatMessage = ({ message, isUser, error }: ChatMessageProps) => {
  const tryParseJSON = () => {
    try {
      if (!isUser) {
        const parsed = JSON.parse(message);
        if (Array.isArray(parsed) && parsed.every(item => 
          Array.isArray(item) && 
          item.length === 3 && 
          typeof item[0] === 'string' && 
          typeof item[1] === 'number' && 
          typeof item[2] === 'number'
        )) {
          return parsed;
        }
      }
    } catch (e) {
      console.log('Not a valid JSON array:', e);
    }
    return null;
  };

  const parsedJSON = tryParseJSON();

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
        {isUser ? <User size={20} /> : error ? <AlertCircle size={20} className="text-red-500" /> : <Bot size={20} />}
      </div>
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser 
            ? 'bg-blue-600' 
            : error 
              ? 'bg-red-900/50 border border-red-500' 
              : 'bg-gray-700'
        }`}
      >
        {parsedJSON ? (
          <JSONDisplay data={parsedJSON} />
        ) : (
          <p className="text-white">{message}</p>
        )}
      </div>
    </div>
  )
}