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
    <div className="glass-container p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="
            p-2 
            rounded-full 
            bg-blue-500/90 
            hover:bg-blue-400/90 
            transition-all
            duration-200
            shadow-glass
            backdrop-blur-sm
            border
            border-blue-400/30
            hover:scale-105
            active:scale-95
            group
          "
        >
          {isPlaying ? (
            <Pause size={24} className="text-white group-hover:scale-110 transition-transform duration-200" />
          ) : (
            <Play size={24} className="text-white group-hover:scale-110 transition-transform duration-200" />
          )}
        </button>
        <button
          onClick={handleDownload}
          className="
            p-2 
            rounded-full 
            bg-green-500/90 
            hover:bg-green-400/90 
            transition-all
            duration-200
            shadow-glass
            backdrop-blur-sm
            border
            border-green-400/30
            hover:scale-105
            active:scale-95
            group
          "
        >
          <Download size={24} className="text-white group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
      <div className="text-sm text-text-secondary mt-2">
        MIDI Player Controls (Coming Soon)
      </div>
    </div>
  )
}
