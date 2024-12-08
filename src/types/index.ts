export interface NoteSequence {
  notes: Array<{
    pitch: number;
    startTime: number;
    endTime: number;
    velocity: number;
  }>;
  totalTime: number;
  tempoChanges?: Array<{
    time: number;
    qpm: number;
  }>;
}

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'loading' | 'completed';
}

export interface MessageContent {
  title: string;
  tasks: Task[];
  response: string;
}

export interface Message {
  text: string | MessageContent;
  isUser: boolean;
  noteSequence?: NoteSequence;
}
