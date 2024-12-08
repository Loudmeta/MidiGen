import { NoteSequence } from '../types'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const TICKS_PER_BEAT = 480 // Standard MIDI resolution

interface MidiNote {
  note: string      // Note name (e.g., 'C', 'F#')
  octave: number    // Octave number
  startTime: number // Start time in beats
  duration: number  // Duration in beats
}

interface MidiEvent {
  deltaTime: number
  type: number
  channel: number
  data: number[]
}

export const parseMidiToNoteSequence = (midiDataUri: string): MidiNote[] => {
  try {
    // Remove the data URI prefix to get the base64 data
    const base64Data = midiDataUri.split(',')[1]
    const binaryString = window.atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Track active notes and completed notes
    const activeNotes: Map<number, MidiNote> = new Map()
    const completedNotes: MidiNote[] = []
    
    let position = 0
    let currentTick = 0

    // Debug MIDI header
    console.log('MIDI Header:', {
      format: (bytes[8] << 8) | bytes[9],
      tracks: (bytes[10] << 8) | bytes[11],
      division: (bytes[12] << 8) | bytes[13]
    })

    // Skip MIDI header (14 bytes)
    position += 14

    // Parse MIDI track
    while (position < bytes.length) {
      // Read delta time
      const deltaTime = readVariableLengthQuantity(bytes, position)
      position += deltaTime.bytesRead
      currentTick += deltaTime.value

      // Read event
      const eventType = bytes[position]
      const command = eventType & 0xF0
      const channel = eventType & 0x0F
      position++

      if (command === 0x90 || command === 0x80) { // Note On or Note Off
        const noteNumber = bytes[position]
        const velocity = bytes[position + 1]
        position += 2

        const octave = Math.floor(noteNumber / 12) - 1
        const noteIndex = noteNumber % 12
        const noteName = NOTES[noteIndex]

        // Convert ticks to beats
        const timeInBeats = currentTick / TICKS_PER_BEAT

        if (command === 0x90 && velocity > 0) { // Note On
          activeNotes.set(noteNumber, {
            note: noteName,
            octave,
            startTime: timeInBeats,
            duration: 0 // Will be set when note off is received
          })
        } else { // Note Off or Note On with velocity 0
          const activeNote = activeNotes.get(noteNumber)
          if (activeNote) {
            activeNote.duration = timeInBeats - activeNote.startTime
            if (activeNote.duration > 0) {
              completedNotes.push(activeNote)
            }
            activeNotes.delete(noteNumber)
          }
        }
      } else {
        // Skip other events (2 data bytes)
        position += 2
      }
    }

    // Sort notes by start time
    const sortedNotes = completedNotes.sort((a, b) => a.startTime - b.startTime)

    // Debug output
    console.log('First 3 parsed notes:', sortedNotes.slice(0, 3))
    console.log('Total notes parsed:', sortedNotes.length)

    return sortedNotes
  } catch (error) {
    console.error('Error parsing MIDI data:', error)
    return []
  }
}

function readVariableLengthQuantity(bytes: Uint8Array, position: number): { value: number, bytesRead: number } {
  let value = 0
  let bytesRead = 0
  let byte

  do {
    byte = bytes[position + bytesRead]
    value = (value << 7) | (byte & 0x7F)
    bytesRead++
  } while (byte & 0x80)

  return { value, bytesRead }
}
