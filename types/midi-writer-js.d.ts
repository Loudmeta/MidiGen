declare module 'midi-writer-js' {
  export class Track {
    constructor();
    addEvent(event: any[]): this;
    setTempo(bpm: number): this;
  }

  export class NoteEvent {
    constructor(options: {
      pitch?: string[] | number[];
      duration?: string;
      sequential?: boolean;
      velocity?: number;
      channel?: number;
    });
  }

  export class Writer {
    constructor(track: Track);
    buildFile(): Uint8Array;
    base64(): string;
    dataUri(): string;
  }
} 