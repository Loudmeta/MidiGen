import { useEffect, useRef, useState, useMemo } from 'react'
import { Play, Pause, Download, Square, Search } from 'lucide-react'
import MidiPlayer from 'midi-player-js'
import { PianoRoll } from './PianoRoll'
import { parseMidiToNoteSequence } from '../utils/midiParser'
import { NoteSequence } from '../types'

interface MidiPlayerComponentProps {
  midiData: string
}

export const MidiPlayerComponent = ({ midiData }: MidiPlayerComponentProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100) // Start at 100% zoom
  const playerRef = useRef<any>(null)
  const noteSequence = useMemo(() => parseMidiToNoteSequence(midiData), [midiData])

  useEffect(() => {
    if (!playerRef.current) {
      const player = new MidiPlayer.Player((event: any) => {
        if (event.name === 'Note on' || event.name === 'Note off') {
          setCurrentTime(player.getCurrentTick())
        }
      })
      player.loadDataUri(midiData)
      setDuration(player.getTotalTicks())
      playerRef.current = player

      return () => {
        player.stop()
      }
    }
  }, [midiData])

  const handlePlayPause = () => {
    if (isPlaying) {
      playerRef.current?.pause()
    } else {
      if (currentTime >= duration) {
        playerRef.current?.skipToTick(0)
      }
      playerRef.current?.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleStop = () => {
    playerRef.current?.stop()
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = midiData
    link.download = 'generated-music.mid'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="glass-container p-4 space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={handleStop}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Square size={24} />
          </button>
        </div>

        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Search size={16} />
            <input
              type="range"
              min="50"
              max="200"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value))}
              className="
                w-24
                h-2
                bg-white/20
                rounded-full
                appearance-none
                cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
              "
            />
          </div>

          <button
            onClick={handleDownload}
            className="p-2 rounded-full hover:bg-white/10 transition-colors ml-auto"
          >
            <Download size={24} />
          </button>
        </div>
      </div>

      <div className="relative h-[400px] overflow-hidden rounded-lg border border-white/10">
        <PianoRoll
          noteSequence={noteSequence}
          currentTime={currentTime}
          duration={duration}
          zoomLevel={zoomLevel}
        />
      </div>
    </div>
  )
}
