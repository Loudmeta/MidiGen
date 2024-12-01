import * as MidiWriter from 'midi-writer-js';

interface Note {
  pitch: string;
  octave: number;
  duration: number;
  velocity: number;
}

interface MusicData {
  melodyLine: Note[];
  chordProgression: Note[];
  bassLine: Note[];
}

// Convert milliseconds to MIDI ticks (assuming 480 ticks per quarter note at 120 BPM)
function msToTicks(ms: number): number {
  // At 120 BPM, one quarter note = 500ms
  // 480 ticks = 500ms
  // Therefore, 1ms = 480/500 ticks
  return Math.round((ms * 480) / 500);
}

// Convert note name to MIDI number
function noteToMidi(note: string, octave: number): number {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteIndex = notes.indexOf(note);
  
  if (noteIndex === -1) {
    throw new Error(`Invalid note: ${note}`);
  }
  
  return noteIndex + ((octave + 1) * 12);
}

// Create a track with notes
function createTrack(notes: Note[], channel: number): MidiWriter.Track {
  const track = new MidiWriter.Track();
  
  // Set the track channel
  track.setTempo(120);
  track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: channel}));

  notes.forEach(note => {
    try {
      const pitch = noteToMidi(note.pitch, note.octave);
      const ticks = msToTicks(note.duration);
      
      track.addEvent(new MidiWriter.NoteEvent({
        pitch: [pitch],
        duration: 'T' + ticks,
        velocity: note.velocity,
        channel: channel
      }));
    } catch (error) {
      console.error(`Error adding note: ${note.pitch}${note.octave}`, error);
    }
  });

  return track;
}

export function createMidiFile(musicData: MusicData): string {
  try {
    // Create tracks for each musical line
    const melodyTrack = createTrack(musicData.melodyLine, 1);  // Channel 1
    const chordTrack = createTrack(musicData.chordProgression, 2);  // Channel 2
    const bassTrack = createTrack(musicData.bassLine, 3);  // Channel 3

    // Create writer with all tracks
    const writer = new MidiWriter.Writer([melodyTrack, chordTrack, bassTrack]);
    
    // Return data URI for the MIDI file
    return writer.dataUri();
  } catch (error) {
    console.error('Error creating MIDI file:', error);
    throw error;
  }
}

// Helper function to parse LLM response into MusicData format
export function parseLLMResponse(response: string): MusicData {
  try {
    // Extract JSON from markdown response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const musicData = JSON.parse(jsonMatch[1]);
    
    // Validate and transform the data
    return {
      melodyLine: musicData.melodyLine.map(([pitch, octave, duration, velocity]: [string, number, number, number]) => ({
        pitch,
        octave,
        duration,
        velocity
      })),
      chordProgression: musicData.chordProgression.map(([pitch, octave, duration, velocity]: [string, number, number, number]) => ({
        pitch,
        octave,
        duration,
        velocity
      })),
      bassLine: musicData.bassLine.map(([pitch, octave, duration, velocity]: [string, number, number, number]) => ({
        pitch,
        octave,
        duration,
        velocity
      }))
    };
  } catch (error) {
    console.error('Error parsing LLM response:', error);
    throw error;
  }
} 