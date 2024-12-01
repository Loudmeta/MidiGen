import { Play, Pause, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import MidiPlayer from 'midi-player-js'
import { createMidiFile, parseLLMResponse } from '../services/midiService'

interface MidiPlayerProps {
  midiData: string;
}

export const MidiPlayerComponent: React.FC<MidiPlayerProps> = ({ midiData }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [player, setPlayer] = useState<MidiPlayer.Player | null>(null)

  useEffect(() => {
    if (midiData) {
      try {
        const newPlayer = new MidiPlayer.Player()
        newPlayer.loadDataUri(midiData)
        setPlayer(newPlayer)
      } catch (error) {
        console.error('Error processing LLM response:', error)
      }
    }
  }, [midiData])

  const togglePlay = () => {
    if (!player) return
    if (isPlaying) {
      player.pause()
    } else {
      player.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleDownload = () => {
    if (!midiData) return
    const link = document.createElement('a')
    link.href = midiData
    link.download = 'generated-music.mid'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!midiData) return null

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={handleDownload}
          className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors"
        >
          <Download size={24} />
        </button>
      </div>
      <div className="text-sm text-gray-400">
        MIDI Player Controls (Coming Soon)
      </div>
    </div>
  )
}
      