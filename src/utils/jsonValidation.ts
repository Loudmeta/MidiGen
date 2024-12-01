import { Note, NoteSequence, ValidationError } from '../types';

const VALID_NOTES: Note[] = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

export const validateJSONResponse = (response: string): NoteSequence => {
  try {
    // First, try to parse the JSON
    const parsed = JSON.parse(response.trim());

    // Check if it's an array
    if (!Array.isArray(parsed)) {
      throw {
        message: 'Invalid response format',
        details: 'Response must be an array'
      } as ValidationError;
    }

    // Validate each element in the array
    parsed.forEach((item, index) => {
      if (!Array.isArray(item) || item.length !== 3) {
        throw {
          message: 'Invalid note sequence format',
          details: `Item at index ${index} must be an array of exactly 3 elements`
        } as ValidationError;
      }

      const [note, octave, duration] = item;

      if (!VALID_NOTES.includes(note as Note)) {
        throw {
          message: 'Invalid note value',
          details: `Note "${note}" at index ${index} is not valid. Must be one of: ${VALID_NOTES.join(', ')}`
        } as ValidationError;
      }

      if (!Number.isInteger(octave) || octave < 0 || octave > 9) {
        throw {
          message: 'Invalid octave value',
          details: `Octave ${octave} at index ${index} must be an integer between 0 and 9`
        } as ValidationError;
      }

      if (!Number.isInteger(duration) || duration <= 0) {
        throw {
          message: 'Invalid duration value',
          details: `Duration ${duration} at index ${index} must be a positive integer`
        } as ValidationError;
      }
    });

    return parsed as NoteSequence;
  } catch (error) {
    if ((error as ValidationError).message) {
      throw error;
    }
    throw {
      message: 'JSON parsing error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    } as ValidationError;
  }
};