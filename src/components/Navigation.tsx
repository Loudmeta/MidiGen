import { Plus, History, MoreHorizontal, X, Music } from 'lucide-react'
import { useState } from 'react'

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  messages: any[];
  timestamp: number;
}

interface NavigationProps {
  onNewChat: () => void
  onClearChat: () => void
  chatSessions: ChatSession[]
  onSelectSession: (sessionId: string) => void
  currentSessionId: string | null
}

export const Navigation = ({ 
  onNewChat, 
  onClearChat, 
  chatSessions,
  onSelectSession,
  currentSessionId 
}: NavigationProps) => {
  const [showHistory, setShowHistory] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleNewChat = () => {
    onNewChat()
    setShowHistory(false)
  }

  const handleClearChat = () => {
    onClearChat()
    setShowOptions(false)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <button
        onClick={handleNewChat}
        className="p-2 hover:bg-surface/50 rounded-full transition-colors duration-200"
        title="New Chat"
      >
        <Plus size={20} className="text-text-secondary" />
      </button>

      <button
        onClick={() => setShowHistory(!showHistory)}
        className="p-2 hover:bg-surface/50 rounded-full transition-colors duration-200"
        title="History"
      >
        <History size={20} className="text-text-secondary" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 hover:bg-surface/50 rounded-full transition-colors duration-200"
          title="Options"
        >
          <MoreHorizontal size={20} className="text-text-secondary" />
        </button>

        {showOptions && (
          <div className="absolute right-0 mt-2 w-48 glass-container py-1 z-50">
            <button
              onClick={handleClearChat}
              className="w-full px-4 py-2 text-left text-sm hover:bg-surface/50 transition-colors duration-200"
            >
              Clear Chat
            </button>
          </div>
        )}
      </div>

      {showHistory && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="w-[800px] h-[600px] glass-container relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-surface/50 rounded-full transition-colors duration-200"
                title="Close"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            <div className="flex flex-col h-full">
              <div className="flex flex-col items-center justify-center p-6 border-b border-border">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Chat Sessions
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 min-h-min">
                  {chatSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => {
                        onSelectSession(session.id)
                        setShowHistory(false)
                      }}
                      className={`glass-container p-4 text-left transition-all duration-200 hover:scale-[1.02] ${
                        session.id === currentSessionId ? 'border-blue-500/50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Music size={20} className="text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-text-primary truncate">
                            {session.title || 'New Chat'}
                          </div>
                          <div className="text-sm text-text-secondary truncate mt-1">
                            {session.preview || 'No messages yet'}
                          </div>
                          <div className="text-xs text-text-secondary mt-2">
                            {formatDate(session.timestamp)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
