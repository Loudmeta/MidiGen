import { NoteSequence } from '../types'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const TICKS_PER_BEAT = 480 // Standard MIDI resolution

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
    let currentTime = 0
    
    // Skip MIDI header
    position += 14

    // Parse MIDI track
    while (position < bytes.length) {
      const deltaTime = readVariableLengthQuantity(bytes, position)
      position += deltaTime.bytesRead
      currentTime += deltaTime.value

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
          
          // Convert ticks to milliseconds (assuming 120 BPM)
          // At 120 BPM, one beat = 500ms
          // So, ticks * (500 / TICKS_PER_BEAT) = ms
          const timeInMs = (currentTime * 500) / TICKS_PER_BEAT

          notes.push([noteName, octave, timeInMs])
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
