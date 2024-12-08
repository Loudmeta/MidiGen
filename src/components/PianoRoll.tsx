import React, { useEffect, useRef, useMemo } from 'react'

interface PianoRollProps {
  noteSequence: any[]
  currentTime: number
  duration: number
  zoomLevel: number
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const PIANO_WIDTH = 80
const NOTE_HEIGHT = 20
const PIXELS_PER_BEAT = 60
const BEATS_PER_BAR = 4
const MIN_BARS = 8
const MAX_BARS = 20
const TOTAL_OCTAVES = 3 // 4 to 6
const TOTAL_KEYS = TOTAL_OCTAVES * 12

export const PianoRoll: React.FC<PianoRollProps> = ({ 
  noteSequence, 
  currentTime,
  duration,
  zoomLevel 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pianoCanvasRef = useRef<HTMLCanvasElement>(null)
  const gridCanvasRef = useRef<HTMLCanvasElement>(null)

  // Calculate required number of bars based on note sequence
  const requiredBars = useMemo(() => {
    if (!noteSequence || noteSequence.length === 0) return MIN_BARS

    // Find the last note's end time in beats
    const lastNoteEnd = Math.max(...noteSequence.map(note => note.startTime + note.duration))
    
    // Convert beats to bars (4 beats per bar)
    const barsNeeded = Math.ceil(lastNoteEnd / BEATS_PER_BAR)
    
    // Clamp between MIN_BARS and MAX_BARS
    return Math.max(MIN_BARS, Math.min(MAX_BARS, barsNeeded))
  }, [noteSequence])

  // Debug logging
  useEffect(() => {
    if (noteSequence && noteSequence.length > 0) {
      const lastNote = noteSequence[noteSequence.length - 1]
      console.log('MIDI Length Info:', {
        totalNotes: noteSequence.length,
        lastNoteStart: lastNote.startTime,
        lastNoteDuration: lastNote.duration,
        requiredBars,
        totalBeats: requiredBars * BEATS_PER_BAR
      })
    }
  }, [noteSequence, requiredBars])

  // Calculate dimensions
  const baseGridWidth = PIXELS_PER_BEAT * BEATS_PER_BAR * requiredBars
  const gridWidth = baseGridWidth * (zoomLevel / 100)
  const totalHeight = NOTE_HEIGHT * TOTAL_KEYS
  const totalWidth = PIANO_WIDTH + gridWidth

  useEffect(() => {
    if (!gridCanvasRef.current) return
    const ctx = gridCanvasRef.current.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    gridCanvasRef.current.width = gridWidth * dpr
    gridCanvasRef.current.height = totalHeight * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, gridWidth, totalHeight)

    // Draw vertical grid lines (beats)
    const totalBeats = BEATS_PER_BAR * requiredBars
    const pixelsPerBeat = gridWidth / totalBeats

    // Draw beat lines
    for (let i = 0; i <= totalBeats; i++) {
      const x = i * pixelsPerBeat
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, totalHeight)
      
      if (i % BEATS_PER_BAR === 0) {
        // Bar lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
        
        // Add bar numbers
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = '10px Arial'
        ctx.fillText(`${i/BEATS_PER_BAR + 1}`, x + 2, 10)
      } else {
        // Beat lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    // Draw horizontal grid lines
    for (let i = 0; i <= TOTAL_KEYS; i++) {
      const y = i * NOTE_HEIGHT
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(gridWidth, y)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // Draw notes
    if (noteSequence && noteSequence.length > 0) {
      ctx.fillStyle = 'rgba(0, 120, 255, 0.6)'
      
      noteSequence.forEach((note, index) => {
        // Validate note data
        if (!note.note || !note.octave || typeof note.startTime !== 'number' || typeof note.duration !== 'number') {
          console.warn('Invalid note data:', note)
          return
        }

        // Calculate vertical position
        const octaveOffset = (note.octave - 4) * 12
        const noteIndex = NOTES.indexOf(note.note)
        if (noteIndex === -1) {
          console.warn('Invalid note name:', note.note)
          return
        }

        const y = (TOTAL_KEYS - 1 - (noteIndex + octaveOffset)) * NOTE_HEIGHT

        // Calculate horizontal position based on beats
        const x = note.startTime * pixelsPerBeat
        const width = Math.max(note.duration * pixelsPerBeat, 2)

        // Draw note rectangle with border
        ctx.fillRect(x, y, width, NOTE_HEIGHT)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, width, NOTE_HEIGHT)
      })
    }

  }, [noteSequence, zoomLevel, gridWidth, totalHeight, requiredBars])

  useEffect(() => {
    if (!pianoCanvasRef.current) return
    const ctx = pianoCanvasRef.current.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    pianoCanvasRef.current.width = PIANO_WIDTH * dpr
    pianoCanvasRef.current.height = totalHeight * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, PIANO_WIDTH, totalHeight)

    // Draw piano keys
    for (let octave = 6; octave >= 4; octave--) {
      for (let i = 0; i < 12; i++) {
        const isBlackKey = [1, 3, 6, 8, 10].includes(i)
        const y = (TOTAL_KEYS - 1 - (i + (octave - 4) * 12)) * NOTE_HEIGHT
        
        // Draw key background
        ctx.fillStyle = isBlackKey ? '#000000' : '#ffffff'
        ctx.fillRect(0, y, PIANO_WIDTH, NOTE_HEIGHT)
        
        // Draw key border
        ctx.strokeStyle = '#666666'
        ctx.lineWidth = 1
        ctx.strokeRect(0, y, PIANO_WIDTH, NOTE_HEIGHT)
        
        // Add note labels
        if (!isBlackKey) {
          ctx.fillStyle = '#000000'
          ctx.font = '12px Arial'
          ctx.fillText(`${NOTES[i]}${octave}`, 5, y + 14)
        }
      }
    }
  }, [totalHeight])

  // Draw playback position line
  useEffect(() => {
    if (!gridCanvasRef.current || !duration) return
    const ctx = gridCanvasRef.current.getContext('2d')
    if (!ctx) return

    const x = (currentTime / duration) * gridWidth
    
    ctx.beginPath()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.moveTo(x, 0)
    ctx.lineTo(x, totalHeight)
    ctx.stroke()
  }, [currentTime, duration, gridWidth, totalHeight])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
    >
      <div 
        className="relative w-full h-full overflow-auto"
      >
        {/* Fixed piano keys */}
        <div 
          className="absolute top-0 left-0 z-10 bg-black/50 backdrop-blur-sm"
          style={{
            width: `${PIANO_WIDTH}px`,
            height: `${totalHeight}px`,
            position: 'sticky',
            left: 0
          }}
        >
          <canvas
            ref={pianoCanvasRef}
            style={{
              width: `${PIANO_WIDTH}px`,
              height: `${totalHeight}px`
            }}
          />
        </div>

        {/* Scrollable grid and notes */}
        <div 
          className="absolute top-0 left-0"
          style={{
            width: `${totalWidth}px`,
            height: `${totalHeight}px`,
            paddingLeft: `${PIANO_WIDTH}px`
          }}
        >
          <canvas
            ref={gridCanvasRef}
            style={{
              width: `${gridWidth}px`,
              height: `${totalHeight}px`
            }}
          />
        </div>
      </div>
    </div>
  )
}
