interface JSONDisplayProps {
  data: Array<[string, number, number]>;
}

export const JSONDisplay = ({ data }: JSONDisplayProps) => {
  return (
    <div className="font-mono text-sm bg-gray-950/50 p-3 rounded-lg overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="text-left p-2">Note</th>
            <th className="text-left p-2">Octave</th>
            <th className="text-left p-2">Duration (ms)</th>
          </tr>
        </thead>
        <tbody>
          {data.map(([note, octave, duration], index) => (
            <tr key={index} className="border-b border-gray-800/50">
              <td className="p-2 text-blue-400">{note}</td>
              <td className="p-2 text-green-400">{octave}</td>
              <td className="p-2 text-purple-400">{duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};