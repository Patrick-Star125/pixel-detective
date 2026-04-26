import { NPCS, NPC_INFO } from '../gameData';

interface IdentifyKillerMenuProps {
  onConfirm: (npcId: string) => void;
  onCancel: () => void;
}

export function IdentifyKillerMenu({ onConfirm, onCancel }: IdentifyKillerMenuProps) {
  const suspects = Object.entries(NPC_INFO);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
       <div className="bg-gray-900 border border-red-900 rounded-lg shadow-2xl p-8 min-w-[350px]">
          <h2 className="text-2xl font-bold text-red-500 mb-2 text-center">⚖️ 指认凶手</h2>
          <p className="text-gray-400 text-sm mb-6 text-center">请选择你认为的凶手。此操作不可撤销！</p>
          
          <div className="flex flex-col gap-3">
             {suspects.map(([id, info]) => (
                <button 
                  key={id}
                  onClick={() => onConfirm(id)}
                  className="bg-red-900/40 hover:bg-red-800 text-white py-3 rounded border border-red-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>{info.icon}</span> {info.name}
                </button>
             ))}
             <button 
                  onClick={onCancel}
                  className="mt-4 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded border border-gray-700 transition-colors"
                >
                  取消
             </button>
          </div>
       </div>
    </div>
  );
}
