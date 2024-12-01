export type Note = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#';
export type NoteSequence = [Note, number, number][];

export interface Message {
  text: string;
  isUser: boolean;
  noteSequence?: NoteSequence;
}

export interface ValidationError {
  message: string;
  details: string;
}

export interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}