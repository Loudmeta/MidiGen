import { NoteSequence } from '../types';
import { Music } from 'lucide-react';

interface JSONDisplayProps {
  data: NoteSequence;
}

export const JSONDisplay = ({ data }: JSONDisplayProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-blue-400">
        <Music size={16} />
        <span className="text-sm font-medium">Musical Sequence</span>
      </div>
      <div className="font-mono text-sm bg-gray-950/50 p-3 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left p-2 font-medium">#</th>
              <th className="text-left p-2 font-medium">Note</th>
              <th className="text-left p-2 font-medium">Octave</th>
              <th className="text-left p-2 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {data.map(([note, octave, duration], index) => (
              <tr 
                key={index} 
                className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors"
              >
                <td className="p-2 text-gray-500">{index + 1}</td>
                <td className="p-2 text-blue-400 font-semibold">{note}</td>
                <td className="p-2 text-green-400">{octave}</td>
                <td className="p-2 text-purple-400">{duration}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-500">
        Total notes: {data.length} | Total duration: {data.reduce((acc, [,,dur]) => acc + dur, 0)}ms
      </div>
    </div>
  );
};