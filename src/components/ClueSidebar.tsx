import { Clue } from '../types';
import { FileText } from 'lucide-react';

interface ClueSidebarProps {
  clues: Clue[];
  onClueClick: (clue: Clue) => void;
  selectedEvidenceIds?: string[];
}

export function ClueSidebar({ clues, onClueClick, selectedEvidenceIds = [] }: ClueSidebarProps) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-48 h-[60%] bg-stone-900/90 border-2 border-stone-700 p-3 rounded-lg shadow-2xl flex flex-col z-[70]">
      <div className="flex items-center justify-between mb-3 border-b border-stone-700 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-stone-400" />
          <span className="text-sm font-bold text-stone-200 pixel-font tracking-tighter">线索库</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {clues.length === 0 ? (
          <div className="h-full flex items-center justify-center text-stone-600 text-[10px] italic">
            暂无线索...
          </div>
        ) : (
          clues.map((clue) => {
            const isSelected = selectedEvidenceIds.includes(clue.id);
            return (
              <div
                key={clue.id}
                onClick={() => onClueClick(clue)}
                className={`group flex gap-2 p-2 border rounded transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-900/20 shadow-[inset_0_0_8px_rgba(59,130,246,0.3)]'
                    : 'bg-stone-950 border-stone-800 hover:border-blue-500 hover:bg-stone-800'
                }`}
              >
                <div className="w-10 h-10 flex-shrink-0 bg-stone-900 rounded flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {clue.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] font-bold truncate group-hover:text-blue-400 ${isSelected ? 'text-blue-400' : 'text-stone-300'}`}>
                    {clue.name}
                  </div>
                  <div className="text-[9px] text-stone-500 line-clamp-2 leading-tight">
                    {clue.description}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
