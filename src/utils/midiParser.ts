import { NoteSequence } from '../types'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const parseMidiToNoteSequence = (midiDataUri: string): NoteSequence => {
  try {
    // Remove the data URI prefix to get the base64 data
    const base64Data = midiDataUri.split(',')[1]
    const binaryString = window.atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Parse MIDI file structure
    let position = 0
    const notes: NoteSequence = []
    
    // Skip MIDI header
    position += 14

    // Parse MIDI track
    while (position < bytes.length) {
      const eventType = bytes[position]
      position++

      if ((eventType & 0xF0) === 0x90) { // Note On event
        const noteNumber = bytes[position]
        const velocity = bytes[position + 1]
        position += 2

        if (velocity > 0) { // Note On with velocity > 0
          const octave = Math.floor(noteNumber / 12) - 1
          const noteIndex = noteNumber % 12
          const noteName = NOTES[noteIndex]
          
          // Calculate duration (assuming 500ms per beat)
          const duration = 500 // Default to one beat

          notes.push([noteName, octave, duration])
        }
      } else {
        // Skip other events
        position += 2
      }
    }

    return notes
  } catch (error) {
    console.error('Error parsing MIDI data:', error)
    return []
  }
}
