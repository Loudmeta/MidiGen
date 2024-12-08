import { useEffect, useRef, useState } from 'react'
import { NoteSequence } from '../types'

interface PianoRollProps {
  noteSequence?: NoteSequence
  currentTime?: number
  duration?: number
  zoomLevel?: number
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const PIANO_WIDTH = 100
const NOTE_HEIGHT = 20
const BEAT_WIDTH = 60  // Width per beat at default zoom
const BEATS_PER_BAR = 4
const TOTAL_BARS = 8
const GRID_COLOR = '#2a2a2a'
const BAR_LINE_COLOR = '#3a3a3a'
const NOTE_COLOR = '#4CAF50'

export const PianoRoll = ({ 
  noteSequence, 
  currentTime = 0, 
  duration = 0,
  zoomLevel = 0
}: PianoRollProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pianoCanvasRef = useRef<HTMLCanvasElement>(null)
  const gridCanvasRef = useRef<HTMLCanvasElement>(null)
  const [pianoCtx, setPianoCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [gridCtx, setGridCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Calculate zoom factor (1 at 0%, 4 at 100%)
  const zoomFactor = 1 + (zoomLevel / 100) * 3

  // Calculate dimensions
  const totalBeats = BEATS_PER_BAR * TOTAL_BARS
  const baseGridWidth = BEAT_WIDTH * totalBeats
  const gridWidth = baseGridWidth * zoomFactor
  const totalWidth = PIANO_WIDTH + gridWidth
  const totalNotes = NOTES.length * 3 // 3 octaves
  const totalHeight = NOTE_HEIGHT * totalNotes

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    // Initialize piano canvas
    const pianoCanvas = pianoCanvasRef.current
    if (pianoCanvas) {
      const context = pianoCanvas.getContext('2d')
      if (context) {
        const dpr = window.devicePixelRatio || 1
        pianoCanvas.width = PIANO_WIDTH * dpr
        pianoCanvas.height = totalHeight * dpr
        context.scale(dpr, dpr)
        pianoCanvas.style.width = `${PIANO_WIDTH}px`
        pianoCanvas.style.height = `${totalHeight}px`
        setPianoCtx(context)
      }
    }

    // Initialize grid canvas
    const gridCanvas = gridCanvasRef.current
    if (gridCanvas) {
      const context = gridCanvas.getContext('2d')
      if (context) {
        const dpr = window.devicePixelRatio || 1
        gridCanvas.width = gridWidth * dpr
        gridCanvas.height = totalHeight * dpr
        context.scale(dpr, dpr)
        gridCanvas.style.width = `${gridWidth}px`
        gridCanvas.style.height = `${totalHeight}px`
        setGridCtx(context)
      }
    }
  }, [totalHeight, gridWidth])

  useEffect(() => {
    // Draw piano keys
    if (pianoCtx) {
      pianoCtx.clearRect(0, 0, PIANO_WIDTH, totalHeight)
      drawPianoKeys(pianoCtx)
    }

    // Draw grid and notes
    if (gridCtx) {
      gridCtx.clearRect(0, 0, gridWidth, totalHeight)
      drawGrid(gridCtx)
      
      if (duration > 0) {
        const playbackX = (currentTime / duration) * gridWidth
        gridCtx.beginPath()
        gridCtx.strokeStyle = '#ffffff'
        gridCtx.lineWidth = 2
        gridCtx.moveTo(playbackX, 0)
        gridCtx.lineTo(playbackX, totalHeight)
        gridCtx.stroke()
      }

      if (noteSequence) {
        drawNotes(gridCtx, noteSequence)
      }
    }
  }, [pianoCtx, gridCtx, noteSequence, currentTime, duration, totalHeight, gridWidth, zoomLevel])

  const drawPianoKeys = (ctx: CanvasRenderingContext2D) => {
    // Draw from octave 4 to 6 (inclusive)
    for (let octave = 6; octave >= 4; octave--) {
      NOTES.forEach((note, index) => {
        const y = (NOTES.length * (6 - octave) + index) * NOTE_HEIGHT
        const isBlackKey = note.includes('#')

        // Draw key background
        ctx.fillStyle = isBlackKey ? '#1a1a1a' : '#ffffff'
        ctx.fillRect(0, y, PIANO_WIDTH - 1, NOTE_HEIGHT - 1)

        // Draw key label
        ctx.fillStyle = isBlackKey ? '#ffffff' : '#1a1a1a'
        ctx.font = '12px Arial'
        ctx.fillText(`${note}${octave}`, 5, y + 14)
      })
    }
  }

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    // Draw horizontal grid lines
    for (let i = 0; i <= totalNotes; i++) {
      const y = i * NOTE_HEIGHT
      ctx.beginPath()
      ctx.strokeStyle = GRID_COLOR
      ctx.moveTo(0, y)
      ctx.lineTo(gridWidth, y)
      ctx.stroke()
    }

    // Draw vertical grid lines and bar lines
    const beatWidth = gridWidth / totalBeats
    for (let i = 0; i <= totalBeats; i++) {
      const x = i * beatWidth
      ctx.beginPath()
      ctx.strokeStyle = i % BEATS_PER_BAR === 0 ? BAR_LINE_COLOR : GRID_COLOR
      ctx.lineWidth = i % BEATS_PER_BAR === 0 ? 2 : 1
      ctx.moveTo(x, 0)
      ctx.lineTo(x, totalHeight)
      ctx.stroke()
    }
  }

  const drawNotes = (ctx: CanvasRenderingContext2D, noteSequence: NoteSequence) => {
    const beatWidth = gridWidth / totalBeats
    
    noteSequence.forEach(([note, octave, duration]) => {
      const noteIndex = NOTES.indexOf(note as string)
      if (noteIndex === -1 || octave < 4 || octave > 6) return

      // Calculate position
      const y = (NOTES.length * (6 - octave) + noteIndex) * NOTE_HEIGHT
      const x = (duration * beatWidth / 1000) // Convert ms to beats
      const width = (duration / 500) * beatWidth // 500ms per beat

      // Draw note rectangle
      ctx.fillStyle = NOTE_COLOR
      ctx.fillRect(x, y, width, NOTE_HEIGHT - 1)
    })
  }

  return (
    <div 
      ref={containerRef} 
      className="piano-roll-container relative w-full h-full overflow-hidden"
    >
      <div className="relative w-full h-full overflow-auto">
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
