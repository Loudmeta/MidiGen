export type Note = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#';
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type NoteSequence = [Note, Octave, number][];

export interface Message {
  text: string;
  isUser: boolean;
  error?: boolean;
  parsedJSON?: NoteSequence;
}

export interface ValidationError {
  message: string;
  details?: string;
}